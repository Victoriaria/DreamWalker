#!/usr/bin/env python3
"""One-shot: record + merge + copy to Downloads."""
import pathlib, shutil, subprocess, sys, time

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "output"
OUT.mkdir(exist_ok=True)
RAW = OUT / "screen_raw.webm"
AUDIO = OUT / "narration.mp3"
FINAL = OUT / "DreamWalker-Demo.mp4"
DOWNLOADS = pathlib.Path.home() / "Downloads" / "DreamWalker-Demo.mp4"
URL = "http://127.0.0.1:5173"
W = time.sleep

FRAGS = [
    "我在一座会呼吸的图书馆里醒来，书架像潮水一样退开，妈妈站在月光尽头没有说话。",
    "后来我坐上一列没有车窗的列车，胸口发紧，车票上写着未来两个字，脚下却全是海水。",
    "我想追上她，可走廊越来越长，灯一盏一盏熄灭，只剩海浪声在背后。",
]


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def duration(path):
    r = subprocess.run([ffmpeg(), "-i", str(path), "-hide_banner"], capture_output=True, text=True)
    for line in r.stderr.splitlines():
        if "Duration:" in line:
            p = line.split("Duration:")[1].split(",")[0].strip()
            if "N/A" in p:
                return 0.0
            h, m, s = p.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    return 0.0


def record():
    from playwright.sync_api import sync_playwright

    if RAW.exists():
        RAW.unlink()
    for p in OUT.glob("page*.webm"):
        p.unlink()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome", headless=True)
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir=str(OUT),
            record_video_size={"width": 1440, "height": 900},
            locale="zh-CN",
        )
        page = ctx.new_page()
        page.set_default_timeout(20000)
        page.goto(URL, wait_until="domcontentloaded")
        page.evaluate(
            "() => Object.keys(localStorage).filter(k=>k.startsWith('dreamwalker:')).forEach(k=>localStorage.removeItem(k))"
        )
        page.reload(wait_until="domcontentloaded")
        W(1)
        page.locator("#travelerName").fill("演示旅人")
        page.locator("#travelerForm button[type='submit']").click()
        W(1.2)
        page.locator('[data-route="capture"]').click()
        W(0.8)
        for i, text in enumerate(FRAGS):
            if i:
                page.locator("#addFragment").click()
                W(0.3)
            page.locator("#fragments textarea").nth(i).fill(text)
            W(0.4)
        page.locator(".mock-speech-button").first.click()
        W(1)
        page.locator('[data-emotion="思念"]').click()
        W(0.4)
        page.locator("#intensity").fill("7")
        W(0.3)
        page.locator('[data-body="胸口发紧"]').click()
        W(0.3)
        page.locator('[data-body="脚步沉"]').click()
        W(0.3)
        page.locator('[data-atmosphere="青蓝"]').click()
        W(0.5)
        page.locator("#generateDream").click()
        page.locator("#togglePlay").wait_for(state="visible", timeout=20000)
        W(1)
        page.locator("#togglePlay").click()
        W(6)
        page.locator("#toggleSoundscape").click()
        W(3)
        for _ in range(5):
            nxt = page.locator("#nextScene")
            if nxt.is_disabled():
                break
            nxt.click()
            W(2)
        page.locator("#afterword").fill("醒来以后，胸口还是紧的，但好像没那么怕了。")
        W(0.6)
        page.locator("#saveAfterword").click()
        W(1.5)
        page.locator('[data-route="gallery"]').click()
        W(1.5)
        if page.locator(".dream-card").count():
            page.locator(".dream-card").first.click()
            W(1.5)
        page.locator('[data-route="calendar"]').click()
        W(1.2)
        day = page.locator(".day-cell .moon-dot").first.locator("xpath=ancestor::button[1]")
        if day.count():
            day.click()
            W(1)
        page.reload(wait_until="domcontentloaded")
        W(2)
        video = page.video.path()
        ctx.close()
        browser.close()
        shutil.move(video, RAW)
        print(f"recorded {RAW}")


def merge():
    if not RAW.exists():
        raise FileNotFoundError(RAW)
    if not AUDIO.exists():
        raise FileNotFoundError(AUDIO)
    vlen = duration(RAW)
    alen = duration(AUDIO)
    pad = max(0.0, alen - vlen + 0.3)
    ff = ffmpeg()
    cmd = [
        ff, "-y", "-i", str(RAW), "-i", str(AUDIO),
        "-filter_complex",
        f"[0:v]scale=1440:900:flags=lanczos,setsar=1,fps=30,format=yuv420p,tpad=stop_mode=clone:stop_duration={pad:.3f}[vout]",
        "-map", "[vout]", "-map", "1:a:0",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest",
        str(FINAL),
    ]
    subprocess.run(cmd, check=True)
    print(f"merged {FINAL} ({duration(FINAL):.1f}s)")


def main():
    if not AUDIO.exists():
        subprocess.run([sys.executable, str(ROOT / "generate_narration.py")], check=True)
    record()
    merge()
    shutil.copy2(FINAL, DOWNLOADS)
    print(f"copied to {DOWNLOADS}")


if __name__ == "__main__":
    main()
