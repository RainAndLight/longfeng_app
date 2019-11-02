import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    value: '',
    suggestList: [],
    historyList: []
  }

  config = {
  }

  methods = {
    onchange (e) {
      this.value = e.detail
      if(this.value.trim() == '') return this.suggestList = []
      this.getSuggestList()
    },

    // 点击搜索按钮
    onSearch () {
      if(this.value.trim() == '') return this.suggestList = []
      
      if(this.historyList.indexOf(this.value) === -1){
        this.historyList.unshift(this.value)
      }
      this.historyList = this.historyList.slice(0,10)
      wepy.setStorageSync('historyList',this.historyList)
      wepy.navigateTo({
        url: '/pages/goods_list/index?query='+this.value
      })
    },

    // 删除本地历史
    deleteHistory () {
      this.historyList = []
      wepy.setStorageSync('historyList',this.historyList)
    },

    // 取消
    cancel () {
      this.value = ''
      this.suggestList = []
    }
  }

  async getSuggestList () {
    var {data: res} = await wepy.get('/goods/qsearch?query='+this.value)
    if(res.meta.status !== 200) {
      return wepy.baseToast('获取失败')
    }
    this.suggestList = res.message 
    this.$apply()
  }

  onLoad () {
    this.historyList = wepy.getStorageSync('historyList') || []
  }
}