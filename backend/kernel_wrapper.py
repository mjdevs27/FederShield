import sys
import json
import io
import traceback
import os
import base64
from contextlib import redirect_stdout, redirect_stderr

# Try to import matplotlib to setup Agg backend for headless plotting
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False

# Persistent global namespace for the notebook session
globals_dict = {
    "__name__": "__main__",
    "__doc__": None,
    "__package__": None,
    "__loader__": None,
    "__spec__": None,
    "__annotations__": {},
    "__builtins__": __builtins__,
}

def get_plots():
    if not HAS_MATPLOTLIB:
        return []
    
    plots = []
    try:
        for i in plt.get_fignums():
            fig = plt.figure(i)
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            img_str = base64.b64encode(buf.read()).decode('utf-8')
            plots.append(f"data:image/png;base64,{img_str}")
        plt.close('all') # Clear figures for next execution
    except Exception:
        pass
    return plots

def main():
    # Initial setup: move to workspace if provided as argument
    if len(sys.argv) > 1:
        workspace = sys.argv[1]
        if os.path.exists(workspace):
            os.chdir(workspace)
            sys.path.insert(0, workspace)

    print("KERNEL_READY")
    sys.stdout.flush()

    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            
            data = json.loads(line)
            code = data.get("code", "")
            
            # Special handling for ! commands (shell)
            if code.strip().startswith('!'):
                import subprocess
                import importlib
                shell_cmd = code.strip()[1:]
                
                # If command is pip, force use of the current python executable
                if shell_cmd.startswith('pip '):
                    # Replace 'pip ' with '{sys.executable} -m pip '
                    shell_cmd = f'"{sys.executable}" -m ' + shell_cmd

                result = subprocess.run(shell_cmd, shell=True, capture_output=True, text=True)
                
                # Invalidate caches so newly installed packages are importable immediately
                importlib.invalidate_caches()
                
                print(json.dumps({
                    "stdout": result.stdout,
                    "stderr": result.stderr,
                    "plots": []
                }))
                sys.stdout.flush()
                continue

            stdout_buf = io.StringIO()
            stderr_buf = io.StringIO()
            
            error = None
            try:
                with redirect_stdout(stdout_buf), redirect_stderr(stderr_buf):
                    # We use exec with the same globals_dict every time
                    # To support returning the last expression like a REPL, 
                    # we could try to compile it as 'single', but 'exec' is safer for multi-line blocks.
                    exec(code, globals_dict)
            except Exception:
                error = traceback.format_exc()

            plots = get_plots()

            response = {
                "stdout": stdout_buf.getvalue(),
                "stderr": stderr_buf.getvalue(),
                "error": error,
                "plots": plots
            }
            
            print(json.dumps(response))
            sys.stdout.flush()
            
        except Exception as e:
            # Fatal error in the wrapper loop itself
            print(json.dumps({"error": f"Kernel Internal Error: {str(e)}", "stdout": "", "stderr": ""}))
            sys.stdout.flush()

if __name__ == "__main__":
    main()
