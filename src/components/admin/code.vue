 <template>
  <div>
    <p class="p" v-show="show">授权成功,请等待页面跳转...</p>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      show: "",
      code: "",
      token: "",
      id: "",
      phone: "",
      name: "",
    };
  },
  mounted() {
    this.code = this.$route.query.code;
    this.path = sessionStorage.getItem("return");

    this.$axios({
      method: "POST",
      url: "/oauth/token",
      headers: { "Content-Type": "application/json" },
      params: {
        client_id:
          "c2067b9e5cf2c7b4f2006d84761409ddec8dcbad329f2a139de207595db3f193",
        client_secret:
          "9a505448b7805fbcd3753a5de6770498d0c11786f91596754bf564fbd93b6695",
        code: this.code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:8080/tiny_wish/code",
        // redirect_uri: "http://47.92.163.233:9090/tiny_wish/code",
      },
    }).then((res) => {
      let token = res.data.access_token;
      api.getUserAPI(token).then((res) => {
        this.show = true;
        localStorage.setItem("user_id", res.data.id);
        localStorage.setItem("user_phone", res.data.phone);
        localStorage.setItem("user_name", res.data.name);

        let tag = res.data.tags;
        let tags = [];
        tag.forEach((element) => {
          tags.push(element.name);
        });
        localStorage.setItem("user_tags", tags);

        this.$router.push({ name: this.path });
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.p {
  margin: 20px;
}
</style>
