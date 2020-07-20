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
        <button class="mian_button button">
          <span>{{item.mapped_values.claimstatus.exported_value[0]}}</span>
        </button>
      </div>
    </div>
    <van-popup :style="{ height: '80%',width:'80%' }" closeable round v-model="show">
      <div class="popup">
        <img :src="fromData.img" alt class="popup_img" />
        <van-field label="发起人：" readonly type="text" v-model="fromData.name" />
        <van-field label="所属社区：" readonly type="text" v-model="fromData.community" />
        <van-field label="家庭情况：" readonly type="text" v-model="fromData.familydesc" />
        <van-field autosize label="心愿描述：" readonly type="textarea" v-model="fromData.wishdesc" />

        <div :key="item.id" v-for="item in tableData">
          <van-field :label="item.title +'：'" placeholder="请输入" type="text" v-model="item.value" />
        </div>
        <button @click="send(tableData)" class="popup_button button">确认认领</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import claimHeader from '../component/header'
import api from '../../api/api'
import unit from '@/api/unit'

export default {
  name: 'wish',
  data () {
    return {
      title: '认领心愿',
      list: [],
      show: false,
      fromData: '',
      fields: '',
      orderFieldList: ['claimer', 'claimphone', 'claimcompany'],
      tableData: [],
      date: '',
      dataID: ''
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
    api.getFormsAPI(328).then(res => {
      console.log(res)

      this.fields = res.data.fields
      this.tableData = unit.tableListData(this.fields, this.orderFieldList)
    })
  },
  methods: {
    claim (el) {
      this.show = true
      this.dataID = el.id
      this.fromData = {
        img: el.img,
        name: el.mapped_values.name.exported_value[0],
        community: el.mapped_values.community.exported_value[0],
        familydesc: el.mapped_values.familydesc.exported_value[0],
        wishdesc: el.mapped_values.wishdesc.exported_value[0]
      }
    },

    send (data) {
      // 获取时间
      this.date = unit.formatDateTime()

      let payload = {
        response: { entries_attributes: [] }
      }

      data.forEach(element => {
        if (element.value !== '' && element) {
          payload.response.entries_attributes.push({
            field_id: element.field_id,
            value: element.value })
        }
      })
      // 自动填值
      payload.response.entries_attributes.push(
        {
          id: 9190,
          option_id: 7361 },
        {
          field_id: 9270,
          value: this.date
        })
      console.log(payload)
      api.putFormsAmendAPI(328, this.dataID, payload).then(res => {
        if (res.status === 201) {
          this.$toast('认领成功 ✨')
        } else {
          this.$toast('认领失败 >_<')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin: 1rem auto;
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
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0.5rem auto;
    }
  }
}
.popup {
  padding: 20px 10px;

  .popup_img {
    width: 14rem;
    height: 14rem;
    border-radius: 1rem;
  }
  .popup_button {
    margin: 2rem auto;
  }
}
.button {
  background: #81b3ff;
  color: #fff;
  border: none;
  display: block;
  width: 80%;
  padding: 3px;
  border-radius: 20px;
}
</style>
