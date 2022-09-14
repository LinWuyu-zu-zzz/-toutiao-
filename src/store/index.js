import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// 持久化state，类似于本地存储  保存token。  createPersistedState
// 下载 yarn add vuex-persistedstate@3.2.1
// 引入,调用

// plugins配置项:
// - key: 默认值是vuex, 可以修改key
// - storage: 默认是本地存储localStorage, 可以改为sessionStorage会话存储, cookie
// - reducer: 是一个函数, return一个对象, 对象就作为sessionStorage存储的value
export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // 调用函数,刷新页面重新初始化,token不会丢失
      key: 'HEIMA_TOUTIAO', // 默认值是vuex, 可以修改key
      // storage: window.sessionStorage, // 改为会话存储
      reducer({ tokenObj, myChannels }) {
        // 只存储token,而不包括a:1这个数据
        // const { tokenObj, myChannels} = state
        // console.log(state) // 一个对象,包括a数据的对象和token数据的对象
        return { tokenObj, myChannels }
      }
    })
  ],
  state: {
    tokenObj: {},
    myChannels: []
  },
  getters: {
    isLogin(state) {
      return !!state.tokenObj.token // 返回布尔值 !111为false, !!111为true
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      // token这个参数就是 this.SET_TOKEN(data.data) 中的data.data
      state.tokenObj = token // 把用户传过来的token加到state的空对象中
      // console.log(token)
    },
    STE_My_CHANNELS(state, channels) {
      state.myChannels = channels // 把传过来的删除或添加后最新channels数组信息存给state
    }
  }
})
