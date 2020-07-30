import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  let name = to.name;
  let path = sessionStorage.getItem("return");
  if (!path) {
    if (!localStorage.user_phone) {
      sessionStorage.setItem("return", name);
      router.push({ name: "login" });
    }
  }
  next();
});

export default router;
