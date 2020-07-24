<template>
    <div class="streetWish">
      <claim-header :title="title"></claim-header>

    </div>
</template>

<script>
  import api from '@/api/api'
  import claimHeader from '../component/header'
  export default {
    name: "streetWish",
    components:{
      claimHeader
    },
    data(){
      return{
        title:'街道办心愿审核'
      }
    }
    }
</script>

<style scoped>

</style>
