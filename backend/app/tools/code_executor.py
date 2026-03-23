import subprocess
import tempfile
import os
from typing import Dict


async def execute_python_code(code: str, timeout: int = 10) -> Dict[str, str]:
    """Execute Python code safely in a subprocess.

    Args:
        code: Python code to execute
        timeout: Maximum execution time in seconds

    Returns:
        Dict with: stdout, stderr, success
    """
    try:
        # Write code to temp file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_path = f.name

        # Execute in subprocess with timeout
        result = subprocess.run(
            ["python", temp_path],
            capture_output=True,
            text=True,
            timeout=timeout
        )

        # Clean up
        os.unlink(temp_path)

        return {
            "stdout": result.stdout[:3000] if result.stdout else "",
            "stderr": result.stderr[:1000] if result.stderr else "",
            "success": result.returncode == 0
        }

    except subprocess.TimeoutExpired:
        os.unlink(temp_path)
        return {
            "stdout": "",
            "stderr": f"Code execution timed out after {timeout} seconds",
            "success": False
        }
    except Exception as e:
        return {
            "stdout": "",
            "stderr": str(e),
            "success": False
        }
