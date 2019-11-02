import wepy from 'wepy'
const baseUrl = 'https://www.uinav.com/api/public/v1/'

/**
 * @str为提示信息
 */
wepy.baseToast = function(str='获取数据失败',icon='none'){
  wepy.showToast({
    title: str,
    icon: icon, // 提示没有图标
  })
}

/**
 * 封装get请求
 * @baseUrl 提取的公告域名
 * @path 是接口地址
 * @data 请求传递的数据
 */

 wepy.get = function (path,data={}) {
   return wepy.request({
     url: baseUrl+path,
     method: 'get',
     data:data
   })
 }

 /**
 * 封装post请求
 * @baseUrl 提取的公告域名
 * @path 是接口地址
 * @data 请求传递的数据
 */

wepy.post = function (path,data={}) {
  return wepy.request({
    url: baseUrl+path,
    method: 'post',
    data:data
  })
}