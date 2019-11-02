import wepy from 'wepy'
export default class Home extends wepy.mixin {
  data = {
    swiperData: [],
    catesData: [],
    floorData: []
  }

  config = {
  }

  methods = {
    goGoodsDetail (url) {
      wepy.navigateTo({
        url
      })
    }
  }
    
  // 获取轮播图的数据
  async getSwiperData () {
    var {data: res} = await wepy.get('/home/swiperdata')
    if(res.meta.status !== 200) {
      return wepy.baseToast('获取数据失败')
    }
    this.swiperData = res.message
    this.$apply()
  }

  // 获取分类数据
  async getCatesData () {
    var {data: res} = await wepy.get('/home/catitems')
    console.log(res)
    if(res.meta.status !== 200) {
      return wepy.baseToast('获取数据失败')
    }
    this.catesData = res.message 
    this.$apply()
  }

  // 获取楼层数据
  async getFloorData () {
    var {data:res} = await wepy.get('/home/floordata')
    if(res.meta.status !== 200) {
      return wepy.baseToast('获取楼层数据失败')
    }
    this.floorData = res.message
    this.$apply()
  }

  onLoad () {
    this.getSwiperData()
    this.getCatesData()
    this.getFloorData()
  }
}