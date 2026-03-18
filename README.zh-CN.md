# Klick

**一个为认真练琴的音乐人打造的网页节拍器。**

无需安装，无需注册，打开即用。

[**English README**](./README.md)

<div align="center">
  <img src="public/og-preview.png" alt="Klick 预览" height="500" />
</div>

---

## 为什么选 Klick？

市面上大多数在线节拍器体验粗糙——延迟高、没有细分音符、不支持重音编辑。Klick 使用 Web Audio API 的预调度机制，实现**亚毫秒级的计时精度**，这与专业 DAW 使用的技术完全一致。所有逻辑在浏览器端运行，首次加载后支持离线使用，设置自动保存。

## 功能一览

**核心**
- 基于 Web Audio API 预调度的亚毫秒级精准计时
- Tap Tempo — 连续敲击任意键即可测定 BPM
- BPM 范围 1–300，支持滑块、键盘方向键、滚轮、直接输入

**节奏**
- 任意拍号（2/4、3/4、4/4、5/4、7/8……）
- 12 种细分模式 — 四分、八分、三连音、十六分、附点、切分、五连音等
- 逐拍重音编辑 — 每拍可在重音 / 普通 / 幽灵音 / 静音间循环切换

**音色**
- 多种节拍音色，重音音色可单独选择
- 音量控制，一键静音

**练习工具**
- 速度训练 — 每 N 小节自动递增 BPM，循序渐进提升速度
- 计时器 — 倒计时练习，时间到自动停止播放
- 闪烁模式 — 全屏视觉脉冲，适合舞台或远距离观看

**主题与皮肤**
- 深色 / 浅色主题切换
- 6 款皮肤 — 默认、海洋、森林、极简、像素（复古 8-bit 风）、古典（音乐厅风）
- 每款皮肤提供独特的配色、字体和装饰元素

**多语言**
- 支持中文、英文、日语三种语言
- 顶栏一键切换语言，偏好自动保存

**使用体验**
- 视觉静音 — 关闭所有节拍动画，保留音频
- 键盘快捷键（空格、方向键、Esc）
- 屏幕常亮 — 播放时自动阻止息屏（移动端）
- 所有设置自动保存到 localStorage — 下次打开即恢复

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

```bash
# 生产构建
npm run build && npm start
```

## 键盘快捷键

| 按键 | 功能 |
|------|------|
| `空格` | 播放 / 停止 |
| `↑` / `↓` | BPM ±1 |
| `Shift + ↑/↓` | BPM ±5 |
| `Esc` | 退出闪烁模式 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | [Next.js 16](https://nextjs.org/)（App Router） |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| 音频 | [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — 零依赖 |
| 图标 | [Lucide React](https://lucide.dev/) |
| 语言 | TypeScript |

## 项目结构

```
src/
├── app/              # Next.js 入口、布局、全局样式
├── components/
│   └── metronome/    # UI 组件：BpmDisplay、BeatVisualizer、TransportBar 等
├── hooks/            # useMetronome、useTapBpm、useKeyboard、useSkin 等
├── i18n/             # 国际化 — 翻译文件（中/英/日）、Context
├── lib/
│   ├── audio/        # 音频引擎、预调度器、音色定义
│   └── skins/        # 皮肤定义、注册表、主题变量
└── types/            # 共享 TypeScript 类型
```

## 许可证

MIT
