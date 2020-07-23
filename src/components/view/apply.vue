<template>
  <div class="apply">
    <claim-header :title="title"></claim-header>
    <div class="main">
      <van-tabs v-model="active">
        <van-tab title="未被申领">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in claimedList">
            <img :src="item.img" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}的心愿：
              <span>{{item.mapped_values.wishdesc.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="claiming">待认领</span>
            </button>
          </div>
        </van-tab>
        <!-- <van-tab title="已认领">
          <div :key="item.id" @click="claim(item)" class="main_item" v-for="item in claimList">
            <img :src="item.img" alt class="main_img" />
            <p v-if="item.mapped_values.name">
              {{item.mapped_values.name.exported_value[0]}}的心愿：
              <span>{{item.mapped_values.wishdesc.exported_value[0]}}</span>
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
              {{item.mapped_values.name.exported_value[0]}}的心愿：
              <span>{{item.mapped_values.wishdesc.exported_value[0]}}</span>
            </p>
            <p v-if="item.time">{{item.time}}</p>
            <button class="mian_button button">
              <span class="complete">已完成</span>
            </button>
          </div>
        </van-tab>-->
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
        <van-field label="家庭情况：" readonly type="text" v-model="fromData.familydesc" />
        <van-field autosize label="心愿描述：" readonly type="textarea" v-model="fromData.wishdesc" />

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
              <p v-else-if="item.identity_key ==='claimphone'">
                <van-field
                  :label="item.title +'：'"
                  placeholder="请输入"
                  type="text"
                  v-model="item.value"
                />
              </p>
              <p v-else-if="item.identity_key ==='claimcompany'">
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
          <van-field label="认领人电话：" readonly type="text" v-model="fromData.claimphone" />
          <van-field label="认领人单位：" readonly type="text" v-model="fromData.claimcompany" />

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
      show: false,
      fromData: "",
      fromId: 334,
      fields: "",
      orderFieldList: [
        "claimer",
        "claimphone",
        "claimcompany",
        "claimstatus",
        "finishphoto",
        "finishdesc",
        "finishdatetime",
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
        if (element.mapped_values.review_state) {
          if (
            element.mapped_values.review_state.exported_value[0] === "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "未被申领"
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
            element.mapped_values.review_state.exported_value[0] === "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "已申领"
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
            element.mapped_values.review_state.exported_value[0] === "已通过" &&
            element.mapped_values.claim_state.exported_value[0] === "待失效"
          ) {
            element.img = element.mapped_values.supplies_img.exported_value[0].slice(
              element.mapped_values.supplies_img.exported_value[0].indexOf(
                "（"
              ) + 1,
              element.mapped_values.supplies_img.exported_value[0].indexOf("）")
            );
            element.time = element.created_at.slice(0, 10);
            this.claimList.push(element);
          }
        }
      });
    });
    api.getFormsAPI(328).then((res) => {
      this.fields = res.data.fields;
      this.tableData = unit.tableListData(this.fields, this.orderFieldList);
    });
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
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .mian_button {
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
