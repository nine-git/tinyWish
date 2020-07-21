/** **   http.js   ****/
// 导入封装好的axios实例
import request from './request'

const http = {
  /**
   * methods: 请求
   * @param url 请求地址
   * @param params 请求参数
   */

  get (url, params, headers) {
    const config = {
      method: 'get',
      url: url,
      params,
      headers
    }
    return request(config)
  },
  post (url, data, headers) {
    const config = {
      method: 'post',
      url: url,
      data,
      headers
    }
    return request(config)
  },
  put (url, params) {
    const config = {
      method: 'put',
      url: url
    }
    if (params) config.data = params
    return request(config)
  }
}
// 导出
export default http
