<template>
    <div class="streetDonation">
      <claim-header :title="title"></claim-header>
    </div>
</template>

<script>
  import api from '@/api/api'
  import claimHeader from '../component/header'
  export default {
    name: "streetDonation",
    components:{
      claimHeader
    },
    data(){
      return{
        title:'街道办捐赠审核'
      }
    }
    }
</script>

<style scoped>

</style>
