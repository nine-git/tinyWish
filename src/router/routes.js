export default [
  {
    path: "/tiny_wish",
    name: "home",
    component: () =>
      import(/* webpackChunkName:'home' */ "@/components/view/home")
  },
  {
<<<<<<< HEAD
    path: '/wish',
    name: 'wish',
    component: () => import(/* webpackChunkName:'wish' */'@/components/view/wish'),
    meta: ['audit', 'boss']
=======
    path: "/tiny_wish/wish",
    name: "wish",
    component: () =>
      import(/* webpackChunkName:'wish' */ "@/components/view/wish")
>>>>>>> master
  },
  {
    path: "/tiny_wish/claim",
    name: "claim",
    component: () =>
      import(/* webpackChunkName:'claim' */ "@/components/view/claim")
  },
  {
<<<<<<< HEAD
    path: '/claim',
    name: 'claim',
    component: () => import(/* webpackChunkName:'claim' */'@/components/view/claim'),
    meta: ['pepole', 'audit', 'boss']
  },
  {
    path: '/donation',
    name: 'donation',
<<<<<<< HEAD
    component: () => import(/* webpackChunkName:'donation' */'@/components/view/donation'),
    meta: ['audit', 'boss']
=======
    component: () => import(/* webpackChunkName:'donation' */'@/components/view/donation')
  },
  {
    path: '/streetDonation',
    name: 'streetDonation',
    component: () => import(/* webpackChunkName:'wish' */'@/components/view/streetDonation')
>>>>>>> b2ee20a0e763d7b7682e94dba69990a2201476cf
=======
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
>>>>>>> master
  }
];
