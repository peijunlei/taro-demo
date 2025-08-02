


function getUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
let startId = 1
export function generateGoodsList(len: number=10) {
  return Array.from({ length: len }, (_, index) => {
    const id = startId++
    return {
        id,
        name: `商品名称${id}`,
        subTitle: Math.random() > 0.7 ? `商品副标题` : undefined,
        coverImg: null,
        price: Math.floor(Math.random() * 100) + 1,
      }
  })
}

