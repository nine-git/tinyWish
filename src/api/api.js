import http from '../unit/http'
// import cookie from 'js-cookie'

export default {
  // 工单查询
  postFeedBackListAPI (json) {
    return http.post('/mobile/wsq/WP/event/search', json)
  },

  // 进行中
  getVoteListSuccessAPI () {
    return http.get('/api/v4/tags/2/taggable_forms', '')
  },
  // 获取表单对象
  getFormsAPI () {
    return http.get('/api/v4/forms/333', '')
  },
  getFormsResponsesAPI () {
    return http.get('/api/v4/forms/334/responses', '')
  }
  // 获取表单数据

}
