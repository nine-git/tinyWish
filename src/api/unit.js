
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
  }

}
