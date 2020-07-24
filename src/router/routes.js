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
    path: '/claim',
    name: 'claim',
    component: () => import(/* webpackChunkName:'claim' */'@/components/view/claim'),
    meta: ['pepole', 'audit', 'boss']
  },
  {
    path: '/donation',
    name: 'donation',
    component: () => import(/* webpackChunkName:'donation' */'@/components/view/donation'),
    meta: ['audit', 'boss']
  }

]
