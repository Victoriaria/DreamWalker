---
name: dreamwalker-ui
description: >-
  巡梦舱 DreamWalker 梦境记录 Web 应用 UI 与产品规范。在用户修改首页/捕捉/回放/书架/日历样式、
  新增页面、或提到 SDD、梦境宇宙、情绪承接、分镜回放时使用。遵循 docs/PRD.md 与 styles.css 现有范式。
---

# 巡梦舱 DreamWalker UI Skill

## 产品范式

**梦境旅程四段式：**

| 捕捉 | 生成 | 回放 | 安放 |
|------|------|------|------|
| 碎片/语音/情绪 | 梦之书/分镜 | 视觉/声景/播放 | 留言/书架/日历 |

## 必读文件

1. `docs/PRD.md` — 产品范围与 MVP
2. `docs/sdd-acceptance-checklist.md` — SDD 验收项
3. `docs/technical-implementation-and-reliability.md` — 可靠性与回退
4. `styles.css` — 视觉 token 与响应式
5. `app.js` — 路由、生成、存储、回放逻辑
6. `eval/scenarios.json` — Golden 场景与断言

## 实施 checklist

- [ ] 品牌：「巡梦舱 DreamWalker」，Slogan「每个梦，都值得被再次走过」
- [ ] 旅人名隔离：存储键 `dreamwalker:data:<traveler>`
- [ ] 捕捉页保留：多碎片、语音、快捷语音、情绪/强度/身体感受/氛围色
- [ ] 生成结果保留用户输入中的人物、地点、意象、身体感受
- [ ] 回放页：分镜、Canvas/素材视觉、声景默认静音、自动播放
- [ ] 最后一幕：梦后留言卡
- [ ] 书架与日历：空状态有引导，刷新后数据仍在
- [ ] 梦境宇宙：记忆鲸落 / 月亮图书馆，素材在 `product-assets/`
- [ ] 图片缺失时 Canvas 兜底，不阻塞主链路
- [ ] 移动端单列布局，长文本换行

## 视觉

- 深色梦境氛围：月蓝、青蓝、深紫为主
- 使用现有 `product-assets` 素材，不引入外部未授权品牌图
- 顶栏：品牌 + 捕捉/书架/日历 + 旅人切换

## 禁止破坏

- 不要移除非文本录入（语音 + 快捷语音）
- 不要移除 localStorage 持久化与旅人隔离
- 不要引入必须后端才能运行的核心链路
