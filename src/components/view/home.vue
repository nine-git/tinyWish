<template>
  <div class="home">
    <router-link class="wish" to="wish">个人心愿</router-link>
    <router-link class="donation" to="donation">捐赠审核</router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }

}
</script>

<style lang="scss" scoped>
.home {
  margin: 0px auto;
  padding: 5rem;

  .wish {
    width: 5rem;
    height: 5rem;
    display: block;
    color: black;
    font-size: 1rem;
  }
  .donation {
    width: 5rem;
    height: 5rem;
    display: block;
    color: black;
    font-size: 1rem;
  }
}
</style>
