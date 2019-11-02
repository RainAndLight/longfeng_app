import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    cates: [],
    secondCates: []
  }

  config = {
  }

  methods = {
    sidebarChange (e) {
      console.log(e.detail)
      this.secondCates = this.cates[e.detail].children
    }
  }
  // 获取分类数据
  async getCatesList () {
    var { data: res } = await wepy.get('/categories')
    if(res.meta.status !== 200){
      return wepy.baseToast('获取分类数据失败')
    }
    this.secondCates = res.message[0].children
    this.cates = res.message
    this.$apply()
  }

  onLoad () {
    this.getCatesList()
  }
}