<template>
  <div class="claim">
    <claim-header :title="title"></claim-header>

  </div>
</template>

<script>
import claimHeader from '../component/header'
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
  methods: {

  },
  created () {
  }
}
</script>

<style>
</style>
