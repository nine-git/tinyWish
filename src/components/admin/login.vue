<template>
  <div>
    <p>登录中...</p>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      client_id:
        "c2067b9e5cf2c7b4f2006d84761409ddec8dcbad329f2a139de207595db3f193",
      code: "http://localhost:8080/tiny_wish/code",
    };
  },
  mounted() {
    let clientId = this.client_id;
    if (clientId) {
      window.location.href = `https://gxzh.cdht.gov.cn/oauth/authorize?client_id=${clientId}&redirect_uri=${this.code}&response_type=code`;
    }
  },
};
</script>
<style lang="scss" scoped>
p {
  margin: 20px;
}
</style>
