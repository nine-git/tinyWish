/* eslint-disable no-template-curly-in-string */
import http from "../unit/http";
// import cookie from 'js-cookie'
let youYiHeader = {
  'Authorization': '760aa4f94594a1e58352a288021fb90cd0ae29bea865ca0c106e0054c2d7fea4:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lc3BhY2VfaWQiOjd9._oYNdkJna4jaB-SzMZ4edpydgpwrhVPEPTcEZxTHRwo'
}
let gxHeaders = {
  'Authorization': 'd25adaf98146c4f32c127e6c094f6f672db695970692fc473a9e8e861b304f1a:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lc3BhY2VfaWQiOjF9.plo6dlWfBGCS9kH8765wWR9aQo_-SyFQw5kRBBio9Y0'
}
export default {
  // 获取表单对象
  getFormsAPI(tableID) {
    return http.get(`/api/v4/forms/${tableID}`, "", youYiHeader);
  },
  // 获取表单数据
  getFormsResponsesAPI(tableID) {
    return http.get(`/api/v4/forms/${tableID}/responses`, "", youYiHeader);
  },
  // 填写表单数据
  putFormsAmendAPI(tableID, dataID, data) {
    return http.put(`/api/v4/forms/${tableID}/responses/${dataID}`, data, youYiHeader);
  },
  // 获取表单对象
  getFormsAPI1(tableID) {
    return http.get(`/v4/forms/${tableID}`, "", gxHeaders);
  },
  // 获取表单数据
  getFormsResponsesAPI1(tableID) {
    return http.get(`/v4/forms/${tableID}/responses`, "", gxHeaders);
  },
  // 填写表单数据
  putFormsAmendAPI1(tableID, dataID, data) {
    return http.put(`/v4/forms/${tableID}/responses/${dataID}`, data, gxHeaders);
  },
  // 创建表单数据
  createFormsAmendAPI(tableId, data) {
    return http.post(`/v4/forms/${tableId}/responses`, data, gxHeaders);
  },
  // 上传附件
  getUptokenAPI() {
    return http.get(`/api/v4/attachments/uptoken?purpose=create_responses`, "", youYiHeader);
  },
  // 上传7牛
  postQiNiuApi(data, headers) {
    headers.Authorization = youYiHeader.Authorization
    return http.post("https://up.qbox.me/", data, headers);
  },
  // 获取获取初始字段
  getClientApi() {
    return http.get("/magnate/oauth", "", youYiHeader);
  },
  // 微信通知消息
  postPushWeChat(data, headers) {
    headers.Authorization = youYiHeader.Authorization
    return http.post("/api/v4/pushes/wechat", data, headers);
  },
  // 微信通知桂溪消息
  postPushGXWeChat(data, headers) {
    headers.Authorization=gxHeaders.Authorization
    return http.post("/v4/pushes/wechat", data, headers);
  },
  // 登录oauth

  getUserAPI(token) {
    return http.get(`/v1/user?access_token=` + token, "", youYiHeader);
  },
  //  获取街道办的管理人员
  getStreetAdmin() {
    return http.get(`/v4/tags/41/taggable_users`, "", gxHeaders)
  }

};
