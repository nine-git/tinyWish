<template>
  <div>
    <div class="header">
      <div>
        <img src="@/assets/img/logo1.png" alt="">
        <img src="@/assets/img/logo2.png" alt="">
      </div>
      <p>微心愿征集墙</p>
    </div>
    <div id="wishShow">
      <div v-for="(item,i) in formData" class="wishContainer">
        <div class="wishImg">
          <img :src=item.img_url alt="">
        </div>
        <div class="wishContent">
          <P>{{item.pepole.name}}的心愿：{{item.pepole.wishdesc}}</P>
          <p>{{item.creatTime}}</p>
        </div>
        <div v-if="item.audit.status==='待审核'">
          <div @click="showPopup(i)" class="info auditStatus">{{item.audit.status}}</div>
        </div>
        <div v-else-if="item.audit.status==='已通过'">
          <div @click="showPopup(i)" class="primary auditStatus">{{item.audit.status}}</div>
        </div>
        <div v-else-if="item.audit.status==='已退回'">
          <div @click="showPopup(i)" class="danger auditStatus">{{item.audit.status}}</div>
        </div>
      </div>
      <van-popup v-model="show"
                 closeable
                 close-icon="close"
                 :style="{ width:'75%' }"
                 class="myOverlay"
                 v-if="formData[this.num]">
        <p class="titleOverlay">心愿详情</p>
        <div class="imgOverlay"><img :src=formData[this.num].img_url alt=""></div>
        <div class="contentOverlay">
          <p><span>姓名：</span><span>{{formData[this.num].pepole.name}}</span></p>
          <p><span>联系电话：</span><span>{{formData[this.num].pepole.tel}}</span></p>
          <p><span>身份证号码：</span><span>{{formData[this.num].pepole.idCard}}</span></p>
          <p><span>所属社区：</span><span>{{formData[this.num].pepole.community}}</span></p>
          <p><span>心愿描述：</span><span>{{formData[this.num].pepole.wishdesc}}</span></p>
          <p><span>家庭住址：</span><span>{{formData[this.num].pepole.familyAddr}}</span></p>
          <p><span>家庭基本情况描述：</span><span>{{formData[this.num].pepole.familyDesc}}</span></p>
          <p v-if="formData[num].audit.status==='待审核'">
            <span>回退理由：</span>
            <textarea name="" id="" cols="30" rows="5" v-model="myTextArea"></textarea>
          </p>
          <p class="textNum" v-if="myTextArea.length<=200&&formData[num].audit.status==='待审核'">{{myTextArea.length||0}}/200</p>
          <p class="textNum" v-else-if="myTextArea.length>200&&formData[num].audit.status==='待审核'"><span :style="{ color:'red' }">{{myTextArea.length||0}}</span>/200</p>
          <div class="claimBtn">
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
export default {
  name: 'wish',
  components:{

  },
  data () {
    return {
      myTextArea:'',//文本域的内容
      num:0,//点击的第几条内容
      show: false,//弹出框展示
      formId: '328',//表单号
      formData: [],//重构对象的容器
      //默认图片路径
      defaultwishphoto : "http://fs-material.yqfw.cdyoue.com/25925-1594178327-226796841ca9c183c658635e82ec112c-1594178328596"
    }
  },
  watch:{
    myTextArea(){

    }
  },
  methods: {
    pass(){

    },
    nopass(){

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
        objData.creatTime=this.dateFormat("YYYY-mm-dd HH:MM", item.created_at)
        //  对象的id
        objData.id=item.id
        //对象的心愿描述内容
        objData.pepole.wishdesc=item.mapped_values.wishdesc.value[0]
        objData.pepole.community=item.mapped_values.community.value[0].value
        objData.pepole.familyAddr=item.mapped_values.familyaddr.value[0]
        objData.pepole.familyDesc=item.mapped_values.familydesc.value[0]
        objData.pepole.tel=item.mapped_values.tel.value[0]
        objData.pepole.idCard=item.mapped_values.idcard.value[0]
        for (let y = 0; y < item.entries.length; y++) {
          //  对象的图片路径
          if (item.entries[y].attachment) {
            let str = item.entries[y].attachment.download_url
            let url = str.slice(0, str.indexOf('?'))
            objData.img_url = url
          }
          //  对象的名字和field_id
          if (item.mapped_values.name.value[0]===item.entries[y].value){
            objData.pepole.name=item.entries[y].value
            objData.pepole.field_id=item.entries[y].field_id
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
      //this.formName = res.data.fields
    })
  }
}
</script>

<style lang="scss" scoped>
  .info{
    background-color: deepskyblue;
  }
  .primary{
    background-color: green;
  }
  .danger{
    background-color: red;
  }
  .header{
    width: 100%;
    height: 100px;
    background-image: url("../../assets/img/timg.jpg");
    text-align: left;
    img:first-child{
      margin-left: 40px;
      margin-top: 10px;
    }
    img{
      height: 50px;
    }
    p{
      color: wheat;
      margin-left: 50px;
      font-size: 20px;
    }
  }
  #wishShow{
    width: 100%;
    text-align: left;
    .wishContainer{
      width: 45%;
      float: left;
      margin-left: 3%;
      margin-top: 25px;
      .wishImg{
        width: 100%;
        height: 100px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
      .wishContent{
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
        p{
          margin-top: 10px;
        }
      }
      .auditStatus{
        display: inline-block;
        text-align: center;
        border-radius: 20px;
        width: 100%;
        margin: 10px 0;
        height: 30px;
        line-height: 30px;
        color: white;
      }
    }
    .myOverlay{
      .titleOverlay{
        font-size: 20px;
        text-align: center;
        line-height: 40px;
      }
      .imgOverlay{
        width: 100%;
        img{
          width: 75%;
          height: 100px;
          margin-left: 12%;
        }
      }
      .contentOverlay{
        padding: 20px 0 10px 20px;
        p{
          margin-bottom: 5px;
        }
        .textNum{
          text-align: right;
          margin-right: 10px;
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

  }
</style>
