<template>
  <div class="apply">
    <claim-header :title="title"></claim-header>
    <div class="main">
      <van-tabs v-model="active">
        <van-tab title="未被认领">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in claimList">
            <img :src="item.img" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}捐赠的物资：
              <span>{{item.mapped_values.supplies_name.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="claiming">待认领</span>
            </button>
          </div>
        </van-tab>
        <van-tab title="已认领">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in claimedList">
            <img :src="item.img" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}捐赠的物资：
              <span>{{item.mapped_values.supplies_name.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="claimed">已认领</span>
            </button>
          </div>
        </van-tab>
        <van-tab title="已完成">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in finishList">
            <img :src="item.img" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}捐赠的物资：
              <span>{{item.mapped_values.supplies_name.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="complete">已完成</span>
            </button>
          </div>
        </van-tab>
        <van-tab title="已失效">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in loseList">
            <img :src="item.img" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}捐赠的物资：
              <span>{{item.mapped_values.supplies_name.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="complete">已失效</span>
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
        <p class="popup_title">认领详情</p>
        <img :src="fromData.img" alt class="popup_img" />
        <van-field label="企业：" readonly type="text" v-model="fromData.company" />
        <van-field label="联系人：" readonly type="text" v-model="fromData.name" />
        <van-field autosize label="联系电话：" readonly v-model="fromData.phone" />
        <van-field label="物资名称：" readonly type="text" v-model="fromData.supplies_name" />

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
              <p v-else-if="item.identity_key ==='claim_phone'">
                <van-field
                  :label="item.title +'：'"
                  placeholder="请输入"
                  type="text"
                  v-model="item.value"
                />
              </p>
              <p v-else-if="item.identity_key ==='claim_time'">
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
        <!-- 待认领 -->
        <div v-else-if="fromData.claimer">
          <van-field label="认领人姓名：" readonly type="text" v-model="fromData.claimer" />
          <van-field label="认领人电话：" readonly type="text" v-model="fromData.claim_phone" />
          <van-field label="认领时间：" readonly type="text" v-model="fromData.claim_time" />

          <!-- 交接模块 -->
          <div v-if="!fromData.connect_img">
            <div :key="item.identity_key" v-for="item in tableData">
              <div v-if="item.identity_key ==='connect_img'">
                <p class="finishPhoto">上传交接图片：</p>
                <van-uploader :after-read="afterRead" />
              </div>
              <p v-if="item.identity_key ==='connect_describe'">
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
            <img :src="fromData.connect_img" alt class="popup_img" />

            <van-field label="交接描述：" readonly type="text" v-model="fromData.connect_describe" />
            <van-field label="交接时间：" readonly type="text" v-model="fromData.connect_time" />
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
  data() {
    return {
      title: "认领物资",
      claimedList: [],
      finishList: [],
      claimList: [],
      loseList: [],
      show: false,
      fromData: "",
      fromId: 334,
      fields: "",
      orderFieldList: [
        "claimer",
        "claim_state",
        "claim_phone",
        "claim_time",
        "connect_img",
        "connect_describe",
        "connect_time",
      ],
      tableData: [],
      date: "",
      dataID: "",
      option_id: "",
      uptoken: "",
      value_id: "",
      active: "0",
    };
  },
  components: {
    claimHeader,
  },
  mounted() {
    document.title = "认领物资";
    api.getFormsResponsesAPI(this.fromId).then((res) => {
      res = res.data;
      res.forEach((element) => {
        // 返回物资的的状态
        if (element.mapped_values.review_street_state) {
          if (
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "未被认领"
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
          if (
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "已认领"
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
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "已完成"
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
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "已失效"
          ) {
            element.entries.forEach((el) => {
              if (el.attachment) {
                let str = el.attachment.download_url;
                element.img = str.slice(0, str.indexOf("?"));
              }
            });
            element.time = element.created_at.slice(0, 10);
            this.loseList.push(element);
          }
        }
      });
    });
    api.getFormsAPI(this.fromId).then((res) => {
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
            this.$toast("上传成功 ✨");
            this.value_id = res.data.id;
          } else {
            this.$toast("网络波动，请再试一次");
          }
        });
      });
    },
    claim(el) {
      el.entries.forEach((element) => {
        if (element.field_id === 9262) {
          this.option_id = element.id;
        }
      });
      this.show = true;
      this.dataID = el.id;
      this.fromData = {
        img: el.img,
        company: el.mapped_values.company.exported_value[0],
        name: el.mapped_values.name.exported_value[0],
        phone: el.mapped_values.phone.exported_value[0],
        supplies_name: el.mapped_values.supplies_name.exported_value[0],
      };
      if (el.mapped_values.claimer) {
        this.fromData = {
          img: el.img,
          company: el.mapped_values.company.exported_value[0],
          name: el.mapped_values.name.exported_value[0],
          phone: el.mapped_values.phone.exported_value[0],
          supplies_name: el.mapped_values.supplies_name.exported_value[0],
          claimer: el.mapped_values.claimer.exported_value[0],
          claim_phone: el.mapped_values.claim_phone.exported_value[0],
          claim_time: el.mapped_values.claim_time.exported_value[0],
        };
        if (el.mapped_values.connect_time) {
          this.fromData = {
            img: el.img,
            company: el.mapped_values.company.exported_value[0],
            name: el.mapped_values.name.exported_value[0],
            phone: el.mapped_values.phone.exported_value[0],
            supplies_name: el.mapped_values.supplies_name.exported_value[0],
            claimer: el.mapped_values.claimer.exported_value[0],
            claim_phone: el.mapped_values.claim_phone.exported_value[0],
            claim_time: el.mapped_values.claim_time.exported_value[0],
            connect_img: el.mapped_values.connect_img.exported_value[0].slice(
              el.mapped_values.connect_img.exported_value[0].indexOf("（") + 1,
              el.mapped_values.connect_img.exported_value[0].indexOf("）")
            ),
            connect_describe:
              el.mapped_values.connect_describe.exported_value[0],
            connect_time: el.mapped_values.connect_time.exported_value[0],
          };
        }
      }
    },
    send(data) {
      // console.log(data);
      // 获取时间
      this.date = unit.formatDateTime();
      let payload = {
        response: { entries_attributes: [] },
      };
      data.forEach((element) => {
        if (element.value !== "") {
          // 修改认领状态
          if (element.field_id !== 9262) {
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
          field_id: 9262,
          option_id: 7384,
        },
        {
          field_id: 9269,
          value: this.date,
        }
      );
      api.putFormsAmendAPI(this.fromId, this.dataID, payload).then((res) => {
        if (res.status === 200) {
          this.$toast("认领成功 ✨");
          this.$router.go(0);
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
          if (element.field_id !== 9262) {
            payload.response.entries_attributes.push({
              field_id: element.field_id,
              value: element.value,
            });
          }
        }
      });
      // 自动填值
      payload.response.entries_attributes.push(
        // 时间
        {
          field_id: 9269,
          value: this.date,
        },
        // 物资状态
        {
          id: this.option_id,
          field_id: 9262,
          option_id: 7395,
        },
        // 附件
        {
          field_id: 9267,
          value: "附件",
          value_id: this.value_id,
        }
      );
      api.putFormsAmendAPI(this.fromId, this.dataID, payload).then((res) => {
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
    }

    .mian_button {
      position: absolute;
      bottom: 5px;
      width: 14rem;
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
