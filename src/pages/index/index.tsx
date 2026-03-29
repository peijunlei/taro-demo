import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

export default function Index() {

  const demos = [
    {
      title: '商品瀑布流',
      path: '/pages/demo1/index'
    },
    {
      title: '自定义Toast',
      path: '/pages/demo2/index'
    },
    {
      title: '嵌入RN',
      path: '/pages/demo3/index'
    },
    {
      title: '运动计时',
      path: '/pages/demo4/index'
    }
  ]
  return (
    <View className='index'>
      {
        demos.map((item) => (
          <Button key={item.path} onClick={() => Taro.navigateTo({ url: item.path })}>{item.title}</Button>
        ))
      }
    </View>
  )
}
