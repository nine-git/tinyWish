<template>
  <div class="donation">
    <claim-header :title="title"></claim-header>
    <div class="main">
      <div :key="item.id" @click="donationStatus(item)" class="main_item" v-for="item in list">
        <div class="main_img">
          <img :src=item.supplies_img alt="" />
        </div>
        <div class="main_content">
          <p>物资名称：{{item.supplies_name}}</p>
          <p>到期时间：{{item.supplies_time}} </p>
        </div>
        <div v-if="item.review_state==='待审核'" class="auditStatusFather">
          <div class="info auditStatus">{{item.review_state}}</div>
        </div>
        <div v-else-if="item.review_state==='已通过'" class="auditStatusFather">
          <div class="primary auditStatus">{{item.review_state}}</div>
        </div>
        <div v-else-if="item.review_state==='已退回'" class="auditStatusFather">
          <div class="danger auditStatus">{{item.review_state}}</div>
        </div>
      </div>
    </div>
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
      this.list = res.data
      // this.list = unit.listData(res.data)
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
  .info{
    background-color: #81b3ff;
  }
  .primary{
    background-color: #1da56c;
  }
  .danger{
    background-color: #d5501f;
  }
.main {
  font-size: 14px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  .main_item {
    width: 50%;
    padding: 1rem 0 1rem;
    .main_img {
      width: 140px;
      height: 120px;
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    .main_content{
      padding: 5px 18px;
      p{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-wrap:break-word;
        word-break:break-all;
      }
    }
    .auditStatusFather{
      width: 80%;
      margin: 0 auto;
      .auditStatus{
        display: inline-block;
        text-align: center;
        border-radius: 5px;
        width: 100%;
        margin: 5px 0;
        height: 30px;
        line-height: 30px;
        color: white;
      }
    }
  }
}
</style>
