#!/usr/bin/env python3
"""One-shot pipeline: narration + screen record + merge."""
import pathlib
import subprocess
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parent
PROJECT = ROOT.parent


def run(cmd, **kwargs):
    print("$", " ".join(str(part) for part in cmd))
    subprocess.run(cmd, check=True, **kwargs)


def wait_for_server(url: str, timeout: float = 20.0) -> None:
    import urllib.error
    import urllib.request

    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2):
                return
        except (urllib.error.URLError, TimeoutError):
            time.sleep(0.4)
    raise TimeoutError(f"Server did not start: {url}")


def main():
    OUT_DIR = ROOT / "output"
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", "5173"],
        cwd=str(PROJECT),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        wait_for_server("http://127.0.0.1:5173/")
        run([sys.executable, str(ROOT / "generate_narration.py")])
        run([sys.executable, str(ROOT / "record_demo.py")])
        run([sys.executable, str(ROOT / "merge_demo.py")])
        print(f"\nDemo ready: {OUT_DIR / 'DreamWalker-Demo.mp4'}")
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()


if __name__ == "__main__":
    main()
