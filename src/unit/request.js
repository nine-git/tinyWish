/** **   request.js   ****/
// 导入axios
import axios from 'axios'
import Vue from 'vue'
import { Toast } from 'vant'

Vue.use(Toast)

// 1. 创建新的axios实例，
const service = axios.create({
  // baseURL: '/magnate',
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 3 * 1000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/json;charset=UTF-8',
    'cache-control': 'max-age=0, private, must-revalidate',
    // 'Authorization': '760aa4f94594a1e58352a288021fb90cd0ae29bea865ca0c106e0054c2d7fea4:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lc3BhY2VfaWQiOjd9._oYNdkJna4jaB-SzMZ4edpydgpwrhVPEPTcEZxTHRwo'
  }
})
// 2.请求拦截器
service.interceptors.request.use(config => {
  // 发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等
  // console.log(config)

  return config
}, error => {
  return Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => {
  // 接收到响应数据并成功后的一些共有的处理，关闭loading等

  return response
}, error => {
  /** *** 接收到异常响应的处理开始 *****/
  if (error && error.response) {
    // 1.公共错误处理
    // 2.根据响应码具体处理
    switch (error.response.status) {
      case 400:
        Toast('错误请求')
        break
      case 401:
        Toast('未授权，请重新登录')
        break
      case 403:
        Toast('拒绝访问')
        break
      case 404:
        Toast('请求错误,未找到该资源')
        break
      case 405:
        Toast('请求方法未允许')
        break
      case 408:
        Toast('请求超时')
        break
      case 422:
        Toast('请求异常')
        break
      case 500:
        Toast('服务器繁忙')
        break
      case 501:
        Toast('网络未实现')
        break
      case 502:
        Toast('网络错误')
        break
      case 503:
        Toast('服务不可用')
        break
      case 504:
        Toast('网络超时')
        break
      case 505:
        Toast('http版本不支持该请求')
        break
      default:
        Toast(`连接错误${error.response.status}`)
    }
  } else {
    // 超时处理
    if (JSON.stringify(error).includes('timeout')) {
      Toast('服务器响应超时，请刷新当前页')
    }
    Toast('连接服务器失败,请刷新当前页')
  }

  // alert(error.message)
  /** *** 处理结束 *****/
  // 如果不需要错误处理，以上的处理过程都可省略
  return Promise.resolve(error.response)
})
// 4.导入文件
export default service
