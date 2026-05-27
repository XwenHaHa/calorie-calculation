<p align="center">
  <img src="src/assets/hero.svg" alt="Calmorie" width="100%" />
</p>

<h1 align="center">Calmorie</h1>

<p align="center">
  <strong>一个极简的卡路里记录应用，帮助你快速记录每日饮食摄入和运动消耗</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor" alt="Capacitor 8" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

<p align="center">
  <a href="README_EN.md">English</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#功能特性">功能特性</a> ·
  <a href="#技术栈">技术栈</a> ·
  <a href="#原生构建">原生构建</a> ·
  <a href="#贡献指南">贡献指南</a>
</p>

---

## 功能特性

### 核心功能
- **快速记录** - 5秒内完成一次热量记录
- **食物摄入** - 记录每日饮食热量
- **运动消耗** - 记录运动消耗热量
- **每日统计** - 实时计算今日摄入、消耗、净热量
- **日历查看** - 按日期浏览历史记录
- **月度统计** - 查看热量趋势图表
- **AI 建议** - 基于数据生成个性化健康建议

### 交互特点
- 支持快速输入模式（如：`炸鸡 500`、`跑步 -300`）
- 常用食物和运动快捷选择
- 移动端优先，支持单手操作
- 数据本地存储，无需登录
- 支持中英文双语切换

### 平台支持
- **H5 Web** - 浏览器直接访问
- **Android** - 通过 Capacitor 打包为原生 APK/AAB
- **iOS** - 通过 Capacitor 打包为原生 IPA（需 macOS）

## 演示

**在线预览**: [http://101.96.208.101:5188/](http://101.96.208.101:5188/)

![Calmorie 演示](https://github.com/XwenHaHa/calorie-calculation/blob/main/screenshots/demo.gif)

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/XwenHaHa/calorie-calculation.git
cd calorie-calculation

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 AI API 配置

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 原生构建

```bash
# Android（需要安装 Android Studio）
npm run cap:android

# iOS（需要 macOS + Xcode）
npm run cap:ios

# 仅同步 Web 资源到原生工程
npm run cap:sync
```

## 技术栈

| 技术 | 用途 |
|------|------|
| **React 19** | 前端框架 |
| **TypeScript 6** | 类型安全 |
| **Vite 8** | 构建工具 |
| **Tailwind CSS 4** | 样式方案 |
| **React Router Dom 7** | 路由管理 |
| **date-fns** | 日期处理 |
| **ECharts** | 图表展示 |
| **LocalStorage** | 数据持久化 |
| **i18next** | 国际化（中/英文） |
| **Capacitor** | 跨平台原生打包（iOS / Android） |
| **OpenAI 兼容 API** | AI 能力 |

## 项目结构

```
calorie-calculation/
├── capacitor.config.ts   # Capacitor 配置（启动屏、状态栏等）
├── android/              # Android 原生工程（由 Capacitor 生成）
├── ios/                  # iOS 原生工程（由 Capacitor 生成）
├── src/
│   ├── components/       # 通用组件
│   │   ├── BottomNav.tsx
│   │   ├── Card.tsx
│   │   └── FloatingButton.tsx
│   ├── pages/            # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── StatsPage.tsx
│   │   ├── AIPage.tsx
│   │   └── AddRecordModal.tsx
│   ├── i18n/             # 国际化配置及语言包
│   │   ├── index.ts
│   │   └── locales/      # zh / en 语言资源
│   ├── store/            # 状态管理 (Context + useReducer)
│   ├── services/         # 服务层
│   │   ├── storage.ts
│   │   ├── ai.ts
│   │   └── capacitor.ts  # Capacitor 原生功能初始化
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript 类型定义
│   ├── constants/        # 常量定义
│   └── assets/           # 静态资源
```

## 使用说明

### 添加记录

1. 点击首页右下角的绿色 **+** 按钮
2. 选择"食物摄入"或"运动消耗"
3. 输入名称和热量（或使用快速输入如"炸鸡 500"）
4. 点击"添加"完成记录

### 快速输入格式

```bash
# 食物摄入
炸鸡 500
米饭 200

# 运动消耗（负数表示消耗）
跑步 -300
游泳 -200
```

### 查看统计

- **首页**: 查看今日热量汇总
- **日历**: 切换日期查看历史记录
- **统计**: 查看月度热量趋势图表
- **AI**: 生成基于数据的健康建议

## 数据模型

```typescript
// 记录
interface Transaction {
  id: string;
  type: 'food' | 'exercise';
  title: string;
  calories: number;  // 正数=摄入，负数=消耗
  date: string;      // ISO 时间字符串
  note?: string;
}

// 每日统计
interface DailySummary {
  date: string;
  totalIntake: number;
  totalBurn: number;
  netCalories: number;
  recordCount: number;
}
```

## 配置说明

### 环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_AI_BASE_URL` | AI API 地址 | `https://yxai.chat/v1` |
| `VITE_AI_API_KEY` | AI API 密钥 | `your-api-key` |
| `VITE_AI_MODEL` | AI 模型名称 | `gpt-5.3-chat` |

支持任何兼容 OpenAI API 格式的服务。

> **注意**: `.env` 文件已添加到 `.gitignore`，不会被提交到版本控制。

## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" alt="Safari" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" alt="Edge" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox |
|:---:|:---:|:---:|:---:|
| ✅ | ✅ | ✅ | ✅ |

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

<p align="center">
  如果觉得这个项目有帮助，欢迎给个 ⭐️ Star 支持一下！
</p>
