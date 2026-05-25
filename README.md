# Calmorie

一个极简的卡路里记录应用，帮助你快速记录每日饮食摄入和运动消耗。

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

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式方案**: Tailwind CSS 4
- **路由管理**: React Router Dom 7
- **日期处理**: date-fns
- **图表展示**: ECharts
- **数据存储**: LocalStorage
- **AI 能力**: OpenAI 兼容 API

## 项目结构

```
src/
├── components/       # 通用组件
│   ├── BottomNav.tsx     # 底部导航栏
│   ├── Card.tsx          # 卡片组件
│   └── FloatingButton.tsx # 悬浮按钮
├── pages/            # 页面组件
│   ├── HomePage.tsx      # 首页
│   ├── CalendarPage.tsx  # 日历页
│   ├── StatsPage.tsx     # 统计页
│   ├── AIPage.tsx        # AI建议页
│   └── AddRecordModal.tsx # 添加记录弹窗
├── hooks/            # 自定义 Hooks
├── store/            # 状态管理
│   └── index.tsx         # Context + useReducer
├── services/         # 服务层
│   ├── storage.ts        # 数据存储服务
│   └── ai.ts             # AI 服务
├── utils/            # 工具函数
├── types/            # TypeScript 类型定义
├── constants/        # 常量定义
└── assets/           # 静态资源
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 数据模型

### Transaction（记录）

```typescript
interface Transaction {
  id: string;
  type: 'food' | 'exercise';
  title: string;
  calories: number;  // 正数=摄入，负数=消耗
  date: string;      // ISO 时间字符串
  note?: string;
}
```

### DailySummary（每日统计）

```typescript
interface DailySummary {
  date: string;
  totalIntake: number;
  totalBurn: number;
  netCalories: number;
  recordCount: number;
}
```

## 使用说明

### 添加记录

1. 点击首页右下角的绿色 **+** 按钮
2. 选择"食物摄入"或"运动消耗"
3. 输入名称和热量（或使用快速输入如"炸鸡 500"）
4. 点击"添加"完成记录

### 快速输入格式

- 食物：`炸鸡 500`、`米饭 200`
- 运动：`跑步 -300`、`游泳 -200`（负数表示消耗）

### 查看统计

- **首页**: 查看今日热量汇总
- **日历**: 切换日期查看历史记录
- **统计**: 查看月度热量趋势图表
- **AI**: 生成基于数据的健康建议

## 配置说明

### 环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

环境变量说明：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_AI_BASE_URL` | AI API 地址 | `https://yxai.chat/v1` |
| `VITE_AI_API_KEY` | AI API 密钥 | `your-api-key` |
| `VITE_AI_MODEL` | AI 模型名称 | `gpt-5.3-chat` |

支持任何兼容 OpenAI API 格式的服务。

> **注意**: `.env` 文件已添加到 `.gitignore`，不会被提交到版本控制。

## 浏览器支持

- Chrome (推荐)
- Safari
- Edge
- Firefox

## 许可证

MIT