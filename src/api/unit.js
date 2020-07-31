
// 公用方法
export default {
  // 构建数据对象
  listData(data) {
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
  tableListData(fields, orderFieldList) {
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
  formatDateTime() {
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
    var date = date ? new Date(date) : new Date();
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
  getImgUrl(str) {
    return str.match(/(http?.+)\?/)[1]
  },
  //  构建审核页面的对象
  createdObj(myStatus, formNameData, data, auditStatus, communityStr) {
    let newData = [];
    let myCommunity = ''
    let defaultwishPhoto = "http://fs.yqfw.cdyoue.com/FrK0znBbMdci-I4iqLuOgOK6tIPR"
    data.some(item => {
      if (communityStr) {
        communityStr.some(communityItem => {
          if (communityItem === item.mapped_values.community.value[0].value) {
            myCommunity = communityItem;
            return true;
          }
        })
      }
    })
    data.forEach(item => {
      let objData = { audit: {}, pepole: {} };
      objData.creatTime = this.dateFormat("YYYY-mm-dd HH:MM", item.created_at);
      objData.id = item.id;
      objData.pepole.wishDesc = item.mapped_values.wishDesc.value[0];
      objData.pepole.familyAddr = item.mapped_values.familyAddr.value[0];
      objData.pepole.familyDesc = item.mapped_values.familyDesc.value[0];
      objData.pepole.tel = item.mapped_values.tel.value[0];
      objData.pepole.idCard = item.mapped_values.idCard.value[0];
      objData.pepole.community = item.mapped_values.community.value[0].value;
      //  对象的状态和option_id
      if (item.mapped_values.auditStatus) {
        objData.audit.status = item.mapped_values.auditStatus.value[0].value;
        objData.audit.option_id = item.mapped_values.auditStatus.value[0].id;
      } else {
        objData.audit.status = "待审核";
        formNameData.forEach((item) => {
          if (item.identity_key === "auditStatus") {
            item.options.forEach((item) => {
              if (item.value === "待审核") {
                objData.audit.option_id = item.id;
              }
            });
          }
        });
        objData.audit.id = "";
      }
      //  对象的街道办状态和option_id

      if (item.mapped_values.streetAuditStatus) {
        objData.audit.statusStreet =
          item.mapped_values.streetAuditStatus.value[0].value;
        objData.audit.option_idStreet =
          item.mapped_values.streetAuditStatus.value[0].id;
      } else {
        objData.audit.statusStreet = "待审核";
        formNameData.forEach((item) => {
          if (item.identity_key === "streetAuditStatus") {
            item.options.forEach((item) => {
              if (item.value === "待审核") {
                objData.audit.option_idStreet = item.id;
              }
            });
          }
        });
        objData.audit.idStreet = "";
      }
      if (item.mapped_values.rejectDesc) {
        objData.pepole.rejectDesc = item.mapped_values.rejectDesc.value[0];
      }
      for (let y = 0; y < item.entries.length; y++) {
        //  对象的图片路径
        if (item.entries[y].attachment) {
          let str = item.entries[y].attachment.download_url;
          let url = str.slice(0, str.indexOf("?"));
          objData.img_url = url;
        }
        //  对象的名字和field_id
        if (item.mapped_values.name.value[0] === item.entries[y].value) {
          objData.pepole.name = item.entries[y].value || "";
          objData.pepole.field_id = item.entries[y].field_id;
        }
        //  对象状态的field_id
        if (objData.audit.status === item.entries[y].value) {
          objData.audit.id = item.entries[y].id;
        }
      }
      if (!objData.img_url) {
        objData.img_url = defaultwishPhoto;
      }
      switch (myStatus) {
        case 'status': if (objData.audit.status === auditStatus && objData.pepole.community === myCommunity) {
          newData.push(objData)
        } else if (objData.audit.status === auditStatus && !myCommunity) {
          newData.push(objData)
        }; break;
        case 'statusStreet': if (objData.audit.statusStreet === auditStatus && objData.pepole.community === myCommunity) {
          newData.push(objData)
        }else if (objData.audit.statusStreet === auditStatus && !myCommunity){

          newData.push(objData)
        }; break;
      }
    })
    return newData
  },
//  传送信息对象
  createdWeixin(openids,title,description,picurl,url){
    return {
      "openids":openids,
      "news_entity": {
        "title":title,
        "description":description,
        "picurl":picurl,
        "url":url
      },}
  }
}
