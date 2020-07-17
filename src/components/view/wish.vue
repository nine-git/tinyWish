<template>
  <div>
    <div class="header">
      <img src="@/assets/img/image_社区投票.png" alt="">
      <p>心愿审核</p>
    </div>
    <div class="wishShow">
      <div v-for="item in formData">
        {{item.id}}
        <div>
          <img src="" alt="">
        </div>
        <div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import unit from "@/api/unit";
export default {
  name: 'wish',
  data () {
    return {
      formId: '328',
      formName: '',
      formData: [],
      defaultwishphoto : "http://fs-material.yqfw.cdyoue.com/25925-1594178327-226796841ca9c183c658635e82ec112c-1594178328596"

    }
  },
  methods: {
    creatForm () {
      console.log(this.formData)
    }
  },
  beforeCreate () {
    api.getFormsResponsesAPI('328').then((res) => {
      console.log(res)
      res.data.forEach((item,i)=>{
        let objData={
          id:'',
          audit:{status:'',option_id:''},
          pepole:{name:'',field_id:''},
          creatTime:'',
          img_url:'',
        }
        //  对象的状态和option_id
        objData.audit.status=item.mapped_values.auditstatus.value[0].value
        objData.audit.option_id=item.mapped_values.auditstatus.value[0].id
        //  对象创建的时间
        objData.creatTime=item.created_at
        for (let y = 0; y < item.entries.length; y++) {
          //对象的图片路径
          if (item.entries[y].attachment) {
            let str = item.entries[y].attachment.download_url
            let url = str.slice(0, str.indexOf('?'))
            objData.img_url = url
          }else {
            objData.img_url = this.defaultwishphoto
          }
          //  对象的名字和field_id
          if (item.mapped_values.name.value[0]===item.entries[y].value){
            objData.pepole.name=item.entries[y].value
            objData.pepole.field_id=item.entries[y].field_id
          }
          //  对象的id
          objData.id=item.id
        }
        this.formData.push(objData)
      })
      console.log(this.formData)
    })
    api.getFormsAPI('328').then((res) => {
      console.log(res)
      //this.formName = res.data.fields
    })
  }
}
</script>

<style lang="scss" scoped>
  .header{
    width: 100%;
    img{
      width: 100%;
    }
    p{
      font-size: 24px;
      text-align: center;
      line-height: 30px;
      position: absolute;
      top: 40px;
      left: 15%;
      color: white;
    }
  }
</style>
