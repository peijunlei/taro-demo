import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import Toast from '@/components/Toast'

export default function Index () {
  useLoad(() => {
  })

  const handleShowToast = () => {
    Toast.showToast({ 
      title: '支付成功支付成功支付成功支付成功支付成功支付成功支付成功支付成功支付成功支付成功支付成功支付成功',
      onClose: () => {
        console.log('关闭')
      }
    })

    // setTimeout(() => {
    //   Toast.hideToast()
    // }, 1000)
  }

  return (
    <View className='index'>
      <Button onClick={handleShowToast}>测试23</Button>
    </View>
  )
}
