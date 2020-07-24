export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName:'home' */'@/components/view/home')
  },
  {
    path: '/wish',
    name: 'wish',
    component: () => import(/* webpackChunkName:'wish' */'@/components/view/wish'),
    meta: ['audit', 'boss']
  },
  {
    path: '/streetWish',
    name: 'streetWish',
    component: () => import(/* webpackChunkName:'wish' */'@/components/view/streetWish')
  },
  {
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
  }

]
