<template>
  <div class="streetWish">
    <claim-header :title="title"></claim-header>
    <div class="wishShow">
      <van-tabs v-model="active">
        <van-tab title="待审核">
          <div v-for="(item) in auditFormData" class="wishContainer" @click="showPopup(item)">
            <div class="wishImg">
              <img :src="item.img_url" alt />
            </div>
            <div class="wishContent">
              <P>{{item.pepole.name}}的心愿：{{item.pepole.wishDesc}}</P>
              <p>{{item.creatTime}}</p>
            </div>
            <div class="info auditStatus">{{item.audit.statusStreet}}</div>
          </div>
        </van-tab>
        <van-tab title="已通过">
          <div v-for="(item) in passFormData" class="wishContainer" @click="showPopup(item)">
            <div class="wishImg">
              <img :src="item.img_url" alt />
            </div>
            <div class="wishContent">
              <P>{{item.pepole.name}}的心愿：{{item.pepole.wishDesc}}</P>
              <p>{{item.creatTime}}</p>
            </div>
            <div class="primary auditStatus">{{item.audit.statusStreet}}</div>
          </div>
        </van-tab>
        <van-tab title="已退回">
          <div v-for="(item) in unpassFormData" class="wishContainer" @click="showPopup(item)">
            <div class="wishImg">
              <img :src="item.img_url" alt />
            </div>
            <div class="wishContent">
              <P>{{item.pepole.name}}的心愿：{{item.pepole.wishDesc}}</P>
              <p>{{item.creatTime}}</p>
            </div>
            <div class="danger auditStatus">{{item.audit.statusStreet}}</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup
      v-model="show"
      closeable
      close-icon="close"
      :style="{ width:'80%' ,height:'80%'}"
      class="myOverlay"
      v-if="formData.id"
    >
      <p class="titleOverlay">心愿详情</p>
      <div class="imgOverlay">
        <img :src="formData.img_url" alt />
      </div>
      <div class="contentOverlay">
        <van-field label="姓名：" readonly type="text" v-model="formData.pepole.name" />
        <van-field label="联系电话：" readonly type="text" v-model="formData.pepole.tel" />
        <van-field label="身份证号码：" readonly type="text" v-model="formData.pepole.idCard" />
        <van-field label="所属社区：" readonly type="text" v-model="formData.pepole.community" />
        <van-field label="心愿描述：" readonly type="text" v-model="formData.pepole.wishDesc" />
        <van-field label="家庭住址：" readonly type="text" v-model="formData.pepole.familyAddr" />
        <van-field label="家庭情况：" readonly type="text" v-model="formData.pepole.familyDesc" />
        <van-field
          v-if="formData.audit.statusStreet==='已退回'"
          label="退回原因："
          readonly
          type="text"
          v-model="formData.pepole.rejectDesc"
        />
        <van-field
          v-if="formData.audit.statusStreet==='待审核'"
          autosize
          label="回退理由："
          type="textarea"
          v-model="myTextArea"
        />
        <p
          class="textNum"
          v-if="myTextArea.length<=maxtext&&formData.audit.statusStreet==='待审核'"
        >{{myTextArea.length||0}}/{{maxtext}}</p>
        <p
          class="textNum"
          v-else-if="myTextArea.length>maxtext&&formData.audit.statusStreet==='待审核'"
        >
          <span :style="{ color:'red' }">{{myTextArea.length||0}}</span>
          /{{maxtext}}
        </p>
        <div class="claimBtn" v-if="formData.audit.statusStreet==='待审核'">
          <div class="primary" @click="pass">通过</div>
          <div class="danger" @click="nopass">退回</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import api from "@/api/api";
