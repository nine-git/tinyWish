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
        <p class="popup_title">心愿详情</p>
        <img :src="fromData.img" alt class="popup_img" />
        <van-field label="企业：" readonly type="text" v-model="fromData.company" />
        <van-field label="联系人：" readonly type="text" v-model="fromData.name" />
        <van-field autosize label="联系电话：" readonly v-model="fromData.phone" />
        <van-field label="物资名称：" readonly type="text" v-model="fromData.supplies_name" />

        <div v-if="!fromData.claim_state">
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
        <div v-else>
          <van-field label="认领人姓名：" readonly type="text" v-model="fromData.claimer" />
          <van-field label="认领人电话：" readonly type="text" v-model="fromData.claim_phone" />
          <van-field label="认领人单位：" readonly type="text" v-model="fromData.claim_time" />

          <!-- 交接模块 -->
          <div v-if="!fromData.finishdesc">
            <div :key="item.identity_key" v-for="item in tableData">
              <div v-if="item.identity_key ==='finishphoto'">
                <p class="finishphoto">上传交接图片：</p>
                <van-uploader :after-read="afterRead" />
              </div>
              <p v-if="item.identity_key ==='finishdesc'">
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
            <img :src="fromData.finishphoto" alt class="popup_img" />

            <van-field label="交接描述：" readonly type="text" v-model="fromData.finishdesc" />
            <van-field label="交接时间：" readonly type="text" v-model="fromData.finishdatetime" />
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
        console.log(res);
        // 返回物资的的状态
        if (element.mapped_values.review_street_state) {
          if (
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "未被认领"
          ) {
            console.log(element);
            element.img = element.mapped_values.supplies_img.exported_value[0].slice(
              element.mapped_values.supplies_img.exported_value[0].indexOf(
                "（"
              ) + 1,
              element.mapped_values.supplies_img.exported_value[0].indexOf("）")
            );
            element.time = element.created_at.slice(0, 10);
            this.claimList.push(element);
          }
          if (
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "已认领"
          ) {
            element.img = element.mapped_values.supplies_img.exported_value[0].slice(
              element.mapped_values.supplies_img.exported_value[0].indexOf(
                "（"
              ) + 1,
              element.mapped_values.supplies_img.exported_value[0].indexOf("）")
            );
            element.time = element.created_at.slice(0, 10);
            this.claimedList.push(element);
          }
          if (
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "已完成"
          ) {
            element.img = element.mapped_values.supplies_img.exported_value[0].slice(
              element.mapped_values.supplies_img.exported_value[0].indexOf(
                "（"
              ) + 1,
              element.mapped_values.supplies_img.exported_value[0].indexOf("）")
            );
            element.time = element.created_at.slice(0, 10);
            this.finishList.push(element);
          }
          if (
            element.mapped_values.review_street_state.exported_value[0] ===
              "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "已失效"
          ) {
            element.img = element.mapped_values.supplies_img.exported_value[0].slice(
              element.mapped_values.supplies_img.exported_value[0].indexOf(
                "（"
              ) + 1,
              element.mapped_values.supplies_img.exported_value[0].indexOf("）")
            );
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
        company: el.mapped_values.company.exported_value[0],
        name: el.mapped_values.name.exported_value[0],
        phone: el.mapped_values.phone.exported_value[0],
        supplies_name: el.mapped_values.supplies_name.exported_value[0],
      };
      if (el.mapped_values.claimer) {
        this.fromData = {
          img: el.img,
          name: el.mapped_values.name.exported_value[0],
          community: el.mapped_values.community.exported_value[0],
          familydesc: el.mapped_values.familydesc.exported_value[0],
          wishdesc: el.mapped_values.wishdesc.exported_value[0],
          claimer: el.mapped_values.claimer.exported_value[0],
          claimphone: el.mapped_values.claimphone.exported_value[0],
          claimcompany: el.mapped_values.claimcompany.exported_value[0],
        };
      }
      if (el.mapped_values.finishphoto) {
        this.fromData = {
          img: el.img,
          name: el.mapped_values.name.exported_value[0],
          community: el.mapped_values.community.exported_value[0],
          familydesc: el.mapped_values.familydesc.exported_value[0],
          wishdesc: el.mapped_values.wishdesc.exported_value[0],
          claimer: el.mapped_values.claimer.exported_value[0],
          claimphone: el.mapped_values.claimphone.exported_value[0],
          claimcompany: el.mapped_values.claimcompany.exported_value[0],
          finishphoto: el.mapped_values.finishphoto.exported_value[0].slice(
            el.mapped_values.finishphoto.exported_value[0].indexOf("（") + 1,
            el.mapped_values.finishphoto.exported_value[0].indexOf("）")
          ),
          finishdesc: el.mapped_values.finishdesc.exported_value[0],
          finishdatetime: el.mapped_values.finishdatetime.exported_value[0],
        };
      }
    },
    send(data) {
      console.log(data);
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
      api.putFormsAmendAPI(this.fromId, this.dataID, payload).then((res) => {
        if (res.status === 200) {
          this.$toast("认领成功 ✨");
          this.$router.go(0);
        } else {
          this.$toast("认领失败 >_<");
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
  .finishphoto {
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
