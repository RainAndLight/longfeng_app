import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    addressInfo: null,
    cart: [],
    isLogin: false
  }

  methods = {
    async chooseAddress () {
      const res = await wepy.chooseAddress()
      if(res.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('选择收货地址失败')
      }
      const address = res
      this.addressInfo = address
      wepy.setStorageSync('address',res)
    },

    async getUserInfo (even) {
      const { encryptedData,iv,rawData,signature } =  even.detail
      const {code} = await wepy.login()
      const res = await wepy.post('users/wxlogin',{
        code,encryptedData,iv,rawData,signature
      })
      console.log(res)
      if(res.data.meta.status !== 200) {
        return wepy.baseToast('登录失败')
      }
      wepy.baseToast('登录成功')
      wepy.setStorageSync('token',res.data.message.token)
      this.isLogin = true
      this.$apply()
    },

    async onSubmitPay () {
      if(this.addressInfo === null) {
        return wepy.baseToast('请选择收货地址')
      }
      const payOrderData = {
        order_price: '0.01',
        consignee_addr: this.addressStr,
        order_detail: JSON.stringify(this.cart),
        goods: this.cart.map(x=>({
          goods_id:x.id,
          goods_number:x.count,
          goods_price: x.price/100
        }))
      }
      const {data: createOrder} = await wepy.post('my/orders/create',payOrderData)
      // console.log(createOrder)
      if(createOrder.meta.status !== 200) {
        return wepy.baseToast('创建订单失败')
      }

      // 创建订单成功，发起生成预支付订单请求
      const {data: prePayData} = await wepy.post('my/orders/req_unifiedorder',{
        order_number: createOrder.message.order_number
      })

      if(prePayData.meta.status !== 200) {
        return wepy.baseToast('网络异常，重新支付')
      }

      console.log(prePayData)

      // 生成预支付成功，调用微信api唤起微信支付
      const {errMsg} = await wepy.requestPayment(prePayData.message.pay).catch(err=>err)
      // 判断支付状态
      if(errMsg === 'requestPayment:fail cancel') {
        return wepy.baseToast('您已取消支付')
      }

      wepy.baseToast('支付成功')
      wepy.navigateTo({
        url: '/pages/orderList/index'
      })
    }
  }

  computed = {
    isShowAddress () {
      if(this.addressInfo === null) {
        return true
      }
      return false
    },

    addressStr () {
      if(this.addressInfo === null) {
        return null
      }
      const {provinceName,cityName,countyName,detailInfo} = this.addressInfo
      return provinceName+cityName+countyName+detailInfo
    },

    total () {
      var total = 0
      this.cart.forEach(item=>{
        total+=item.price*item.count
      })

      return total*100
    }
  }

  onLoad () {
    this.addressInfo = wepy.getStorageSync('address') || null
    this.cart = wepy.getStorageSync('carts') || []
    if(wepy.getStorageSync('token')) {
      this.isLogin = true
    }
  }
}