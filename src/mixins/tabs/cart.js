import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    cart: [],
    checked: true
  }

  onLoad () {
    this.cart = this.$parent.globalData.cart
  }

  computed = {
    isEmpty () {
      return this.cart.length <= 0 ? true : false
    },
    totalPrice () {
      var total = 0
      this.cart.forEach(item=>{
        if(item.isCheck){
          total+=item.count*item.price
        }
      })
      return total*100
    },
    isFullCheck () {
      return this.cart.every(item=>item.isCheck) 
    }
  }

  methods = {
    countChange (e) {
      this.$parent.updateCount(e.target.dataset.id,e.detail)
    },

    checkChange (e) {
      this.$parent.updateIsCheck(e.target.dataset.id,e.detail)
    },

    removeGoods (id) {
      this.$parent.removeGoods(id)
    },

    onFullChange (e) {
      this.$parent.fullChange(e.detail)
    },

    onSubmitOrder () {
      if(this.totalPrice<=0) {
        return wepy.baseToast('请选择商品')
      }
      wepy.navigateTo({
        url: '/pages/order/index'
      })
    }
  }

  onShow () {
    this.$parent.renderTabbarBadage()
  }
}