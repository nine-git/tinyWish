<template>
  <div class="claim">
    <claim-header :title="title"></claim-header>
    <div class="main">
      <div :key="item.id" @click=" claim(item)" class="main_item" v-for="item in list">
        <img :src="item.img" alt class="main_img" />
        <p>
          {{item.mapped_values.name.exported_value[0]}}的心愿：
          <span>{{item.mapped_values.wishdesc.exported_value[0]}}</span>
        </p>
        <p>{{item.mapped_values.auditdatetime.exported_value[0]}}</p>
        <button class="mian_button">
          <span>{{item.mapped_values.claimstatus.exported_value[0]}}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import claimHeader from '../component/header'
import api from '../../api/api'
export default {
  name: 'wish',
  data () {
    return {
      title: '认领心愿',
      list: []
    }
  },
  components: {
    claimHeader
  },
  mounted () {
    document.title = '认领心愿'
    api.getFormsResponsesAPI(328).then(res => {
      console.log(res)
      res = res.data
      res.forEach(element => {
        if (element.mapped_values.auditstatus.exported_value[0] === '已通过') {
          element.img = element.mapped_values.wishphoto.exported_value[0].slice(element.mapped_values.wishphoto.exported_value[0].indexOf('（') + 1, element.mapped_values.wishphoto.exported_value[0].indexOf('）'))
          this.list.push(element)
        }
      })
    })
  },
  methods: {
    claim (el) {
      console.log(el)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .main_item {
    width: 45%;
    position: relative;
    padding: 1rem 0px 40px;

    .main_img {
      width: 14rem;
      height: 14rem;
      border-radius: 1rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.4rem;
      line-height: 2rem;
      margin: 5px 0px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .mian_button {
      position: absolute;
      background: #81b3ff;
      color: #fff;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      border: none;
      display: block;
      width: 80%;
      margin: 0.5rem auto;
      padding: 3px;
      border-radius: 20px;
    }
  }
}
</style>
