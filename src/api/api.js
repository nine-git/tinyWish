/* eslint-disable no-template-curly-in-string */
import http from '../unit/http'
// import cookie from 'js-cookie'

export default {
  // 获取表单对象
  getFormsAPI (tableID) {
    return http.get(`/api/v4/forms/${tableID}`, '')
  },
  // 获取表单数据
  getFormsResponsesAPI (tableID) {
    return http.get(`/api/v4/forms/${tableID}/responses`, '')
  },
  // 填写表单数据
  putFormsAmendAPI (tableID, dataID, data) {
    return http.put(`/api/v4/forms/${tableID}/responses/${dataID}`, data)
  },
  // 上传附件
  getUptokenAPI () {
    return http.get(`/api/v4/attachments/uptoken?purpose=create_responses`)
  },
  // 上传7牛
  postQiNiuApi (data, headers) {
    return http.post('https://up.qbox.me/', data, headers)
  },
  // 获取初始字段
  getClientApi(){
    return http.get('/magnate/oauth', '')
  },
  //  微信通知
  postPushWechat(data,headers){
    return http.post('/api/v4/pushes/wechat', data, headers)
  }
}
