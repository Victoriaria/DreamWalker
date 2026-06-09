# DreamWalker 演示 Harness

自动化录屏与配音合成，用于比赛演示视频产出。

## 依赖

```bash
pip install playwright imageio-ffmpeg
playwright install chromium
```

## 脚本

| 文件 | 说明 |
|------|------|
| `record_demo.py` | Playwright 完整走查录屏 |
| `record_fast.py` | 加速版录屏 |
| `generate_narration.py` | 根据 `narration.txt` 生成配音 |
| `merge_demo.py` | 合并屏幕录制与配音 |
| `build_demo.py` | 一键构建入口 |
| `finish_demo.py` | 收尾与复制到 Downloads |

## 推荐流程

```bash
cd DreamWalker
python3 -m http.server 5173 &
python demo/generate_narration.py
python demo/record_demo.py
python demo/merge_demo.py
```

## 输出

| 文件 | 说明 |
|------|------|
| `output/DreamWalker-Demo-fixed.mp4` | 推荐提交的演示视频 |
| `output/narration.mp3` | 配音轨 |
| `narration.txt` | 配音稿（对照 docs/product-showcase-script.md） |

## 走查覆盖

与 `eval/scenarios.json` 中 `golden-library-train` 一致，覆盖：

- 旅人名 → 捕捉 → 快捷语音/语音 → 生成 → 回放 → 留言 → 书架 → 日历 → 刷新
