# Taro Demo 项目

基于 Taro 的多端应用开发项目，提供了一系列可复用的组件和工具。

## 🚀 项目特性

- 📱 **多端兼容** - 支持微信小程序、H5、React Native 等多端
- 🎨 **组件化开发** - 提供丰富的可复用组件
- 🛡️ **TypeScript** - 完整的类型支持
- 📦 **模块化** - 清晰的代码结构和模块划分

## 📦 组件库

### 🎯 基础组件

| 组件 | 描述 | 文档 | 示例 |
|------|------|------|------|
| **Toast** | 轻量级提示组件，支持长文本、自定义样式 | [查看文档](./src/components/Toast/README.md) | [在线演示](#) |

### 🔧 工具函数

| 工具 | 描述 | 文档 |
|------|------|------|
| **Portal 工具** | Portal 挂载和卸载工具 | [查看源码](./src/utils/index.ts) |
| **滚动控制** | 背景滚动禁止和恢复工具 | [查看源码](./src/utils/index.ts) |




## 🛠️ 开发指南

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 微信小程序
pnpm dev:weapp

# H5
pnpm dev:h5

```

### 构建

```bash
# 微信小程序
pnpm build:weapp

# H5
pnpm build:h5
```

## 📁 项目结构

```
src/
├── components/          # 组件库
│   └── Toast/          # Toast 组件
│       ├── index.tsx   # 组件源码
│       ├── index.scss  # 组件样式
│       └── README.md   # 组件文档
├── utils/              # 工具函数
│   └── index.ts        # 工具函数源码
└── pages/              # 页面文件
```

⭐ 如果这个项目对你有帮助，请给我们一个 Star！ 