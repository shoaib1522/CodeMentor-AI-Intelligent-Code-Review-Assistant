"""Code Parsing Tools for MCP Server"""
import ast
import re
from typing import Dict, List, Any


class CodeParser:
    """Parse code in multiple languages"""

    LANGUAGES = {
        "python": "py",
        "javascript": "js",
        "typescript": "ts",
        "java": "java",
        "cpp": "cpp",
        "csharp": "cs",
        "go": "go",
        "rust": "rs",
        "sql": "sql",
        "html": "html",
    }

    @staticmethod
    def parse_python(code: str) -> Dict[str, Any]:
        """Parse Python code"""
        try:
            tree = ast.parse(code)
            return {
                "valid": True,
                "functions": CodeParser._extract_python_functions(tree),
                "classes": CodeParser._extract_python_classes(tree),
                "imports": CodeParser._extract_python_imports(tree),
                "line_count": len(code.split('\n')),
            }
        except SyntaxError as e:
            return {
                "valid": False,
                "error": str(e),
                "line": e.lineno,
                "offset": e.offset,
            }

    @staticmethod
    def parse_javascript(code: str) -> Dict[str, Any]:
        """Parse JavaScript code"""
        # Basic JavaScript parsing without AST
        return {
            "valid": True,
            "functions": re.findall(r'(?:function|const|let|var)\s+(\w+)\s*(?:=\s*)?(?:function|\()', code),
            "classes": re.findall(r'class\s+(\w+)', code),
            "imports": re.findall(r'import\s+(?:.*\s+)?from\s+[\'"]([^\'"]+)[\'"]', code),
            "line_count": len(code.split('\n')),
        }

    @staticmethod
    def parse_generic(code: str) -> Dict[str, Any]:
        """Generic code parsing"""
        lines = code.split('\n')
        return {
            "valid": True,
            "line_count": len(lines),
            "longest_line": max(len(line) for line in lines) if lines else 0,
            "average_line_length": sum(len(line) for line in lines) / len(lines) if lines else 0,
            "code_lines": len([l for l in lines if l.strip() and not l.strip().startswith('#')]),
            "comment_lines": len([l for l in lines if l.strip().startswith('#')]),
        }

    @staticmethod
    def _extract_python_functions(tree: ast.AST) -> List[Dict[str, Any]]:
        """Extract function definitions"""
        functions = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                functions.append({
                    "name": node.name,
                    "line": node.lineno,
                    "args": [arg.arg for arg in node.args.args],
                    "docstring": ast.get_docstring(node),
                })
        return functions

    @staticmethod
    def _extract_python_classes(tree: ast.AST) -> List[Dict[str, Any]]:
        """Extract class definitions"""
        classes = []
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                classes.append({
                    "name": node.name,
                    "line": node.lineno,
                    "bases": [ast.unparse(base) for base in node.bases],
                    "docstring": ast.get_docstring(node),
                })
        return classes

    @staticmethod
    def _extract_python_imports(tree: ast.AST) -> List[str]:
        """Extract imports"""
        imports = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)
        return imports


def parse_code(code: str, language: str) -> Dict[str, Any]:
    """Parse code based on language"""
    if language == "python":
        return CodeParser.parse_python(code)
    elif language in ["javascript", "typescript"]:
        return CodeParser.parse_javascript(code)
    else:
        return CodeParser.parse_generic(code)
