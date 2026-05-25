# 卡路里计算应用 AI 开发指令

## 项目概述

这是一个简单的个人卡路里记录应用，使用 React + TypeScript 开发。

## 开发规范

- 使用 TypeScript，确保类型安全
- 组件使用函数式组件 + Hooks
- 使用 Tailwind CSS 编写样式
- 所有数据存储在 LocalStorage
- 使用 date-fns 处理日期逻辑
- 使用 ECharts 实现统计图表展示
- 支持 PWA 基础能力（可选但建议实现）

## 代码风格

- 使用 ESLint 和 Prettier
- 组件名使用 PascalCase
- 函数名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 文件命名使用 kebab-case 或 PascalCase（组件）
- 逻辑拆分清晰，避免单文件过长

## 项目结构规范

- components/ 仅放可复用 UI 组件
- pages/ 仅放页面级组件
- hooks/ 仅放状态与逻辑抽象
- utils/ 仅放纯函数工具
- services/ 仅处理数据存取与 API 调用
- types/ 仅放类型定义

## 数据存储规范

- 使用 LocalStorage 作为唯一数据源（MVP）
- 统一 key 管理：

  - calmorie_records
  - calmorie_settings

- 所有读写必须通过 services 层封装
- 禁止在组件中直接操作 LocalStorage

## 核心数据模型约束

必须统一使用 Transaction 模型：

- id: string
- type: 'food' | 'exercise'
- title: string
- calories: number
- date: string
- note?: string

所有统计数据必须由 Transaction 派生，不允许冗余存储。

## 功能实现要求

### 首页

- 必须展示今日摄入、消耗、净热量
- 必须支持快速新增记录
- 最近记录必须可滚动展示

### 记录功能

- 支持 food / exercise 两种类型
- 支持快速输入模式（文本 + 数字）
- 默认时间为当前时间

### 日历功能

- 支持按天查看记录
- 支持当天统计汇总

### 月度统计

- 必须基于 Transaction 实时计算
- 不允许手写统计数据存储
- 使用图表展示趋势

### AI 建议

- 输入必须基于最近 7 天数据
- 输出必须为简短自然语言
- 禁止医疗化表达

## 测试要求

- 每个功能完成后手动测试
- 确保 LocalStorage 正确读写
- 测试空数据状态
- 测试极端数据（大量记录）
- 测试跨天日期切换逻辑
- 测试移动端适配

## 注意事项

- 保持代码极简，不允许过度抽象
- 优先实现核心记录流程
- 不允许引入不必要的第三方库
- 必须保证 5 秒内完成记录操作
- 所有交互必须适配移动端单手操作
- UI 必须保持极简、低视觉负担风格
