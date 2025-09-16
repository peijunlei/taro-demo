import { isInApp } from 'kit'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { useEffect, useState } from 'react'
import RNApp from '@/utils/rn-app'
export default function Index() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  function checkLogin() {
    setIsLoading(true)
    RNApp.checkLogin((res) => {
      setUserInfo(res)
      setIsLoading(false)
    })
  }
  useDidShow(() => {
    console.log('in app', isInApp())
    checkLogin()
  })
  return (
    <View>
      <Text>嵌入RN—APP</Text>
      <Button onClick={() => RNApp.callApp('navigate', { name: 'LoginModal' })}>跳转登录</Button>
      <Button onClick={checkLogin}>检测是否登录</Button>
      {isLoading ? <Text>加载中...</Text> : <Text>{JSON.stringify(userInfo, null, 2)}</Text>}
    </View>
  )
}