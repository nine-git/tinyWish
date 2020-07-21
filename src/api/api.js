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
    return http.put(`api/v4/forms/${tableID}/responses/${dataID}`, data)
  }
  //
}
