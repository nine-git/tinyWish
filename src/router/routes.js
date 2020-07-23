export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName:'home' */'@/components/view/home')
  },
  {
    path: '/wish',
    name: 'wish',
    component: () => import(/* webpackChunkName:'wish' */'@/components/view/wish')
  },
  {
    path: '/streetWish',
    name: 'streetWish',
    component: () => import(/* webpackChunkName:'wish' */'@/components/view/streetWish')
  },
  {
    path: '/claim',
    name: 'claim',
    component: () => import(/* webpackChunkName:'claim' */'@/components/view/claim')
  },
  {
    path: '/donation',
    name: 'donation',
    component: () => import(/* webpackChunkName:'donation' */'@/components/view/donation')
  },
  {
    path: '/streetDonation',
    name: 'streetDonation',
    component: () => import(/* webpackChunkName:'wish' */'@/components/view/streetDonation')
  }

]
