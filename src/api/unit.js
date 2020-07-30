
// 公用方法
export default {
  // 构建数据对象
  listData (data) {
    let tableList = []
    data.forEach(element => {
      let tableObjData = {}
      let ele = element.mapped_values
      tableObjData.supplies_name = ele.supplies_name.exported_value[0]
      tableObjData.supplies_img = ele.supplies_img.exported_value[0].slice(ele.supplies_img.exported_value[0].indexOf('（') + 1, ele.supplies_img.exported_value[0].indexOf('）'))
      tableObjData.supplies_time = ele.supplies_time.exported_value[0]
      tableObjData.review_state = ele.review_state.exported_value[0]
      tableList.push(tableObjData)
    })
    return tableList
  },

  // 构建传输对象
  tableListData (fields, orderFieldList) {
    let tableList = []
    orderFieldList.forEach(element => {
      let field = fields.find(field => field.identity_key === element)
      let objData = {}
      if (field) {
        switch (field.type) {
          case 'Field::RadioButton': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.option_id = ''
            objData.options = field.options
            break
          }

          default: {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.value = ''
          }
        }
        tableList.push(objData)
      }
    })

    return tableList
  },
  // 获取当前时间
  formatDateTime () {
    let date = new Date()
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let m = date.getMinutes()
    m = m < 10 ? '0' + m : m

    return y + '-' + MM + '-' + d + ' ' + h + ':' + m
  },
//  重构时间（时间格式，时间）
  dateFormat(fmt, date) {
    var date = new Date(date);
    var ret;
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (var k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  },
  // 解析图片地址
  getImgUrl(str){
    return str.match(/(http?.+)\?/)[1]
  }
}
