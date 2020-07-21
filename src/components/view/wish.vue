<template>
  <div>
<!--    <div class="header">-->
<!--      <div>-->
<!--        <img src="@/assets/img/logo1.png" alt="">-->
<!--        <img src="@/assets/img/logo2.png" alt="">-->
<!--      </div>-->
<!--      <p>微心愿征集墙</p>-->
<!--    </div>-->
    <claim-header :title="title"></claim-header>
    <div id="wishShow">
      <div v-for="(item,i) in formData" class="wishContainer" @click="showPopup(i)">
        <div class="wishImg">
          <img :src=item.img_url alt="">
        </div>
        <div class="wishContent">
          <P>{{item.pepole.name}}的心愿：{{item.pepole.wishdesc}}</P>
          <p>{{item.creatTime}}</p>
        </div>
        <div v-if="item.audit.status==='待审核'" class="auditStatusFather">
          <div class="info auditStatus">{{item.audit.status}}</div>
        </div>
        <div v-else-if="item.audit.status==='已通过'" class="auditStatusFather">
          <div class="primary auditStatus">{{item.audit.status}}</div>
        </div>
        <div v-else-if="item.audit.status==='已退回'" class="auditStatusFather">
          <div class="danger auditStatus">{{item.audit.status}}</div>
        </div>
      </div>
      <van-popup v-model="show"
                 closeable
                 close-icon="close"
                 :style="{ width:'80%' ,height:'80%'}"
                 class="myOverlay"
                 v-if="formData[this.num]">
        <p class="titleOverlay">心愿详情</p>
        <div class="imgOverlay"><img :src=formData[this.num].img_url alt=""></div>
        <div class="contentOverlay">
          <van-field label="姓名：" readonly type="text" v-model="formData[this.num].pepole.name" />
          <van-field label="联系电话：" readonly type="text" v-model="formData[this.num].pepole.tel" />
          <van-field label="身份证号码：" readonly type="text" v-model="formData[this.num].pepole.idCard" />
          <van-field label="所属社区：" readonly type="text" v-model="formData[this.num].pepole.community" />
          <van-field label="心愿描述：" readonly type="text" v-model="formData[this.num].pepole.wishdesc" />
          <van-field label="家庭住址：" readonly type="text" v-model="formData[this.num].pepole.familyAddr" />
          <van-field label="家庭情况：" readonly type="text" v-model="formData[this.num].pepole.familyDesc" />
          <van-field v-if="formData[num].audit.status==='待审核'" autosize label="回退理由："  type="textarea" v-model="myTextArea" />
          <p class="textNum" v-if="myTextArea.length<=200&&formData[num].audit.status==='待审核'">{{myTextArea.length||0}}/200</p>
          <p class="textNum" v-else-if="myTextArea.length>200&&formData[num].audit.status==='待审核'"><span :style="{ color:'red' }">{{myTextArea.length||0}}</span>/200</p>

          <div class="claimBtn" v-if="formData[num].audit.status==='待审核'">
            <div class="primary" @click="pass">通过</div>
            <div class="danger" @click="nopass">退回</div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import unit from "@/api/unit";
