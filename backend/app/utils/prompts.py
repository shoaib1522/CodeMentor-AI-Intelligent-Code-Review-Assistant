"""LLM Prompts for Code Review"""

def get_code_review_prompt(code: str, language: str) -> str:
    """Get the code review prompt for Groq API"""
    return f"""You are an expert code reviewer. Review the following {language} code for:
1. Security vulnerabilities (OWASP Top 10, CWE)
2. Code quality issues (complexity, maintainability)
3. Best practices and improvements
4. Performance concerns

Code:
```{language}
{code}
```

Provide a comprehensive review in VALID JSON format (ensure proper JSON syntax):
{{
    "vulnerabilities": [
        {{
            "type": "vulnerability type",
            "severity": "critical|high|medium|low|info",
            "line": 1,
            "message": "brief message",
            "description": "detailed description",
            "recommendation": "how to fix it",
            "cwe": "CWE-XXX"
        }}
    ],
    "codeQuality": {{
        "complexity": 1-10,
        "maintainability": 0-100,
        "coverage": 0-100,
        "duplication": 0-100,
        "issues": ["issue1", "issue2"]
    }},
    "suggestions": [
        {{
            "category": "category",
            "priority": "high|medium|low",
            "message": "message",
            "suggestion": "suggestion"
        }}
    ],
    "summary": "overall summary of the review",
    "overallScore": 0-100
}}

IMPORTANT: Return ONLY valid JSON, no additional text."""


def get_security_focus_prompt(code: str, language: str) -> str:
    """Get security-focused review prompt"""
    return f"""Review this {language} code focusing on SECURITY vulnerabilities:

Code:
```{language}
{code}
```

Check for: SQL Injection, Command Injection, XSS, Authentication Issues, Hardcoded Secrets, etc.

Return JSON format:
{{
    "vulnerabilities": [
        {{
            "type": "vulnerability",
            "severity": "critical|high|medium|low",
            "line": number,
            "message": "description",
            "recommendation": "fix",
            "cwe": "CWE-89"
        }}
    ],
    "summary": "security assessment"
}}"""


def get_quality_focus_prompt(code: str, language: str) -> str:
    """Get quality-focused review prompt"""
    return f"""Review this {language} code for QUALITY and MAINTAINABILITY:

Code:
```{language}
{code}
```

Assess: Complexity, Duplication, Documentation, Testing, Refactoring Needs

Return JSON format:
{{
    "codeQuality": {{
        "complexity": 1-10,
        "maintainability": 0-100,
        "duplication": 0-100,
        "issues": ["issue1", "issue2"]
    }},
    "suggestions": [
        {{
            "category": "category",
            "priority": "high|medium|low",
            "message": "description",
            "suggestion": "improvement"
        }}
    ]
}}"""
