import { View, Text, Image } from '@tarojs/components'
import './index.scss'

/**
 * 商品卡片组件Props
 */
interface GoodsCardProps {
  /** 商品ID */
  goodsInfoId: string
  /** 商品名称 */
  goodsInfoName: string
  /** 商品副标题 */
  goodsSubtitle?: string
  /** 商品封面图片 */
  goodsInfoImg: string
  /** 商品价格 */
  marketPrice: number
}

/**
 * 商品卡片组件
 * 展示商品的基本信息，包括图片、名称、副标题和价格
 */
export default function GoodsCard({ goods }: { goods: GoodsCardProps }) {
  const { goodsInfoId, goodsInfoName, goodsSubtitle, goodsInfoImg, marketPrice } = goods
  return (
    <View className="goods-card">
      <Image className="goods-card__cover" src={goodsInfoImg} mode="aspectFill" />
      <View className="goods-card__content">
        <Text className="goods-card__name">{goodsInfoName}</Text>
        {goodsSubtitle && <Text className="goods-card__subtitle">{goodsSubtitle}</Text>}
        {
          marketPrice>50 && <Text className="goods-card__price">¥{marketPrice}</Text>
        }
      </View>
    </View>
  )
} 