#!/usr/bin/env python3
"""Record DreamWalker demo walkthrough with Playwright."""
import pathlib
import shutil
import subprocess
import time

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent
PROJECT = ROOT.parent
OUT_DIR = ROOT / "output"
VIDEO_RAW = OUT_DIR / "screen_raw.webm"
BASE_URL = "http://127.0.0.1:5173"

FRAGMENTS = [
    "我在一座会呼吸的图书馆里醒来，书架像潮水一样退开，妈妈站在月光尽头没有说话。",
    "后来我坐上一列没有车窗的列车，胸口发紧，车票上写着未来两个字，脚下却全是海水。",
    "我想追上她，可走廊越来越长，灯一盏一盏熄灭，只剩海浪声在背后。",
]
AFTERWORD = "醒来以后，胸口还是紧的，但好像没那么怕了。"


def pause(seconds: float, page=None):
    time.sleep(seconds * 0.35)


def clear_storage(page):
    page.evaluate(
        """() => {
        const keys = [];
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (key && key.startsWith('dreamwalker:')) keys.push(key);
        }
        keys.forEach((key) => localStorage.removeItem(key));
      }"""
    )


def fill_fragments(page):
    areas = page.locator("#fragments textarea")
    count = areas.count()
    for index, text in enumerate(FRAGMENTS):
        if index >= count:
            page.locator("#addFragment").click()
            pause(0.4)
        page.locator("#fragments textarea").nth(index).fill(text)
        pause(0.5)


def select_emotion_and_body(page):
    page.locator('[data-emotion="思念"]').click()
    pause(0.6)
    page.locator("#intensity").fill("7")
    pause(0.4)
    page.locator('[data-body="胸口发紧"]').click()
    pause(0.3)
    page.locator('[data-body="脚步沉"]').click()
    pause(0.4)
    page.locator('[data-atmosphere="青蓝"]').click()
    pause(0.6)


def run_demo(page):
    page.goto(BASE_URL, wait_until="networkidle")
    clear_storage(page)
    page.reload(wait_until="networkidle")
    pause(2)

    page.locator("#travelerName").fill("演示旅人")
    page.locator("#travelerForm button[type='submit']").click()
    pause(4)

    page.locator('[data-route="capture"]').click()
    pause(2)

    fill_fragments(page)
    pause(2)

    page.locator(".mock-speech-button").first.click()
    pause(3)

    select_emotion_and_body(page)
    pause(2)

    page.locator("#generateDream").click()
    pause(5)

    page.locator("#enterPlayback").click()
    pause(3)

    page.locator("#togglePlay").click()
    pause(12)

    page.locator("#toggleSoundscape").click()
    pause(6)

    for _ in range(4):
        next_btn = page.locator("#nextScene")
        if next_btn.is_disabled():
            break
        next_btn.click()
        pause(5)

    page.locator("#afterword").fill(AFTERWORD)
    pause(1.5)
    page.locator("#saveAfterword").click()
    pause(3)

    page.locator('[data-route="gallery"]').click()
    pause(4)

    page.locator(".dream-card").first.click()
    pause(4)
    page.locator('[data-route="gallery"]').click()
    pause(2)

    page.locator('[data-route="calendar"]').click()
    pause(3)
    day = page.locator(".day-cell .moon-dot").first.locator("xpath=ancestor::button[1]")
    if day.count():
        day.click()
        pause(2)
        replay = page.locator("[data-playback]").first
        if replay.count():
            replay.click()
            pause(5)
            page.locator('[data-route="calendar"]').click()
            pause(2)

    page.reload(wait_until="networkidle")
    pause(4)

    page.locator('[data-route="home"]').click()
    pause(3)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if VIDEO_RAW.exists():
        VIDEO_RAW.unlink()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir=str(OUT_DIR),
            record_video_size={"width": 1440, "height": 900},
            locale="zh-CN",
        )
        page = context.new_page()
        try:
            run_demo(page)
        finally:
            video_path = page.video.path() if page.video else None
            context.close()
            browser.close()
            if video_path:
                shutil.move(video_path, VIDEO_RAW)
                print(f"Saved {VIDEO_RAW}")
            else:
                raise RuntimeError("No video recorded")


if __name__ == "__main__":
    main()
