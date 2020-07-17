<template>
  <div class="home">
    <router-link class="wish" to="wish">个人心愿</router-link>
    <router-link class="donation" to="donation">捐赠发布</router-link>
    <router-link class="claim" to="claim">我要认领心愿</router-link>
    <router-link class="apply" to="apply">我要申领物资</router-link>
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url('../../assets/img/bg.png');
  background-size: cover;

  a {
    background: #af6aade6;
    margin: 1rem;
    padding: 1rem;
    width: 50vw;
    color: #fff;
    border-radius: 30px;
  }
}
</style>
