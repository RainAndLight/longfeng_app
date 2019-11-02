import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    cid: '',
    query: '',
    pagenum: 1,
    pagesize:10,
    goodsList: [],
    total: 0,
    isLoading: false,
    hiddenIsOver: true
  }

  methods = {

  }

  onLoad (options) {
    this.query = options.query || ''
    this.cid = options.id || ''
    this.getGoodsList()
  }

  // 获取商品列表数据
  async getGoodsList (cb) {
    this.isLoading = true
    const queryData = {
      cid: this.cid,
      query: this.query,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    }
    var {data: res} = await wepy.get('/goods/search',queryData)
    if(res.meta.status !== 200){
      return wepy.baseToast('获取数据失败')
    }
    this.isLoading = false
    this.goodsList = [...this.goodsList,...res.message.goods] 
    this.total = res.message.total
    this.$apply()
    if(cb){
      cb()
    }
  }
  onReachBottom () {
    if(this.isLoading) return
    if(this.pagenum*this.pagesize>=this.total) {
      return this.hiddenIsOver = false
    }
    this.pagenum++
    this.getGoodsList()
  }

  onPullDownRefresh () {
    console.log('下拉了')
    this.pagenum = 1
    this.isLoading = false 
    this.hiddenIsOver = true
    this.goodsList = []
    this.getGoodsList(function(){
      wepy.stopPullDownRefresh()
    })
  }
}