import claimHeader from '../component/header'
export default {
  name: 'wish',
  components:{
    claimHeader
  },
  data () {
    return {
      title: '心愿审核',
      myTextArea:'',//文本域的内容
      num:0,//点击的第几条内容
      show: false,//弹出框展示
      formId: '328',//表单号
      formSumData:[],//所有的数据
      formData: [],//重构对象的容器
      formNameData: [],//表单属性(表头的数据)
      //默认图片路径
      defaultwishphoto : "http://fs-material.yqfw.cdyoue.com/25925-1594178327-226796841ca9c183c658635e82ec112c-1594178328596"
    }
  },
  watch:{
    myTextArea(){

    }
  },
  methods: {
    //获取当前时间
    getNewTime(){
      let newTime = new Date()
      let year = newTime.getFullYear();
      let month = newTime.getMonth()+1>9 ? newTime.getMonth()+1 : '0'+(newTime.getMonth()+1);
      let day = newTime.getDate();
      let hours = newTime.getHours();
      let minutes = newTime.getMinutes();
      return year +'-'+ month +'-'+ day +' '+ hours + ':' + minutes
    },
    //通过的函数
    pass(){
      this.myTextArea=''
      let str=''//请求数据
      //请求所需要的字段
      let obj={}
      let resStatus=false
      console.log(this.getNewTime())
      this.formNameData.forEach((item)=>{
        if (item.identity_key==='auditdatetime'){
          obj.timeFileId=item.id
        }
        if (item.identity_key==='auditstatus'){
          obj.auditStatusId=item.id
          item.options.forEach(item=>{
            if (item.value==='已通过'){
              obj.auditStatusOptionId=item.id
            }
          })
        }
        if (item.identity_key==='claimstatus'){
          obj.handStatusId=item.id
          item.options.forEach(item=>{
            if (item.value==='待认领'){
              obj.handStatusOptionId=item.id
            }
          })
        }
      })
      this.formSumData=this.formSumData.filter(item=>item.id===this.formData[this.num].id)
      this.formSumData[0].entries.forEach(item=>{
        if (item.field_id===obj.timeFileId){
          resStatus=true
        }
      })
      if(!resStatus){
        str = {"response": {
            "entries_attributes": [
              {
                "id": this.formData[this.num].audit.id,
                "option_id": obj.auditStatusOptionId  //审核状态的option_id
              },
              {
                "field_id": obj.timeFileId,  //审核通过时间字段
                "value": this.getNewTime()  //审核时间
              },
              {
                "field_id": obj.handStatusId,  //认领状态filed_id
                "option_id": obj.handStatusOptionId  //认领状态option_id
              }
            ]
          }
        };
      } else {
        str = {"response": {
            "entries_attributes": [
              {
                "field_id": obj.auditStatusId,  //审核状态字段
                "option_id": obj.auditStatusOptionId  //审核状态的option_id
              },
              {
                "field_id": obj.timeFileId,  //审核时间通过字段
                "value": this.getNewTime()  //审核时间
              },
              {
                "field_id": obj.handStatusId,  //认领状态filed_id
                "option_id": obj.handStatusOptionId  //认领状态option_id
              }
            ]
          }
        };
      }
      api.putFormsAmendAPI(this.formId,this.formData[this.num].id,str).then(res=>{
        console.log(res)
        this.show=false
        this.formSumData=res.data
        res.data.entries.forEach(item=>{
          if (item.id===this.formData[this.num].audit.id){
            this.formData[this.num].audit.option_id=item.option_id
            this.formData[this.num].audit.status=item.value
          }
        })

      })
    },
    //回退的函数
    nopass(){
      let str=''//请求数据
      //请求所需要的字段
      let obj={}
      let resStatus=false
      if (this.myTextArea){
        //  有退回原因
        this.formNameData.forEach((item)=>{
          if (item.identity_key==='auditdatetime'){
            obj.timeFileId=item.id
          }
          if (item.identity_key==='auditstatus'){
            obj.auditStatusId=item.id
            item.options.forEach(item=>{
              if (item.value==='已退回'){
                obj.auditStatusOptionId=item.id
              }
            })
          }
          if (item.identity_key==='rejectdesc'){
            obj.rejectDescId=item.id
          }
        })
        this.formSumData=this.formSumData.filter(item=>item.id===this.formData[this.num].id)
        this.formSumData[0].entries.forEach(item=>{
          if (item.field_id===obj.timeFileId){
            resStatus=true
          }
        })
        if(!resStatus){
          str = {"response": {
              "entries_attributes": [
                {
                  "id": this.formData[this.num].audit.id,
                  "option_id": obj.auditStatusOptionId  //审核状态的option_id
                },
                {
                  "field_id": obj.timeFileId,  //审核通过时间字段
                  "value": this.getNewTime()  //审核时间
                },
                {
                  "field_id": obj.rejectDescId,  //退回原因字段
                  "value": this.myTextArea  //退回原因
                }
              ]
            }
          };
        } else {
          str = {"response": {
              "entries_attributes": [
                {
                  "field_id": obj.auditStatusId,  //审核状态字段
                  "option_id": obj.auditStatusOptionId  //审核状态的option_id
                },
                {
                  "field_id": obj.timeFileId,  //审核时间通过字段
                  "value": this.getNewTime()  //审核时间
                },
                {
                  "field_id": obj.rejectDescId,  //退回原因字段
                  "value": this.myTextArea  //退回原因
                }
              ]
            }
          };
        }
        api.putFormsAmendAPI(this.formId,this.formData[this.num].id,str).then(res=>{
          console.log(res)
          this.show=false
          this.formSumData=res.data
          res.data.entries.forEach(item=>{
            if (item.id===this.formData[this.num].audit.id){
              this.formData[this.num].audit.option_id=item.option_id
              this.formData[this.num].audit.status=item.value
            }
          })

        })
      }else{
        //  没有退回原因
        this.$toast.fail('没有退回原因，失败')
      }
    },
    showPopup(num) {
      this.show = true;
      this.num=num
    },
    creatForm () {
      console.log(this.formData)
    },
    //  重构时间（时间格式，时间）
    dateFormat(fmt, date) {
      var date = new Date(date);
      var ret;
      const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (var k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
      };
      return fmt;
    }
  },
  beforeCreate () {
    //  获取心愿审核的数据
    api.getFormsResponsesAPI('328').then((res) => {
      console.log(res)
      this.formSumData=res.data
      res.data.forEach((item,i)=> {
        let objData = {
          id: '',
          audit: {status: '', option_id: ''},
          pepole: {name: '', field_id: ''},
          creatTime: '',
          img_url: '',
        }
        //  对象的状态和option_id
        if (item.mapped_values.auditstatus){
          objData.audit.status = item.mapped_values.auditstatus.value[0].value
          objData.audit.option_id = item.mapped_values.auditstatus.value[0].id
        }else{
          objData.audit.status = '待审核'
          objData.audit.option_id = ''
        }
        //  对象创建的时间
        objData.creatTime = this.dateFormat("YYYY-mm-dd HH:MM", item.created_at)
        //  对象的id
        objData.id = item.id
        //对象的心愿描述内容
        objData.pepole.wishdesc = item.mapped_values.wishdesc.value[0]
        objData.pepole.community = item.mapped_values.community.value[0].value
        objData.pepole.familyAddr = item.mapped_values.familyaddr.value[0]
        objData.pepole.familyDesc = item.mapped_values.familydesc.value[0]
        objData.pepole.tel = item.mapped_values.tel.value[0]
        objData.pepole.idCard = item.mapped_values.idcard.value[0]
        for (let y = 0; y < item.entries.length; y++) {
          //  对象的图片路径
          if (item.entries[y].attachment) {
            let str = item.entries[y].attachment.download_url
            let url = str.slice(0, str.indexOf('?'))
            objData.img_url = url
          }
          //  对象的名字和field_id
          if (item.mapped_values.name.value[0] === item.entries[y].value) {
            objData.pepole.name = item.entries[y].value || ''
            objData.pepole.field_id = item.entries[y].field_id
          }
          //  对象的名字和field_id
          if (objData.audit.status === item.entries[y].value){
            objData.audit.id = item.entries[y].id
          }
        }
        if (!objData.img_url){
          objData.img_url=this.defaultwishphoto
        }
        this.formData.push(objData)
      })
      console.log(this.formData)
      let a=this.formData.sort(function(a,b){
        // order是规则  objs是需要排序的数组
        var order = ["待审核", "已通过", "已退回"];
        return order.indexOf(a.audit.status) - order.indexOf(b.audit.status);
      });
    })
    api.getFormsAPI('328').then((res) => {
      console.log(res)
      this.formNameData = res.data.fields
    })
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
  #wishShow{
    font-size: 14px;
    width: 100%;
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    .wishContainer{
      width: 50%;
      padding: 1rem 0 1rem;
      .wishImg{
        width: 140px;
        height: 120px;
        margin: 0 auto;
        img{
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
      .wishContent{
        padding: 5px 18px;
        p:first-child{
          height: 42px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
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
    .myOverlay{
      border-radius: 20px;
      padding: 20px 10px;
      .titleOverlay{
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        line-height: 40px;
      }
      .imgOverlay{
        width: 140px;
        height: 120px;
        margin: 0 auto;
        img{
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
      .contentOverlay{
        p{
          margin-bottom: 5px;
        }
        .textNum{
          text-align: right;
          margin-right: 20px;
        }
        .claimBtn{
          display: flex;
          justify-content: space-around;
          div{
            width: 30%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: white;
          }
        }
      }
    }
/deep/ textarea, .van-field__control{
  border: 1px solid rgba(165, 155, 155, 0.5);
}
  }
</style>
