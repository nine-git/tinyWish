<template>
  <div class="donation">
    <header class="header">
      <img alt class="herder_img" src="@/assets/img/image_社区投票.png" />
    </header>

    <div class="main">
      <div :key="item.id" class="main_item" v-for="item in list">
        <img :src="item.supplies_img" alt class="main_img" />
        <p>物资名称：{{item.supplies_name}}</p>
        <p>到期时间：{{item.supplies_time}}</p>
        <p>物资认领状态：{{item.review_state}}</p>
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
    api.getFormsAPI().then(res => {
      console.log(res)
    })

    api.getFormsResponsesAPI().then(res => {
      // console.log(res)
      this.list = unit.listData(res.data)
    })
  },
  methoud: {
    aa (str) {
      console.log(str)
    }
  }

}
</script>

<style lang="scss" scoped>
.header {
  .herder_img {
    width: 100%;
  }
}
.main {
  .main_item {
    .main_img {
      width: 9.375rem;
      height: 9.375rem;
    }
  }
}
</style>