import unit from "../../api/unit";
import claimHeader from "../component/header";
export default {
  name: "streetWish",
  components: {
    claimHeader,
  },
  data() {
    return {
      title: "街道办心愿审核",
      maxtext: 100, //退回原因最大字数限制
      active: 0,
      myTextArea: "", //文本域的内容
      show: false, //弹出框展示
      formId: "328", //表单号
      formSumData: [], //所有的数据
      formData: {
        audit: { id: "", status: "", option_id: "" },
        pepole: { name: "", field_id: "" },
      }, //点击当前对象
      auditFormData: [], //待审核
      passFormData: [], //已通过
      unpassFormData: [], //已退回
      formNameData: [], //表单属性(表头的数据)
      //默认图片路径
      defaultwishPhoto:
        "http://fs-material.yqfw.cdyoue.com/25925-1594178327-226796841ca9c183c658635e82ec112c-1594178328596",
    };
  },
  methods: {
    //通过的函数
    pass() {
      this.myTextArea = "";
      let str = ""; //请求数据
      //请求所需要的字段
      let obj = {};
      this.formNameData.forEach((item) => {
        if (item.identity_key === "streetauditDateTime") {
          obj.timeFileId = item.id;
        }
        if (item.identity_key === "streetauditStatus") {
          obj.auditStatusId = item.id;
          item.options.forEach((item) => {
            if (item.value === "已通过") {
              obj.auditStatusOptionId = item.id;
            }
          });
        }
        if (item.identity_key === "claimStatus") {
          obj.handStatusId = item.id;
          item.options.forEach((item) => {
            if (item.value === "待认领") {
              obj.handStatusOptionId = item.id;
            }
          });
        }
      });
      if (this.formData.audit.idStreet) {
        str = {
          response: {
            entries_attributes: [
              {
                id: this.formData.audit.idStreet,
                option_id: obj.auditStatusOptionId, //审核状态的option_id
              },
              {
                field_id: obj.timeFileId, //审核通过时间字段
                value: unit.formatDateTime(), //审核时间
              },
              {
                field_id: obj.handStatusId, //街道办审核状态filed_id
                option_id: obj.handStatusOptionId, //街道办审核状态option_id
              },
            ],
          },
        };
      } else {
        str = {
          response: {
            entries_attributes: [
              {
                field_id: obj.auditStatusId, //审核状态字段
                option_id: obj.auditStatusOptionId, //审核状态的option_id
              },
              {
                field_id: obj.timeFileId, //审核时间通过字段
                value: unit.formatDateTime(), //审核时间
              },
              {
                field_id: obj.handStatusId, //街道办审核状态filed_id
                option_id: obj.handStatusOptionId, //街道办审核状态option_id
              },
            ],
          },
        };
      }
      api.putFormsAmendAPI(this.formId, this.formData.id, str).then((res) => {
        this.show = false;
        this.formSumData = res.data;
        if (res.status === 200) {
          this.formNameData.forEach((item) => {
            if (item.identity_key === "streetauditStatus") {
              this.formData.audit.idStreet = item.id;
              item.options.forEach((item) => {
                if (item.value === "已通过") {
                  this.formData.audit.statusStreet = item.value;
                  this.formData.audit.option_idStreet = item.id;
                }
              });
            }
          });
          let headers = {
            "content-type": "application/json",
          };
          let pushData = {
            openids: res.data.user.openid,
            news_entity: {
              title: "微心愿",
              description: "您的心愿街道办通过啦！",
              picurl: "http://fs.yqfw.cdyoue.com/FrK0znBbMdci-I4iqLuOgOK6tIPR",
              url: "http://47.92.163.233:9090/tiny_wish/claim",
            },
          };
          api.postPushWeChat(pushData, headers).then((res) => {
            this.$toast("已通过");
            this.$router.go(0);
          });
        } else {
          this.$toast("通过失败 >_<");
        }
      });
    },
    //回退的函数
    nopass() {
      let str = ""; //请求数据
      //请求所需要的字段
      let obj = {};
      if (this.myTextArea) {
        //  有退回原因
        this.formNameData.forEach((item) => {
          if (item.identity_key === "streetauditDateTime") {
            obj.timeFileId = item.id;
          }
          if (item.identity_key === "streetauditStatus") {
            obj.auditStatusId = item.id;
            item.options.forEach((item) => {
              if (item.value === "已退回") {
                obj.auditStatusOptionId = item.id;
              }
            });
          }
          if (item.identity_key === "street_retrun_reject") {
            obj.rejectDescId = item.id;
          }
        });
        if (this.formData.audit.idStreet) {
          str = {
            response: {
              entries_attributes: [
                {
                  id: this.formData.audit.idStreet,
                  option_id: obj.auditStatusOptionId, //审核状态的option_id
                },
                {
                  field_id: obj.timeFileId, //社区审核通过时间字段
                  value: unit.formatDateTime(), //审核时间
                },
                {
                  field_id: obj.rejectDescId, //社区退回原因字段
                  value: this.myTextArea, //退回原因
                },
              ],
            },
          };
        } else {
          str = {
            response: {
              entries_attributes: [
                {
                  field_id: obj.auditStatusId, //社区审核状态字段
                  option_id: obj.auditStatusOptionId, //社区审核状态的option_id
                },
                {
                  field_id: obj.timeFileId, //社区审核时间通过字段
                  value: unit.formatDateTime(), //审核时间
                },
                {
                  field_id: obj.rejectDescId, //退回原因字段
                  value: this.myTextArea, //退回原因
                },
              ],
            },
          };
        }
        //退回请求
        api.putFormsAmendAPI(this.formId, this.formData.id, str).then((res) => {
          this.show = false;
          this.formSumData = res.data;
          if (res.status === 200) {
            this.formNameData.forEach((item) => {
              if (item.identity_key === "streetauditStatus") {
                this.formData.audit.idStreet = item.id;
                item.options.forEach((item) => {
                  if (item.value === "已退回") {
                    this.formData.audit.statusStreet = item.value;
                    this.formData.audit.option_idStreet = item.id;
                  }
                });
              }
            });
            let headers = {
              "content-type": "application/json",
            };
            let pushData = {
              openids: res.data.user.openid,
              news_entity: {
                title: "微心愿",
                description: "不好意思，您的心愿不满足审核条件！",
                picurl:
                  "http://fs.yqfw.cdyoue.com/FrK0znBbMdci-I4iqLuOgOK6tIPR",
              },
            };
            api.postPushWeChat(pushData, headers).then((res) => {
              this.$toast("已退回");
              this.$router.go(0);
            });
          } else {
            this.$toast("退回失败 >_<");
          }
        });
      } else {
        //  没有退回原因
        this.$toast.fail("没有退回原因！");
      }
    },
    showPopup(arr) {
      this.show = true;
      this.formData = arr;
    },
  },
  beforeCreate() {
    //获取心愿表单数据
    api.getFormsAPI("328").then((res) => {
      this.formNameData = res.data.fields;
    });
    //  获取心愿审核的数据
    api.getFormsResponsesAPI("328").then((res) => {
      this.formSumData = res.data;
      res.data.forEach((item) => {
        let objData = {
          id: "",
          audit: { id: "", status: "", option_id: "" },
          pepole: { name: "", field_id: "" },
          creatTime: "",
          img_url: "",
        };
        //  对象创建的时间
        objData.creatTime = unit.dateFormat(
          "YYYY-mm-dd HH:MM",
          item.created_at
        );
        //  对象的id
        objData.id = item.id;
        //  对象的社区状态和option_id
        if (item.mapped_values.auditStatus) {
          objData.audit.status = item.mapped_values.auditStatus.value[0].value;
          objData.audit.option_id = item.mapped_values.auditStatus.value[0].id;
        } else {
          objData.audit.status = "待审核";
          this.formNameData.forEach((item) => {
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
        if (item.mapped_values.streetauditStatus) {
          objData.audit.statusStreet =
            item.mapped_values.streetauditStatus.value[0].value;
          objData.audit.option_idStreet =
            item.mapped_values.streetauditStatus.value[0].id;
        } else {
          objData.audit.statusStreet = "待审核";
          this.formNameData.forEach((item) => {
            if (item.identity_key === "streetauditStatus") {
              item.options.forEach((item) => {
                if (item.value === "待审核") {
                  objData.audit.option_idStreet = item.id;
                }
              });
            }
          });
          objData.audit.idStreet = "";
        }
        //对象的心愿描述内容
        objData.pepole.wishDesc = item.mapped_values.wishDesc.value[0];
        objData.pepole.community = item.mapped_values.community.value[0].value;
        objData.pepole.familyAddr = item.mapped_values.familyAddr.value[0];
        objData.pepole.familyDesc = item.mapped_values.familyDesc.value[0];
        objData.pepole.tel = item.mapped_values.tel.value[0];
        objData.pepole.idCard = item.mapped_values.idCard.value[0];
        if (item.mapped_values.street_retrun_reject) {
          objData.pepole.rejectDesc =
            item.mapped_values.street_retrun_reject.value[0];
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
          if (objData.audit.statusStreet === item.entries[y].value) {
            objData.audit.idStreet = item.entries[y].id;
          }
        }
        if (!objData.img_url) {
          objData.img_url = this.defaultwishPhoto;
        }
        if (
          objData.audit.statusStreet === "待审核" &&
          objData.audit.status === "已通过"
        ) {
          this.auditFormData.push(objData);
        } else if (
          objData.audit.statusStreet === "已通过" &&
          objData.audit.status === "已通过"
        ) {
          this.passFormData.push(objData);
        } else if (
          objData.audit.statusStreet === "已退回" &&
          objData.audit.status === "已通过"
        ) {
          this.unpassFormData.push(objData);
        }
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.info {
  background-color: #81b3ff;
}
.primary {
  background-color: #1da56c;
}
.danger {
  background-color: #d5501f;
}
.wishShow {
  margin: 1rem auto;
  .van-tab__pane {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .van-tabs {
    width: 100%;
  }
  .wishContainer {
    width: 50%;
    position: relative;
    padding: 1rem 0px 4rem;
    .wishImg {
      img {
        width: 14rem;
        height: 12rem;
        border-radius: 1rem;
        margin-bottom: 1rem;
      }
    }
    .wishContent {
      p {
        font-size: 1.4rem;
        line-height: 2rem;
        margin: 0.5rem 2.2rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .auditStatus {
      color: #fff;
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0.5rem auto;
      border-radius: 0.5rem;
      border: none;
      display: block;
      line-height: 3rem;
      width: 80%;
      padding: 3px 0;
    }
  }
}
.myOverlay {
  border-radius: 20px;
  padding: 20px 10px;
  .titleOverlay {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    line-height: 40px;
  }
  .imgOverlay {
    width: 140px;
    height: 120px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .contentOverlay {
    p {
      margin-bottom: 5px;
    }
    .textNum {
      text-align: right;
      margin-right: 20px;
    }
    .claimBtn {
      display: flex;
      justify-content: space-around;
      div {
        width: 30%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: white;
      }
    }
  }
}
/deep/ textarea,
.van-field__control {
  border: 1px solid rgba(165, 155, 155, 0.5);
}
</style>
