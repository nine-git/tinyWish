<template>
  <div class="claim">
    <claim-header :title="title"></claim-header>
    <div class="main">
      <van-tabs v-model="active">
        <van-tab title="待认领">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in claimList">
            <img :src="itemImg" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}的心愿：
              <span>{{item.mapped_values.wishDesc.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="claiming">待认领</span>
            </button>
          </div>
        </van-tab>
        <van-tab title="已认领">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in claimedList">
            <img :src="itemImg" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}的心愿：
              <span>{{item.mapped_values.wishDesc.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="claimed">已认领</span>
            </button>
          </div>
        </van-tab>
        <van-tab title="已完成">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in finishList">
            <img :src="itemImg" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}的心愿：
              <span>{{item.mapped_values.wishDesc.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="complete">已完成</span>
            </button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup
      :style="{ height: '80%',width:'80%' }"
      close-icon="close"
      closeable
      round
      v-model="show"
    >
      <div class="popup">
        <p class="popup_title">心愿详情</p>
        <img :src="fromData.img" alt class="popup_img" />
        <van-field label="发起人：" readonly type="text" v-model="fromData.name" />
        <van-field label="所属社区：" readonly type="text" v-model="fromData.community" />
        <van-field label="家庭情况：" readonly type="text" v-model="fromData.familyDesc" />

        <van-field autosize label="心愿描述：" readonly type="textarea" v-model="fromData.wishDesc" />

        <div v-if="!fromData.claimer">
          <div :key="item.identity_key" v-for="item in tableData">
            <div v-if="item.type === 'Field::TextField'">
              <p v-if="item.identity_key ==='claimer'">
                <van-field
                  :label="item.title +'：'"
                  placeholder="请输入"
                  type="text"
                  v-model="item.value"
                />
              </p>
              <p v-else-if="item.identity_key ==='claimPhone'">
                <van-field
                  :label="item.title +'：'"
                  placeholder="请输入"
                  type="text"
                  v-model="item.value"
                />
              </p>
              <p v-else-if="item.identity_key ==='claimCompany'">
                <van-field
                  :label="item.title +'：'"
                  placeholder="请输入"
                  type="text"
                  v-model="item.value"
                />
              </p>
            </div>
          </div>
          <button @click="send(tableData)" class="popup_button button">确认认领</button>
        </div>
        <div v-else>
          <van-field label="认领人姓名：" readonly type="text" v-model="fromData.claimer" />
          <van-field label="认领人电话：" readonly type="text" v-model="fromData.claimPhone" />
          <van-field label="认领人单位：" readonly type="text" v-model="fromData.claimCompany" />

          <!-- 交接模块 -->
          <div v-if="!fromData.finishDesc">
            <div :key="item.identity_key" v-for="item in tableData">
              <div v-if="item.identity_key ==='finishPhoto'">
                <p class="finishPhoto">上传交接图片：</p>
                <van-uploader v-model="uploader" :after-read="afterRead" />
              </div>
              <p v-if="item.identity_key ==='finishDesc'">
                <van-field
                  :label="item.title +'：'"
                  placeholder="请输入"
                  type="text"
                  v-model="item.value"
                />
              </p>
            </div>
            <button @click="finish(tableData)" class="popup_button button">资料提交</button>
          </div>
          <div v-else>
            <p class="popup_img_title">交接照片：</p>
            <img :src="fromData.finishPhoto" alt class="popup_img" />

            <van-field label="交接描述：" readonly type="text" v-model="fromData.finishDesc" />
            <van-field label="交接时间：" readonly type="text" v-model="fromData.finishDateTime" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import claimHeader from "../component/header";
import api from "../../api/api";
import unit from "@/api/unit";

export default {
  name: "wish",
  data() {
    return {
      title: "认领心愿",
      claimedList: [],
      finishList: [],
      claimList: [],
      itemImg: "",
      show: false,
      fromData: "",
      fields: "",
      uploader: [],
      orderFieldList: [
        "claimer",
        "claimPhone",
        "claimCompany",
        "claimStatus",
        "finishPhoto",
        "finishDesc",
        "finishDateTime",
      ],
      tableData: [],
      date: "",
      dataID: "",
      option_id: "",
      uptoken: "",
      active: 0,
      finishPhoto: "",
    };
  },
  components: {
    claimHeader,
  },
  mounted() {
    document.title = "认领心愿";
    api.getFormsResponsesAPI(328).then((res) => {
      res = res.data;
      res.forEach((element) => {
        if (element.mapped_values.streetAuditStatus) {
          if (
            element.mapped_values.streetAuditStatus.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claimStatus.exported_value[0] === "已认领"
          ) {
            element.entries.forEach((el) => {
              if (el.attachment) {
                let str = el.attachment.download_url;
                element.img = str.slice(0, str.indexOf("?"));
              }
            });
            element.time = element.created_at.slice(0, 10);
            this.claimedList.push(element);
          }
          if (
            element.mapped_values.streetAuditStatus.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claimStatus.exported_value[0] === "已完成"
          ) {
            element.entries.forEach((el) => {
              if (el.attachment) {
                let str = el.attachment.download_url;
                element.img = str.slice(0, str.indexOf("?"));
              }
            });
            element.time = element.created_at.slice(0, 10);
            this.finishList.push(element);
          }
          if (
            element.mapped_values.streetAuditStatus.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claimStatus.exported_value[0] === "待认领"
          ) {
            element.entries.forEach((el) => {
              if (el.attachment) {
                let str = el.attachment.download_url;
                element.img = str.slice(0, str.indexOf("?"));
              }
            });
            element.time = element.created_at.slice(0, 10);
            this.claimList.push(element);
          }
        }
      });
    });
    api.getFormsAPI(328).then((res) => {
      this.itemImg = unit.getImgUrl(res.data.description);
      this.fields = res.data.fields;
      this.tableData = unit.tableListData(this.fields, this.orderFieldList);
    });
  },
  methods: {
    // 文件的上传
    afterRead(file) {
      api.getUptokenAPI().then((res) => {
        this.uptoken = res.data.uptoken;
        let formData = new FormData();
        // 此时可以自行将文件上传至服务器
        formData.append("file", file.file);
        formData.append("token", this.uptoken);
        formData.append("x:key", "1597796993541");
        let data = formData;

        let headers = {
          "content-type": false,
        };

        api.postQiNiuApi(data, headers).then((res) => {
          if (res.status === 200) {
            let payload = {
              response: { entries_attributes: [] },
            };
            payload.response.entries_attributes.push({
              field_id: 9189,
              value: "附件",
              value_id: res.data.id
            });
            // 发请求上传图片
            api.putFormsAmendAPI(328, this.dataID, payload).then((res) => {
              if (res.status === 200) {
                this.$toast("上传成功 ✨");
              } else {
                this.$toast("上传失败 >_<");
              }
            });
          } else {
            this.$toast("网络波动，请再试一次");
          }
        });
      });
    },
    claim(el) {
      el.entries.forEach((element) => {
        if (element.field_id === 9190) {
          this.option_id = element.id;
        }
      });
      this.show = true;
      this.dataID = el.id;
      this.fromData = {
        img: el.img,
        name: el.mapped_values.name.exported_value[0],
        community: el.mapped_values.community.exported_value[0],
        familyDesc: el.mapped_values.familyDesc.exported_value[0],
        wishDesc: el.mapped_values.wishDesc.exported_value[0],
      };
      if (el.mapped_values.claimer) {
        this.fromData = {
          img: el.img,
          name: el.mapped_values.name.exported_value[0],
          community: el.mapped_values.community.exported_value[0],
          familyDesc: el.mapped_values.familyDesc.exported_value[0],
          wishDesc: el.mapped_values.wishDesc.exported_value[0],
          claimer: el.mapped_values.claimer.exported_value[0],
          claimPhone: el.mapped_values.claimPhone.exported_value[0],
          claimCompany: el.mapped_values.claimCompany.exported_value[0],
        };
      }
      if (el.mapped_values.finishPhoto) {
        el.entries.forEach((el) => {
          if (el.field_id == 9189) {
            let str = el.attachment.download_url;
            this.finishPhoto = str.slice(0, str.indexOf("?"));
          }
        });
        this.fromData = {
          img: el.img,
          name: el.mapped_values.name.exported_value[0],
          community: el.mapped_values.community.exported_value[0],
          familyDesc: el.mapped_values.familyDesc.exported_value[0],
          wishDesc: el.mapped_values.wishDesc.exported_value[0],
          claimer: el.mapped_values.claimer.exported_value[0],
          claimPhone: el.mapped_values.claimPhone.exported_value[0],
          claimCompany: el.mapped_values.claimCompany.exported_value[0],
          finishDesc: el.mapped_values.finishDesc.exported_value[0],
          finishDateTime: el.mapped_values.finishDateTime.exported_value[0],
          finishPhoto: this.finishPhoto,
        };
      }
    },

    send(data) {
      // 获取时间
      this.date = unit.formatDateTime();
      let payload = {
        response: { entries_attributes: [] },
      };
      data.forEach((element) => {
        if (element.value !== "") {
          if (element.field_id !== 9190) {
            payload.response.entries_attributes.push({
              field_id: element.field_id,
              value: element.value,
            });
          }
        }
      });
      // 自动填值
      payload.response.entries_attributes.push(
        {
          id: this.option_id,
          field_id: 9190,
          option_id: 7361,
        },
        {
          field_id: 9270,
          value: this.date,
        }
      );
      api.putFormsAmendAPI(328, this.dataID, payload).then((res) => {
        if (res.status === 200) {
          let headers = {
            "content-type": "application/json",
          };
          let pushData = {
            openids: res.data.user.openid,
            news_entity: {
              title: "微心愿",
              description: "你的心愿已实现",
              picurl: "http://fs.yqfw.cdyoue.com/FrK0znBbMdci-I4iqLuOgOK6tIPR",
              url: "http://47.92.163.233:9090/tiny_wish/claim",
            },
          };
          api.postPushWeChat(pushData, headers).then((res) => {
            this.$toast("认领成功 ✨");
            this.$router.go(0);
          });
        } else {
          this.$toast("认领失败 >_<");
        }
      });
    },
    finish(data) {
      this.date = unit.formatDateTime();
      let payload = {
        response: { entries_attributes: [] },
      };
      data.forEach((element) => {
        if (element.value !== "") {
          if (element.field_id !== 9190) {
            payload.response.entries_attributes.push({
              field_id: element.field_id,
              value: element.value,
            });
          }
        }
      });
      // 自动填值
      payload.response.entries_attributes.push(
        {
          field_id: 9202,
          value: this.date,
        },
        {
          id: this.option_id,
          field_id: 9190,
          option_id: 7362,
        }
      );
      api.putFormsAmendAPI(328, this.dataID, payload).then((res) => {
        if (res.status === 200) {
          this.$toast("上传成功 ✨");
          this.$router.go(0);
        } else {
          this.$toast("上传失败 >_<");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  margin: 1rem auto;

  .van-tab__pane {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .van-tabs {
    width: 100%;
  }

  .main_item {
    width: 50%;
    position: relative;
    padding: 1rem 0px 4rem;

    .main_img {
      width: 14rem;
      height: 12rem;
      border-radius: 1rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.4rem;
      line-height: 2rem;
      margin: 0.5rem 2.2rem;
      text-align: left;
      width: 14rem;
      margin: 0.5rem auto;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .mian_button {
      width: 14rem;
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0.5rem auto;
    }
  }
}
.popup {
  padding: 2rem 1rem;

  .popup_title {
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 4rem;
  }

  .popup_img {
    width: 14rem;
    height: 12rem;
    border-radius: 1rem;
  }
  .popup_img_title,
  .finishPhoto {
    margin-top: 2rem;
    text-align: left;
    padding: 1rem 2rem;
    letter-spacing: 1px;
    color: #323233;
    font-size: 14px;
    line-height: 2.4rem;
  }
  .popup_button {
    margin: 2rem auto;
  }
}
.button {
  color: #fff;
  background: #03a9f4;
  border-radius: 2rem;
  border: none;
  display: block;
  line-height: 3rem;
  width: 80%;
  padding: 0px;
}

.claiming {
  padding: 3px;
  width: 100%;
  display: block;
  background: #03a9f4;
  border-radius: 0.5rem;
}

.complete {
  padding: 3px;
  width: 100%;
  display: block;
  background: #9e9e9e;
  border-radius: 0.5rem;
}

.claimed {
  padding: 3px;
  width: 100%;
  display: block;
  background: #ff9800;
  border-radius: 0.5rem;
}
</style>
