import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    active: 1,
    list: []
  }

  methods = {
    tabsOnChange (even) {
      this.active = even.detail.name
      this.getOrderList()
    }
  }

  async getOrderList () {
    const {data:res} = await wepy.get('my/orders/all',{
      type:this.active+1
    })
    if(res.meta.status !== 200){
      return wepy.baseToast('获取订单列表失败')
    }
    this.list = res.message.orders
    this.$apply()
  }

  onLoad () {
    this.getOrderList()  
  }
}