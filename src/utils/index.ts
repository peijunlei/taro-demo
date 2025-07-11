import { getCurrentPages } from "@tarojs/taro"
import { render, unmountComponentAtNode } from "@tarojs/react"
import { document, type TaroElement } from "@tarojs/runtime"
import { ReactNode } from "react"
import { noop } from "@tarojs/shared"

export function getPagePath() {
  const currentPages = getCurrentPages()
  const currentPage = currentPages[currentPages.length - 1]
  const path = currentPage.$taroPath
  return path
}

const portalViewMap: Map<string, TaroElement> = new Map()

// 获取或创建 Portal 容器
function getPortalContainer(path: string): TaroElement {
  if (!portalViewMap.has(path)) {
    const portalView = document.createElement("view")
    portalView.setAttribute("id", "portal_view")
    const pageElement = document.getElementById(path)
    if (pageElement) {
      pageElement.appendChild(portalView)
      portalViewMap.set(path, portalView)
    } else {
      console.error("cannot find page element")
    }
  }
  return portalViewMap.get(path)!
}

// 挂载 Portal 内容
export function mountPortal(children: ReactNode): TaroElement {
  const path = getPagePath()
  const portalContainer = getPortalContainer(path)
  
  // 直接渲染内容到容器中
  render(children, portalContainer, noop)
  
  return portalContainer
}

// 清理 Portal 内容
export function unmountPortal() {
  const container = document.getElementById("portal_view")
  if (!container) {
    console.error("cannot find portal_view")
    return
  }
  // 使用 unmountComponentAtNode 来卸载 React 组件
  unmountComponentAtNode(container)
}

// 滚动控制工具函数
let scrollLockCount = 0
let originalBodyStyle = ''

/**
 * 禁止背景滚动
 */
export function disableScroll() {
  scrollLockCount++
  const body = document.body
  if (body && scrollLockCount === 1) {
    // 保存原始样式
    originalBodyStyle = body.getAttribute('style') || ''
    
    // 添加滚动禁止样式，保留原有样式
    const currentStyle = body.getAttribute('style') || ''
    const scrollLockStyle = 'overflow: hidden; position: fixed; width: 100%;'
    
    if (currentStyle) {
      // 如果已有样式，合并样式
      body.setAttribute('style', `${currentStyle}; ${scrollLockStyle}`)
    } else {
      // 如果没有样式，直接设置
      body.setAttribute('style', scrollLockStyle)
    }
  }
}

/**
 * 恢复背景滚动
 */
export function enableScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1)
  const body = document.body
  if (body && scrollLockCount === 0) {
    // 恢复原始样式
    if (originalBodyStyle) {
      body.setAttribute('style', originalBodyStyle)
    } else {
      body.removeAttribute('style')
    }
    originalBodyStyle = ''
  }
}

/**
 * 强制恢复背景滚动（重置计数器）
 */
export function forceEnableScroll() {
  scrollLockCount = 0
  const body = document.body
  if (body) {
    // 恢复原始样式
    if (originalBodyStyle) {
      body.setAttribute('style', originalBodyStyle)
    } else {
      body.removeAttribute('style')
    }
    originalBodyStyle = ''
  }
}