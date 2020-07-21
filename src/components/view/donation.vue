<template>
  <div class="donation">
    <claim-header :title="title"></claim-header>
    <div class="main">
      <div :key="item.id" @click="donationStatus(item)" class="main_item" v-for="item in list">
        <img :src="item.supplies_img" alt class="main_img" />
        <p>
          物资名称：
          <span>{{item.supplies_name}}</span>
        </p>
        <p>
          到期时间：
          <span>{{item.supplies_time}}</span>
        </p>
        <p>
          物资认领状态：
          <span>{{item.review_state}}</span>
        </p>
      </div>
    </div>
<!--    <div id="wishShow">-->
<!--      <div v-for="(item,i) in formData" class="wishContainer" @click="showPopup(i)">-->
<!--        <div class="wishImg">-->
<!--          <img :src=item.img_url alt="">-->
<!--        </div>-->
<!--        <div class="wishContent">-->
<!--          <P>{{item.pepole.name}}的心愿：{{item.pepole.wishdesc}}</P>-->
<!--          <p>{{item.creatTime}}</p>-->
<!--        </div>-->
<!--        <div v-if="item.audit.status==='待审核'" class="auditStatusFather">-->
<!--          <div class="info auditStatus">{{item.audit.status}}</div>-->
<!--        </div>-->
<!--        <div v-else-if="item.audit.status==='已通过'" class="auditStatusFather">-->
<!--          <div class="primary auditStatus">{{item.audit.status}}</div>-->
<!--        </div>-->
<!--        <div v-else-if="item.audit.status==='已退回'" class="auditStatusFather">-->
<!--          <div class="danger auditStatus">{{item.audit.status}}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <van-popup v-model="show"-->
<!--                 closeable-->
<!--                 close-icon="close"-->
<!--                 :style="{ width:'80%' ,height:'80%'}"-->
<!--                 class="myOverlay"-->
<!--                 v-if="formData[this.num]">-->
<!--        <p class="titleOverlay">心愿详情</p>-->
<!--        <div class="imgOverlay"><img :src=formData[this.num].img_url alt=""></div>-->
<!--        <div class="contentOverlay">-->
<!--          <van-field label="姓名：" readonly type="text" v-model="formData[this.num].pepole.name" />-->
<!--          <van-field label="联系电话：" readonly type="text" v-model="formData[this.num].pepole.tel" />-->
<!--          <van-field label="身份证号码：" readonly type="text" v-model="formData[this.num].pepole.idCard" />-->
<!--          <van-field label="所属社区：" readonly type="text" v-model="formData[this.num].pepole.community" />-->
<!--          <van-field label="心愿描述：" readonly type="text" v-model="formData[this.num].pepole.wishdesc" />-->
<!--          <van-field label="家庭住址：" readonly type="text" v-model="formData[this.num].pepole.familyAddr" />-->
<!--          <van-field label="家庭情况：" readonly type="text" v-model="formData[this.num].pepole.familyDesc" />-->
<!--          <van-field v-if="formData[num].audit.status==='待审核'" autosize label="回退理由："  type="textarea" v-model="myTextArea" />-->
<!--          <p class="textNum" v-if="myTextArea.length<=200&&formData[num].audit.status==='待审核'">{{myTextArea.length||0}}/200</p>-->
<!--          <p class="textNum" v-else-if="myTextArea.length>200&&formData[num].audit.status==='待审核'"><span :style="{ color:'red' }">{{myTextArea.length||0}}</span>/200</p>-->

<!--          <div class="claimBtn" v-if="formData[num].audit.status==='待审核'">-->
<!--            <div class="primary" @click="pass">通过</div>-->
<!--            <div class="danger" @click="nopass">退回</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </van-popup>-->
<!--    </div>-->
  </div>
</template>

<script>
import api from '@/api/api.js'
import unit from '@/api/unit.js'
import claimHeader from '../component/header'
export default {
  name: 'donation',
  components:{
    claimHeader
  },
  data () {
    return {
      list: '',
      title:'捐赠审核'
    }
  },
  mounted () {
    api.getFormsAPI(334).then(res => {
      console.log(res)
    })

    api.getFormsResponsesAPI(334).then(res => {
      console.log(res)
      this.list = unit.listData(res.data)
      console.log(this.list)
    })
  },
  methods: {
    donationStatus (item) {
      console.log(item)
    }
  }

}
</script>

<style lang="scss" scoped>
.main {
  margin-top: 1rem;
  display: flex;
  justify-content: space-around;

  .main_item {
    .main_img {
      width: 9rem;
      height: 9rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.4rem;
      line-height: 2rem;

      span {
        font-weight: 600;
      }
    }
  }
}
</style>
