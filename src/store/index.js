import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    tokenObj: {}
  },
  getters: {},
  mutations: {
    SET_TOKEN(state, token) { // 这个参数token就是 this.SET_TOKEN(data.data) 中的data.data
      state.tokenObj = token // 把用户传过来的token加到state的空对象中
    }
  }
})
