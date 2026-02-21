import subprocess
import os
import json
import time
import sys
import threading
from typing import Dict, Optional

class RuntimeSession:
    def __init__(self, notebook_id: str, workspace_root: str):
        self.notebook_id = notebook_id
        self.workspace_path = os.path.join(workspace_root, notebook_id)
        os.makedirs(self.workspace_path, exist_ok=True)
        
        # Create common directories
        os.makedirs(os.path.join(self.workspace_path, "models"), exist_ok=True)
        os.makedirs(os.path.join(self.workspace_path, "data"), exist_ok=True)

        self.process: Optional[subprocess.Popen] = None
        self.last_used = time.time()
        self.lock = threading.Lock()
        self.start_kernel()

    def start_kernel(self):
        # We run the wrapper script using the same executable
        kernel_script = os.path.join(os.path.dirname(__file__), "kernel_wrapper.py")
        env = os.environ.copy()
        env['MPLBACKEND'] = 'Agg'
        self.process = subprocess.Popen(
            [sys.executable, kernel_script, self.workspace_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            env=env
        )
        # Wait for the KERNEL_READY signal
        line = self.process.stdout.readline()
        if "KERNEL_READY" not in line:
             print(f"Warning: Kernel for {self.notebook_id} might not have started correctly: {line}")

    def execute(self, code: str, timeout: int = 30):
        with self.lock:
            self.last_used = time.time()
            if not self.process or self.process.poll() is not None:
                self.start_kernel()
            
            # Send code as JSON to kernel
            task = json.dumps({"code": code})
            try:
                self.process.stdin.write(task + "\n")
                self.process.stdin.flush()
            except Exception as e:
                self.start_kernel()
                self.process.stdin.write(task + "\n")
                self.process.stdin.flush()
            
            # Check if this is a shell command (!pip, etc.)
            # Shell commands (installations) should NOT have a timeout
            is_shell_cmd = code.strip().startswith('!')
            current_timeout = None if is_shell_cmd else timeout

            result_container = {}
            def read_response(container):
                try:
                    line = self.process.stdout.readline()
                    if line:
                        container['data'] = json.loads(line)
                except Exception as e:
                    container['error'] = str(e)

            thread = threading.Thread(target=read_response, args=(result_container,))
            thread.start()
            
            # Wait with conditional timeout
            thread.join(timeout=current_timeout)

            if thread.is_alive():
                # If it's a shell command and still running, we keep waiting (async-like behavior)
                # For standard code, we terminate after 30s
                if not is_shell_cmd:
                    self.terminate()
                    self.start_kernel()
                    return {"stdout": "", "stderr": f"Execution exceeded {timeout}s limit. Kernel restarted.", "error": "TimeoutError", "plots": []}
                else:
                    # Optional: We could return "Still installing..." but for now we wait
                    thread.join() 
            
            return result_container.get('data', {"stdout": "", "stderr": "Unexpected kernel exit", "error": "KernelError", "plots": []})

    def terminate(self):
        if self.process:
            self.process.terminate()
            try:
                self.process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                self.process.kill()

class RuntimeManager:
    def __init__(self):
        self.sessions: Dict[str, RuntimeSession] = {}
        self.workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "workspaces"))
        os.makedirs(self.workspace_root, exist_ok=True)
        
        # Start a cleanup thread
        self.cleanup_thread = threading.Thread(target=self._cleanup_loop, daemon=True)
        self.cleanup_thread.start()

    def get_session(self, notebook_id: str) -> RuntimeSession:
        if notebook_id not in self.sessions:
            self.sessions[notebook_id] = RuntimeSession(notebook_id, self.workspace_root)
        return self.sessions[notebook_id]

    def restart_session(self, notebook_id: str):
        if notebook_id in self.sessions:
            self.sessions[notebook_id].terminate()
            self.sessions[notebook_id] = RuntimeSession(notebook_id, self.workspace_root)
        return {"message": "Kernel restarted successfully"}

    def _cleanup_loop(self):
        while True:
            time.sleep(60)
            now = time.time()
            to_delete = []
            for nb_id, session in self.sessions.items():
                # Timeout after 30 minutes of inactivity
                if now - session.last_used > 1800:
                    to_delete.append(nb_id)
            
            for nb_id in to_delete:
                print(f"Cleaning up inactive session for {nb_id}")
                self.sessions[nb_id].terminate()
                del self.sessions[nb_id]

# Global instance
manager = RuntimeManager()
