# DreamWalker 评测集

> **真相源：** `eval/scenarios.json`  
> **SDD 对照：** `docs/sdd-acceptance-checklist.md`  
> **线上走查：** https://dreamwalker.vercel.app/

## 场景分类

| 类别 | 数量 | 用途 |
|------|------|------|
| `golden` | 3 | 标准演示与录屏输入 |
| `universe` | 2 | 梦境宇宙映射验证 |
| `boundary` | 4 | 空输入、超长、无历史、语音兜底 |
| `persistence` | 2 | 刷新保留、旅人隔离 |

## 使用方式

### 手工评测

1. 打开 `scenarios.json`，按 `id` 逐条执行
2. 对照 `expect*` 字段检查生成结果与 UI 行为
3. 在 `docs/sdd-acceptance-checklist.md` 勾选对应项

### Harness 录屏（demo/）

```bash
cd DreamWalker
python3 -m http.server 5173 &
pip install playwright imageio-ffmpeg
python demo/record_demo.py
python demo/merge_demo.py
```

成品视频：`demo/output/DreamWalker-Demo-fixed.mp4`

## Golden 场景断言

每条 Golden 场景至少验证：

- 生成标题与非空分镜（≥4 幕）
- 分镜文本保留输入中关键意象/人物/地点/身体感受
- 非文本录入路径可用（语音或快捷语音）
- 最后一页留言可保存
- 书架与日历可回看；刷新后仍在
