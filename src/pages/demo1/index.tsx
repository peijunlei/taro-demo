import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import GoodsCard from '../../components/GoodsCard'
import { generateGoodsList } from './utils'
import './index.scss'


function fetchGoodsList() {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve(generateGoodsList())
    }, 500)
  })
}

async function fetchGoodsList2(page: number) {
  const res = await Taro.request({
    url: 'https://test.txfsjx.com/mbff/goods/unLogin/skuList',
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Terminal': 'H5',
    },
    data: {
      pageNum: page,
      pageSize: 10,
    },
  })
  return res.data
}

/**
 * Demo1页面组件
 * 展示左右两列瀑布流布局的商品列表，支持加载更多
 */
export default function Demo1() {
  const [goodsList, setGoodsList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [cardHeights, setCardHeights] = useState<Map<string, number>>(new Map())
  const [leftColumn, setLeftColumn] = useState<any[]>([])
  const [rightColumn, setRightColumn] = useState<any[]>([])
  const maxItems = 200


  /**
   * 测量卡片高度
   */
  const measureCardHeight = useCallback((id: string) => {
    const query = Taro.createSelectorQuery()
    query.select(`#card-${id}`).boundingClientRect((rect) => {
      if (rect && Array.isArray(rect)) {
        const firstRect = rect[0]
        if (firstRect && firstRect.height) {
          setCardHeights(prev => {
            const newMap = new Map(prev)
            newMap.set(id, firstRect.height)
            return newMap
          })
        }
      } else if (rect && typeof rect === 'object' && 'height' in rect) {
        setCardHeights(prev => {
          const newMap = new Map(prev)
          newMap.set(id, (rect as any).height)
          return newMap
        })
      }
    }).exec()
  }, [])

  /**
   * 瀑布流布局分配
   * 根据卡片实际高度动态分配到高度较小的列
   */
  const distributeCards = useCallback(() => {
    const left: any[] = []
    const right: any[] = []
    let leftHeight = 0
    let rightHeight = 0
    goodsList.forEach((item) => {
      const cardHeight = cardHeights.get(item.goodsInfoId) || 0
      // 如果还没有测量到高度，先按顺序分配
      if (cardHeight === 0) {
        if (left.length <= right.length) {
          left.push(item)
        } else {
          right.push(item)
        }
      } else {
        // 分配到高度较小的列
        if (leftHeight <= rightHeight) {
          left.push(item)
          leftHeight += cardHeight
        } else {
          right.push(item)
          rightHeight += cardHeight
        }
      }
    })

    setLeftColumn(left)
    setRightColumn(right)
  }, [goodsList, cardHeights])

  async function getGoodsList() {
    Taro.showLoading()
    setLoading(true)
    const res = await fetchGoodsList2(page)
    const list = res.context.goodsInfoPage.content
    if (page === 0) {
      setGoodsList(list)
    } else {
      const newList = [...goodsList, ...list]
      setGoodsList(newList)
    }
    Taro.hideLoading()
    setLoading(false)
  }

  /**
   * 滚动到底部触发加载更多
   */
  const onScrollToLower = () => {
    if (hasMore && !loading) {
      setPage(page + 1)
    }
  }

  useEffect(() => {
    // 初始加载
    getGoodsList()

  }, [page])



  // 在组件挂载后测量所有卡片高度
  useEffect(() => {
    if (goodsList.length > 0) {
      // 先渲染，再测量
      distributeCards()
      Taro.nextTick(() => {
        // 只测量还没有高度数据的卡片
        goodsList.forEach(item => {
          if (!cardHeights.has(item.goodsInfoId)) {
            measureCardHeight(item.goodsInfoId)
          }
        })
      })
    }
  }, [goodsList])

  useEffect(() => {
    // 当卡片高度变化时，重新分配布局
    distributeCards()
  }, [cardHeights])

  /**
   * 渲染卡片并测量高度
   */
  const renderCard = (item: any) => {
    return (
      <View 
        key={item.goodsInfoId}
        id={`card-${item.goodsInfoId}`}
        className="card-wrapper"
      >
        <GoodsCard goods={item} />
      </View>
    )
  }

  return (
    <View className="demo1">
      <ScrollView
        className="demo1__scrollview"
        scrollY
        enableFlex
        enhanced
        showScrollbar={false}
        onScrollToLower={onScrollToLower}
        lowerThreshold={50}
      >
        <View className="demo1__content">
          {/* 左列 */}
          <View className="demo1__column">
            {leftColumn.map(renderCard)}
          </View>

          {/* 右列 */}
          <View className="demo1__column">
            {rightColumn.map(renderCard)}
          </View>
        </View>
        {/* 加载状态 */}
        {loading && (
          <View className="demo1__loading">
            <Text className="demo1__loading-text">加载中...</Text>
          </View>
        )}

        {/* 没有更多数据 */}
        {!hasMore && goodsList.length > 0 && (
          <View className="demo1__no-more">
            <Text className="demo1__no-more-text">没有更多商品了</Text>
          </View>
        )}

      </ScrollView>
    </View>
  )
}