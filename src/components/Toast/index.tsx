import React, { createElement, useEffect, useState } from "react";
import { View } from "@tarojs/components";

import { mountPortal, unmountPortal, disableScroll, enableScroll } from "@/utils";

import './index.scss';
const DEFAULT_TOAST_ID = '#toast';
const toastSelectorSet = new Set<string>()
interface ToastOptions {
  title: string;
  mask?: boolean;
  duration?: number;
  onClose?: () => void;
}

interface ToastProps extends ToastOptions {
  id: string;
  open: boolean;
}

function Toast({ id, open, title, duration=1500, onClose, mask = false }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (open && !isExiting) {
      // 显示时禁止背景滚动
      disableScroll();
      
      // 只有当 duration 大于 0 时才设置自动关闭定时器
      if (duration > 0) {
        timer = setTimeout(() => {
          // 开始退出动画
          setIsExiting(true);
          
          // 等待动画完成后执行 onClose
          const exitTimer = setTimeout(() => {
            onClose?.();
          }, 300); // 动画持续时间
          
          return () => {
            if (exitTimer) {
              clearTimeout(exitTimer);
            }
          };
        }, duration);
      }
    }
    
    // 清理函数：组件卸载或依赖变化时清除定时器
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
  }, [open, duration, onClose, isExiting]);

  // 组件卸载时恢复滚动
  useEffect(() => {
    return () => {
      enableScroll();
    };
  }, []);
  
  return (
    <View 
      catchMove
      id={id}
      className={`toast-container ${isExiting ? 'toast-exit' : ''}`} 
      style={{ backgroundColor: mask ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}
    >
      <View className="toast-content">
        {title}
      </View>
    </View>
  )
}

/**
 * 显示 Toast
 * @param options 
 */
Toast.showToast = (options: ToastOptions) => {

  const { onClose, ...rest } = options;
  const toastId = DEFAULT_TOAST_ID
  const hasExistingToast = toastSelectorSet.has(toastId)
  if (hasExistingToast) {
    console.log("已存在Toast", hasExistingToast)
    return toastId
  }
  toastSelectorSet.add(toastId)

  // 创建 Toast 组件
  const toastView = createElement(Toast, {
    ...rest,
    id: DEFAULT_TOAST_ID,
    open: true,
    onClose: () => {
      // 恢复背景滚动
      enableScroll();
      
      onClose && onClose()
      toastSelectorSet.delete(toastId)
      unmountPortal()
    },
  })

  // 挂载 Toast 组件
  mountPortal(toastView)
}
/**
 * 主动关闭 Toast
 */
Toast.hideToast = () => {
  const toastId = DEFAULT_TOAST_ID
  if (toastSelectorSet.has(toastId)) {
    // 恢复背景滚动
    enableScroll();
    
    // 触发退出动画，延迟移除
    setTimeout(() => {
      toastSelectorSet.delete(toastId)
      unmountPortal()
      console.log("Toast 已主动关闭")
    }, 300) // 等待动画完成
  } else {
    console.log("没有找到需要关闭的 Toast")
  }
}

// 检查 Toast 是否显示中
Toast.isShowToast = () => {
  const toastId = DEFAULT_TOAST_ID
  return toastSelectorSet.has(toastId)
}
export default Toast;
