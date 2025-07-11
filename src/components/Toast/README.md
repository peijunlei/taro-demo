# Toast 组件

一个轻量级的 Toast 提示组件，支持自动关闭、手动关闭、动画效果和背景滚动控制。

## 特性

- ✨ 简洁的透明度动画效果
- 🎯 自动关闭和手动关闭
- 🔒 自动禁止背景滚动
- 🎨 支持遮罩层
- 📱 Taro 多端兼容
- 🛡️ TypeScript 支持
- 🎨 提示内容类型，字数，样式自由


## 基本使用

### 简单提示

```typescript
import Toast from '@/components/Toast'

// 显示一个简单的 Toast
Toast.showToast({
  title: '操作成功！',
  duration: 2000
})
```

### 带遮罩的提示

```typescript
import Toast from '@/components/Toast'

// 显示带遮罩的 Toast
Toast.showToast({
  title: '正在处理中...',
  mask: true,
  duration: 3000
})
```

### 手动关闭

```typescript
import Toast from '@/components/Toast'

// 显示 Toast
Toast.showToast({
  title: '请稍等...',
  mask: true,
  duration: 0 // 设置为 0 表示不自动关闭
})

// 手动关闭
setTimeout(() => {
  Toast.hideToast()
}, 5000)
```

### 带回调函数

```typescript
import Toast from '@/components/Toast'

Toast.showToast({
  title: '保存成功！',
  duration: 2000,
  onClose: () => {
    console.log('Toast 已关闭')
    // 执行关闭后的逻辑
  }
})
```

## API

### Toast.showToast(options)

显示 Toast 提示。

#### 参数

| 参数 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| title | string | - | ✅ | 提示内容 |
| duration | number | 1500 | ❌ | 显示时长（毫秒），0 表示不自动关闭 |
| mask | boolean | false | ❌ | 是否显示遮罩层 |
| onClose | function | - | ❌ | 关闭时的回调函数 |

### Toast.hideToast()

手动关闭当前显示的 Toast。

```typescript
// 检查是否有 Toast 显示
if (Toast.isShowToast()) {
  Toast.hideToast()
}
```

### Toast.isShowToast()

检查当前是否有 Toast 显示。

```typescript
const isShowing = Toast.isShowToast()
console.log('Toast 是否显示中:', isShowing)
```

## 注意事项

1. **同时只能显示一个 Toast**：如果当前有 Toast 显示，再次调用 `showToast` 会被忽略
2. **背景滚动控制**：Toast 显示时会自动禁止背景滚动，关闭时自动恢复
3. **动画效果**：Toast 显示和隐藏都有透明度动画，持续时间为 300ms
4. **内存管理**：组件会自动清理定时器，避免内存泄漏

## 更新日志

### v1.0.0
- ✨ 初始版本
- 🎨 透明度动画效果
- 🔒 背景滚动控制
- 🛡️ TypeScript 支持 