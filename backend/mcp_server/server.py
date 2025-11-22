"""MCP Server for CodeMentor AI - Code Analysis Tools"""
import ast
import json
import re
from typing import Any, Dict, List

class CodeAnalyzer:
    """Analyzes code for vulnerabilities and quality metrics"""

    VULNERABILITY_PATTERNS = {
        "sql_injection": [
            r".*\+.*query.*\+.*",
            r".*execute.*string.*interpolation.*",
            r".*\"\s*\+\s*.*user.*\+\s*\".*",
        ],
        "command_injection": [
            r"os\.system\s*\(",
            r"subprocess\.call\s*\(",
            r"exec\s*\(",
            r"eval\s*\(",
        ],
        "hardcoded_credentials": [
            r"password\s*=\s*['\"].*['\"]",
            r"api_key\s*=\s*['\"].*['\"]",
            r"secret\s*=\s*['\"].*['\"]",
        ],
        "insecure_deserialization": [
            r"pickle\.load\s*\(",
            r"yaml\.load\s*\(",
            r"json\.loads\s*\(.*eval.*\)",
        ],
        "path_traversal": [
            r"open\s*\(\s*\.\..*\)",
            r"\.\.[\\/]",
        ],
        "xss_vulnerability": [
            r"innerHTML\s*=\s*",
            r"document\.write\s*\(",
            r"eval\s*\(",
        ],
    }

    @staticmethod
    def analyze_code(code: str, language: str) -> Dict[str, Any]:
        """Analyze code for vulnerabilities and metrics"""
        vulnerabilities = []
        metrics = {
            "complexity": 0,
            "maintainability": 100,
            "coverage": 0,
            "duplication": 0,
            "issues": []
        }

        # Check for known vulnerability patterns
        for vuln_type, patterns in CodeAnalyzer.VULNERABILITY_PATTERNS.items():
            for pattern in patterns:
                matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    line_num = code[:match.start()].count('\n') + 1
                    vulnerabilities.append({
                        "id": f"vuln_{vuln_type}_{line_num}",
                        "type": vuln_type.replace('_', ' ').title(),
                        "severity": "high" if "injection" in vuln_type else "medium",
                        "line": line_num,
                        "message": f"{vuln_type.replace('_', ' ').title()} detected",
                        "description": f"Potential {vuln_type.replace('_', ' ')} vulnerability found in code",
                        "recommendation": f"Review and fix the {vuln_type.replace('_', ' ')} vulnerability",
                        "cwe": "CWE-89" if "sql" in vuln_type else "CWE-78"
                    })

        # Calculate complexity
        try:
            tree = ast.parse(code) if language == "python" else None
            if tree:
                metrics["complexity"] = CodeAnalyzer._calculate_complexity(tree)
                metrics["maintainability"] = max(50, 100 - (metrics["complexity"] * 5))
        except:
            metrics["complexity"] = 5

        # Check for code quality issues
        lines = code.split('\n')
        metrics["issues"] = []

        # Check for long methods/functions
        for i, line in enumerate(lines):
            if len(line) > 120:
                metrics["issues"].append(f"Line {i+1}: Line too long ({len(line)} chars)")

        # Check for missing docstrings
        if language == "python":
            docstring_count = len(re.findall(r'""".*?"""', code, re.DOTALL))
            def_count = len(re.findall(r'^\s*def\s+', code, re.MULTILINE))
            if def_count > docstring_count:
                metrics["issues"].append("Missing docstrings in functions")

        return {
            "vulnerabilities": vulnerabilities,
            "metrics": metrics
        }

    @staticmethod
    def _calculate_complexity(tree: ast.AST) -> int:
        """Calculate cyclomatic complexity"""
        complexity = 1
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.For, ast.While, ast.ExceptHandler)):
                complexity += 1
        return min(complexity, 10)  # Cap at 10

    @staticmethod
    def parse_code(code: str, language: str) -> Dict[str, Any]:
        """Parse code and extract structure"""
        try:
            if language == "python":
                tree = ast.parse(code)
                return {
                    "functions": [
                        node.name for node in ast.walk(tree)
                        if isinstance(node, ast.FunctionDef)
                    ],
                    "classes": [
                        node.name for node in ast.walk(tree)
                        if isinstance(node, ast.ClassDef)
                    ],
                    "imports": [
                        node.module for node in ast.walk(tree)
                        if isinstance(node, ast.Import)
                    ],
                    "valid": True
                }
            return {"valid": True, "message": f"Language {language} parsing ready"}
        except SyntaxError as e:
            return {
                "valid": False,
                "error": str(e),
                "line": e.lineno
            }

    @staticmethod
    def check_security_rules(code: str) -> List[Dict[str, Any]]:
        """Check against security best practices"""
        issues = []

        # Check for debugging code
        if re.search(r'print\s*\(.*\)', code):
            issues.append({
                "type": "Debug Code",
                "severity": "low",
                "message": "Debug print statements found",
                "recommendation": "Remove debug code before production"
            })

        # Check for TODO comments
        todos = re.findall(r'#\s*TODO:?\s*(.+)', code)
        if todos:
            issues.append({
                "type": "Unfinished Code",
                "severity": "low",
                "message": f"Found {len(todos)} TODO comments",
                "recommendation": "Review and complete TODO items"
            })

        # Check for commented code
        if re.search(r'#.*[a-zA-Z0-9_]{3,}.*=', code):
            issues.append({
                "type": "Commented Code",
                "severity": "low",
                "message": "Commented-out code detected",
                "recommendation": "Remove or implement commented code"
            })

        return issues


class ManagedCodePlatformServer:
    """MCP Server for managing code analysis tools"""

    def __init__(self):
        self.analyzer = CodeAnalyzer()
        self.tools = {
            "analyze": self.analyze_code,
            "parse": self.parse_code,
            "security": self.check_security,
        }

    async def analyze_code(self, code: str, language: str) -> Dict[str, Any]:
        """Analyze code for vulnerabilities"""
        return self.analyzer.analyze_code(code, language)

    async def parse_code(self, code: str, language: str) -> Dict[str, Any]:
        """Parse code structure"""
        return self.analyzer.parse_code(code, language)

    async def check_security(self, code: str) -> List[Dict[str, Any]]:
        """Check security best practices"""
        return self.analyzer.check_security_rules(code)

    async def execute_tool(self, tool_name: str, **kwargs) -> Dict[str, Any]:
        """Execute a tool by name"""
        if tool_name not in self.tools:
            return {"error": f"Unknown tool: {tool_name}"}

        try:
            result = await self.tools[tool_name](**kwargs)
            return {"success": True, "data": result}
        except Exception as e:
            return {"success": False, "error": str(e)}


# Global server instance
mcp_server = ManagedCodePlatformServer()
