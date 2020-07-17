<template>
  <div>
    <header class="header">
      <span class="header_span">{{title}}</span>
      <img alt class="herder_img" src="@/assets/img/image_社区投票.png" />
    </header>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {

    }
  }

}
</script>

<style lang="scss" scoped>
.header {
  .herder_img {
    width: 100%;
  }
  .header_span {
    position: absolute;
    top: 4rem;
    left: 2rem;
    color: #fff;
    font-weight: 600;
    font-size: 2rem;
  }
}
</style>
