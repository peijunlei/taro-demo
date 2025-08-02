import { View, Button } from '@tarojs/components'
import Toast from '@/components/Toast'

import './index.scss'
export default function Index() {

  return (
    <View className='index'>
      <Button onClick={() => Toast.showToast({ title: '支付成功' })}>显示Toast</Button>
    </View>
  )
}
