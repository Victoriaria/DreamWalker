#!/usr/bin/env python3
import pathlib, shutil, time
from playwright.sync_api import sync_playwright

OUT = pathlib.Path(__file__).parent / "output"
OUT.mkdir(exist_ok=True)
RAW = OUT / "screen_raw.webm"
URL = "http://127.0.0.1:5173"
W = lambda s: time.sleep(s)

FRAGS = [
    "我在一座会呼吸的图书馆里醒来，书架像潮水一样退开，妈妈站在月光尽头没有说话。",
    "后来我坐上一列没有车窗的列车，胸口发紧，车票上写着未来两个字，脚下却全是海水。",
    "我想追上她，可走廊越来越长，灯一盏一盏熄灭，只剩海浪声在背后。",
]

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, record_video_dir=str(OUT), record_video_size={"width": 1440, "height": 900}, locale="zh-CN")
    page = ctx.new_page()
    page.goto(URL, wait_until="domcontentloaded")
    page.evaluate("() => Object.keys(localStorage).filter(k=>k.startsWith('dreamwalker:')).forEach(k=>localStorage.removeItem(k))")
    page.reload(wait_until="domcontentloaded")
    W(0.8)
    page.locator("#travelerName").fill("演示旅人")
    page.locator("#travelerForm button[type='submit']").click(); W(1)
    page.locator('[data-route="capture"]').click(); W(0.6)
    for i, t in enumerate(FRAGS):
        if i: page.locator("#addFragment").click(); W(0.2)
        page.locator("#fragments textarea").nth(i).fill(t); W(0.3)
    page.locator(".mock-speech-button").first.click(); W(0.8)
    page.locator('[data-emotion="思念"]').click(); W(0.3)
    page.locator("#intensity").fill("7"); W(0.2)
    page.locator('[data-body="胸口发紧"]').click(); W(0.2)
    page.locator('[data-body="脚步沉"]').click(); W(0.2)
    page.locator('[data-atmosphere="青蓝"]').click(); W(0.3)
    page.locator("#generateDream").click()
    page.locator("#togglePlay").wait_for(state="visible", timeout=15000)
    W(0.5)
    page.locator("#togglePlay").click(); W(4)
    page.locator("#toggleSoundscape").click(); W(2)
    for _ in range(4):
        n = page.locator("#nextScene")
        if n.is_disabled(): break
        n.click(); W(1.5)
    page.locator("#afterword").fill("醒来以后，胸口还是紧的，但好像没那么怕了。"); W(0.4)
    page.locator("#saveAfterword").click(); W(1)
    page.locator('[data-route="gallery"]').click(); W(1.2)
    page.locator(".dream-card").first.click(); W(1.2)
    page.locator('[data-route="calendar"]').click(); W(1)
    day = page.locator(".day-cell .moon-dot").first.locator("xpath=ancestor::button[1]")
    if day.count(): day.click(); W(0.8)
    page.reload(wait_until="domcontentloaded"); W(1.2)
    v = page.video.path()
    ctx.close(); browser.close()
    if RAW.exists(): RAW.unlink()
    shutil.move(v, RAW)
    print("OK", RAW)
