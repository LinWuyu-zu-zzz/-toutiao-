import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login' 懒加载了不需要写
Vue.use(VueRouter)

// 单页面SPA: 缺点: 首屏加载速度很慢,使用路由懒加载(使用到了路由再去请求他)
// 懒加载的chunk默认名字是模块的路径(在谷歌的network查看)
// 魔法注释写法:  /* webpackChunkName:新名字 */       性能优化!!
const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ', // 重定向: 栏页面一刷新就是首页,因为/ 会自动去掉空格
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      // 因为这个项目的问答和视频页面没有写,这样写可以合并请求,就不会发两次,而是发一次
      {
        path: '/video',
        component: () => import(/* webpackChunkName:base */ '@/views/Video')
      },
      {
        path: '/qa',
        component: () => import(/* webpackChunkName:base */ '@/views/QA')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login') // 懒加载
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName:"Search" */ '@/views/Search') // 魔法注释：network可以看到name是Search
  }
]

const router = new VueRouter({
  routes
})

export default router
