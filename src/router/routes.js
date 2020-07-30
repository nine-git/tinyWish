export default [
  {
    path: "/tiny_wish",
    name: "home",
    component: () =>
      import(/* webpackChunkName:'home' */ "@/components/view/home")
  },
  {
    path: "/tiny_wish/wish",
    name: "wish",
    component: () =>
      import(/* webpackChunkName:'wish' */ "@/components/view/wish")
  },
  {
    path: "/tiny_wish/claim",
    name: "claim",
    component: () =>
      import(/* webpackChunkName:'claim' */ "@/components/view/claim")
  },
  {
    path: "/tiny_wish/apply",
    name: "apply",
    component: () =>
      import(/* webpackChunkName:'apply' */ "@/components/view/apply")
  },

  {
    path: "/tiny_wish/donation",
    name: "donation",
    component: () =>
      import(/* webpackChunkName:'donation' */ "@/components/view/donation")
  },
  {
    path: "/tiny_wish/streetWish",
    name: "streetWish",
    component: () =>
      import(/* webpackChunkName:'wish' */ "@/components/view/streetWish")
  },
  // 登录
  {
    path: "/tiny_wish/code",
    name: "code",
    component: () =>
      import(/* webpackChunkName:'code' */ "@/components/admin/code")
  },
  {
    path: "/tiny_wish/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName:'login' */ "@/components/admin/login")
  },
  {
    path: "/tiny_wish/streetDonation",
    name: "streetDonation",
    component: () =>
      import(/* webpackChunkName:'wish' */ "@/components/view/streetDonation")
  },
  {
    path: "*",
    component: () =>
      import(/* webpackChunkName:'home' */ "@/components/view/home")
  }
];
