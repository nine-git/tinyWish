<template>
  <div class="claim">
    <claim-header :title="title"></claim-header>
  </div>
</template>

<script>
import claimHeader from '../component/header'
import api from '../../api/api'
export default {
  name: 'wish',
  data () {
    return {
      title: '我要认领心愿'

    }
  },
  components: {
    claimHeader
  },
  mounted () {
    api.getFormsResponsesAPI(328).then(res => {
      console.log(res)
    })
  },
  methods: {
  }
}
</script>

<style>
</style>
