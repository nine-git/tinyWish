<template>
  <div class="donation">
    <header class="header">
      <span class="header_span">物资审核</span>
      <img alt class="herder_img" src="@/assets/img/image_社区投票.png" />
    </header>

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
  </div>
</template>

<script>
import api from '@/api/api.js'
import unit from '@/api/unit.js'
export default {
  data () {
    return {
      list: ''
    }
  },
  mounted () {
    api.getFormsAPI(334).then(res => {
      console.log(res)
    })

    api.getFormsResponsesAPI(334).then(res => {
      console.log(res)
      this.list = unit.listData(res.data)
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
.header {
  .herder_img {
    width: 100%;
  }
  .header_span {
    position: absolute;
    top: 10.6667vw;
    left: 2rem;
    color: #fff;
    font-weight: 600;
    font-size: 2rem;
  }
}
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
