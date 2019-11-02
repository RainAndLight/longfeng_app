import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    test: 123,
    goods_id: 0,
    goods_detail: {},
    addressInfo: null
  }

  computed = {
    formatAddressInfo () {
      if(this.addressInfo === null) {
        return '请选择收货地址'
      }else{
        const { provinceName, cityName, countyName,detailInfo } = this.addressInfo
        return provinceName+cityName+countyName+detailInfo
      }
    },
    goods_count () {
      var total = 0
      this.$parent.globalData.cart.forEach(item=>{
        if(item.isCheck){
          total+=item.count
        }
      })
      return total
    }
  }

  methods = {
    previewImage (currentUrl) {
      const urls = this.goods_detail.pics.map(item=>{
        return item.pics_big_url
      })
      const current = currentUrl
      wepy.previewImage({urls,current})
    },

    // 选择收货地址
    async chooseAddress () {
      const res = await wepy.chooseAddress()
      console.log(res)
      if(res.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('获取收货地址失败')
      }
      wepy.baseToast('已选择地址')
      this.addressInfo = res 
      wepy.setStorageSync('address',res)
      this.$apply()
    },

    addToCart () {
      console.log(this.goods_detail)
      this.$parent.addTocar(this.goods_detail)
      wepy.baseToast('添加成功','success')
    }
  }

  onLoad (options) {
    this.goods_id = options.goods_id
    this.addressInfo = wepy.getStorageSync('address') || null
    this.getGoodsDetail()
  }

  // 获取商品详情的数据
  async getGoodsDetail () {
    var { data: res } = await wepy.get('/goods/detail',{
      goods_id:this.goods_id
    })
    if(res.meta.status !== 200){
      return wepy.baseToast('获取数据失败')
    }

    this.goods_detail = res.message
    this.$apply()
  }
}