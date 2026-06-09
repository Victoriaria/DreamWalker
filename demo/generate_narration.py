#!/usr/bin/env python3
"""Generate Chinese male narration audio for DreamWalker demo."""
import asyncio
import pathlib
import subprocess
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent
TEXT_FILE = ROOT / "narration.txt"
OUT_MP3 = ROOT / "output" / "narration.mp3"
# 云扬：成熟、稳重的男声新闻播报风格
VOICE = "zh-CN-YunyangNeural"
RATE = "-8%"  # 略慢，更沉稳


def ffmpeg_exe():
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def probe_duration(path: pathlib.Path) -> float:
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
    return 0.0


async def main():
    text = TEXT_FILE.read_text(encoding="utf-8").strip()
    OUT_MP3.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(OUT_MP3))
    duration = probe_duration(OUT_MP3)
    print(f"Saved {OUT_MP3} ({duration:.1f}s)")
    if duration < 180:
        print("Warning: narration shorter than 3 minutes", file=sys.stderr)
    elif duration > 360:
        print("Warning: narration longer than 6 minutes", file=sys.stderr)
    return duration


if __name__ == "__main__":
    asyncio.run(main())
