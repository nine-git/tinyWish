<template>
  <div class="home">
    <router-link class="wish" to="/tiny_wish/wish">社区个人心愿审核</router-link>
    <router-link class="streetWish" to="/tiny_wish/streetWish">街道办个人心愿审核</router-link>
    <router-link class="claim" to="/tiny_wish/claim">我要认领心愿</router-link>
    <router-link class="streetDonation" to="/tiny_wish/streetDonation">街道办捐赠审核</router-link>
    <router-link class="apply" to="/tiny_wish/apply">我要申领物资</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url("../../assets/img/bg.png");
  background-size: cover;

  a {
    background: #af6aade6;
    margin: 1rem;
    padding: 1rem;
    width: 50vw;
    color: #fff;
    border-radius: 30px;
  }
  .donation {
    margin-top: 70px;
  }
}
</style>
