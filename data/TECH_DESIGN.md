# 卡路里计算应用 TECH_DESIGN.md

## 技术栈

- 前端：React + TypeScript + Vite（轻量、适配 PWA、适合快速迭代）
- 样式：Tailwind CSS（极简 UI 风格、快速构建卡片式布局）
- 状态管理：React Context + useReducer（MVP 阶段避免引入复杂状态库）
- 数据存储：LocalStorage（MVP 本地优先）
- 图表：ECharts（用于月度统计折线/柱状图）
- 日期处理：date-fns
- AI 能力：OpenAI API / Claude API（用于建议生成）
- 部署：Vercel（静态站点 + PWA 部署）

---

## 项目结构

src/
components/ # 通用组件（卡片、按钮、输入框、统计卡片）
pages/ # 页面级组件（首页、记录页、日历页、统计页）
hooks/ # 自定义 Hooks（useRecords, useDailyStats, useAIAdvice）
store/ # 全局状态管理（Context + reducer）
services/ # API 服务（AI 调用、数据封装）
utils/ # 工具函数（热量计算、日期处理、格式化）
types/ # TypeScript 类型定义
constants/ # 常量（分类、默认值）
assets/ # 静态资源

---

## 数据模型

### Transaction（统一记录模型）

用于统一表示“食物记录”和“运动记录”。

- id: string
- type: 'food' | 'exercise'
- title: string // 食物名称 / 运动名称
- calories: number // 正数=摄入，负数=消耗
- date: string // ISO 时间字符串
- note?: string // 可选备注

---

### DailySummary（每日统计）

用于首页与日历展示。

- date: string
- totalIntake: number // 当日摄入总量
- totalBurn: number // 当日消耗总量
- netCalories: number // 净热量（摄入-消耗）
- recordCount: number // 当日记录数

---

### MonthlyStats（月度统计）

用于月度趋势分析。

- month: string
- totalIntake: number
- totalBurn: number
- avgNetCalories: number
- dailyTrend: {
  date: string
  netCalories: number
  }[]

---

### AIAdvice（AI 建议）

- id: string
- date: string
- content: string
- type: 'warning' | 'suggestion' | 'info'

---

## 关键技术点

### 1. 本地数据存储设计（核心）

- 使用 LocalStorage 存储 transactions
- Key 设计：

  - `calmorie_records`
  - `calmorie_settings`

- 所有数据统一通过 service 层封装：

  - getRecords()
  - addRecord()
  - deleteRecord()
  - getDailySummary()

---

### 2. 数据聚合计算（核心逻辑）

需要在前端完成：

- 按日期 groupBy
- 计算：

  - daily intake sum
  - daily burn sum
  - net calories

- 月度统计基于 daily summary 聚合

优化点：

- 使用 memoization（useMemo）
- 避免重复遍历 records

---

### 3. 轻量状态管理

采用：

- React Context + useReducer

状态结构：

- records（全部记录）
- selectedDate（当前日期）
- monthlyStats（统计缓存）

避免 Redux，保持 MVP 简洁。

---

### 4. 快速输入交互优化（核心体验）

目标：≤ 5 秒完成记录

实现方式：

- 输入框支持自然语言：

  - “炸鸡 500”
  - “跑步 -300”

- 自动解析：

  - 正则提取数字 + 关键词

- 默认时间 = 当前时间
- 一键提交（Enter + Floating Button）

---

### 5. 日历与时间维度处理

- 使用 date-fns：

  - format()
  - startOfDay()
  - isSameDay()
  - eachDayOfInterval()

日历数据来源：

- transactions → 按 day 聚合 → DailySummary

---

### 6. 图表实现（月度统计）

使用 ECharts：

- 折线图：netCalories trend
- 柱状图：intake vs burn
- tooltip 显示每日详情

性能优化：

- 仅加载当月数据
- 使用 lazy render（进入页面才初始化）

---

### 7. AI 建议生成逻辑

触发时机：

- 每周自动生成（或进入统计页触发）

输入数据：

- 最近 7 天 transactions
- daily summary

Prompt 结构：

- 总摄入
- 总消耗
- 趋势变化
- 异常值检测

输出：

- 3 条以内简短建议
- 非医疗化语言

---

### 8. PWA 支持（移动端关键）

实现：

- manifest.json
- service worker
- offline cache（可选）

目标体验：

- 类似原生 App
- 可添加到桌面
- 离线可查看历史记录

---

### 9. 性能优化策略

- 首屏数据预计算（daily summary 缓存）
- records 分页/懒加载（后期）
- React.memo 优化列表渲染
- useMemo 缓存统计结果

---

### 10. 扩展能力预留（V2）

为未来功能预留结构：

- AI 识别食物 → OCR 模块接口
- 云同步 → service 层替换为 Supabase/Firebase
- 多端同步 → userId 维度扩展
- 健康平台接入 → adapter 层设计
