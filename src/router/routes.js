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
    path: '/donation',
    name: 'donation',
    component: () => import(/* webpackChunkName:'donation' */'@/components/view/donation')
  }

]
