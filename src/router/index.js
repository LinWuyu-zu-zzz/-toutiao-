import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login' 不需要写
Vue.use(VueRouter)

// 单页面SPA: 缺点: 首屏加载速度很慢,使用路由懒加载(使用到了路由再去请求他)
const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login') // 懒加载
  }
]

const router = new VueRouter({
  routes
})

export default router
