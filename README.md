# 语音对话 Demo (Voice Chat Demo)

一个基于 React + TypeScript 的实时语音对话应用，支持语音识别、语音合成、语音打断等功能。

## 功能特性

- **实时语音识别 (ASR)** - 使用阿里云 Paraformer 实时语音识别
- **语音合成 (TTS)** - 使用阿里云 CosyVoice 语音合成
- **语音活动检测 (VAD)** - 自动检测用户说话开始和结束
- **语音打断** - 用户说话时自动停止 AI 回复
- **文字输入** - 支持文字和语音两种输入方式
- **对话记录** - Markdown 格式显示，支持导出
- **可配置设置** - API Key、LLM 模型、TTS 音色、系统提示词
- **聊天记录导出** - 实时导出对话记录为 Markdown 文件

## 技术栈

- React 19 + TypeScript
- Vite 7
- Web Audio API (AudioWorklet)
- WebSocket (实时通信)
- 阿里云 DashScope API

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 配置说明

首次运行时会弹出设置面板，需要配置：

| 配置项 | 说明 |
|--------|------|
| API Key | 阿里百炼 API Key |
| LLM 模型 | qwen-plus / qwen-turbo / qwen-max |
| TTS 语音 | 龙小淳 / 龙婉 / 龙悦 / Stella |
| 系统人设 | LLM 的系统提示词 |
| 语音打断 | 是否启用语音打断功能 |

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── CenterChat.tsx   # 中间对话面板
│   ├── ChatHistory.tsx  # 右侧对话记录
│   └── SettingsPanel.tsx # 设置面板
├── hooks/               # React Hooks
│   ├── useRealtimeVoiceChat.ts  # 主要对话逻辑
│   ├── useVoiceInteraction.ts   # 语音交互
│   ├── useAudioRecorder.ts      # 录音
│   ├── useAudioPlayer.ts        # 播放
│   ├── useASR.ts                # 语音识别
│   └── useTTS.ts                # 语音合成
├── services/            # 服务层
│   ├── audio/           # 音频处理
│   ├── asr/             # ASR 服务
│   ├── tts/             # TTS 服务
│   ├── chat/            # LLM 对话
│   └── voice/           # VAD 等
├── stores/              # 状态管理
└── types/               # TypeScript 类型
public/
├── workers/             # Web Workers
│   ├── audioProcessor.js    # 录音处理
│   ├── pcmPlayerWorklet.js  # 播放处理
│   └── asrWorker.js         # ASR Worker
└── js/
    └── paraformerRealtimeApi.js  # ASR API
```

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 66+ |
| Firefox | 76+ |
| Safari | 14.1+ |
| Edge | 79+ |

## 注意事项

- 需要 HTTPS 或 localhost 环境（麦克风权限要求）
- 需要用户授权麦克风权限
- 依赖网络连接（调用云端 API）

## 文档

- [AI 采访助手 PRD](prd.md) - 基于本模块构建的产品需求文档

详细技术文档请查看 `docs/` 目录：

- [用户画像](docs/01-用户画像.md)
- [产品需求文档](docs/02-产品需求文档.md)
- [模块设计文档](docs/03-模块设计文档.md)
- [系统架构图](docs/04-系统架构图.md)

## License

MIT
