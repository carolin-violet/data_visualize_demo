import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '@/views/ScreenPage'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: ScreenPage
  },
/*   {
    path: '/sellerPage',
    component: () =>
        import ('@/views/SellerPage')
  },
  {
    path: '/trendPage',
    component: () =>
        import ('@/views/TrendPage')
  },
  {
    path: '/mapPage',
    component: () =>
        import ('@/views/MapPage')
  },
  {
    path: '/rankPage',
    component: () =>
        import ('@/views/RankPage')
  },
  {
    path: '/hotPage',
    component: () =>
        import ('@/views/HotPage')
  },
  {
    path: '/stockPage',
    component: () =>
        import ('@/views/StockPage')
  } */
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router