#!/usr/bin/env python3
"""Merge screen recording with narration into final demo MP4."""
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent
OUT_DIR = ROOT / "output"
VIDEO_IN = OUT_DIR / "screen_raw.webm"
AUDIO_IN = OUT_DIR / "narration.mp3"
VIDEO_OUT = OUT_DIR / "DreamWalker-Demo.mp4"


def ffmpeg_exe():
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def media_duration(path: pathlib.Path) -> float:
    ff = ffmpeg_exe()
    result = subprocess.run(
        [ff, "-i", str(path), "-hide_banner"],
        capture_output=True,
        text=True,
    )
    for line in result.stderr.splitlines():
        if "Duration:" in line:
            part = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = part.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise RuntimeError(f"Could not read duration for {path}")


def merge():
    if not VIDEO_IN.exists():
        raise FileNotFoundError(f"Missing screen recording: {VIDEO_IN}")
    if not AUDIO_IN.exists():
        raise FileNotFoundError(f"Missing narration: {AUDIO_IN}")

    video_len = media_duration(VIDEO_IN)
    audio_len = media_duration(AUDIO_IN)
    pad = max(0.0, audio_len - video_len + 0.5)

    filter_graph = (
        f"[0:v]scale=1440:900:flags=lanczos,setsar=1,fps=30,format=yuv420p,"
        f"tpad=stop_mode=clone:stop_duration={pad:.3f}[vout]"
    )

    cmd = [
        ffmpeg_exe(),
        "-y",
        "-i",
        str(VIDEO_IN),
        "-i",
        str(AUDIO_IN),
        "-filter_complex",
        filter_graph,
        "-map",
        "[vout]",
        "-map",
        "1:a:0",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "22",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        "-shortest",
        str(VIDEO_OUT),
    ]
    print("Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)
    final_len = media_duration(VIDEO_OUT)
    print(f"Saved {VIDEO_OUT} ({final_len:.1f}s)")
    if final_len < 180 or final_len > 360:
        print(
            f"Note: final duration {final_len:.1f}s is outside 3-6 minute target.",
            file=sys.stderr,
        )


if __name__ == "__main__":
    merge()
