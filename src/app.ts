import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { initVConsole } from './utils/vconsole'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      // 在开发环境异步初始化 vConsole
      // 延迟加载确保不影响页面正常渲染
      setTimeout(() => {
        initVConsole({
          theme: 'light',
          onReady: () => {
            console.log('vConsole 已准备就绪，可以开始调试')
          }
        }).catch(error => {
          console.warn('vConsole 初始化失败:', error)
        })
      }, 1000) // 延迟 1 秒加载，确保页面优先渲染
    }
  })

  // children 是将要会渲染的页面
  return children
}



export default App
