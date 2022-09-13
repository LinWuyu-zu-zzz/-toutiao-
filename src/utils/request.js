// yarn add axios  引入
import store from '@/store'
import axios from 'axios'
// axios.defaults.baseURL = 'http://toutiao.itheima.net'
// axios.defaults.timeout = 3000

// 有一个API: axios.create() 专门去克隆axios
const request = axios.create({
  timeout: 3000,
  baseURL: 'http://toutiao.itheima.net'
})

// 添加请求拦截器,将传参的Authorization抽取出来,很多请求都写,太冗余
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // console.log(config) // 有headers,有Authorization,有token
    const {
      getters: { isLogin },
      state: { tokenObj }
    } = store
    if (isLogin) { // 如果登录了,所有的请求都加上Authorization,不登录不发请求
      config.headers.Authorization = `Bearer ${tokenObj.token}`
    }
    return config // 必须返回config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

export default request
