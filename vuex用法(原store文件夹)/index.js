import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 声明的所有变量, 放在vuex里的state中
// 取出来的时候: $store.state  比如<div> {{ $store.state.count }} </div>

// vuex修改数据:
// - 自产自销
// - 规范: 采用大驼峰                  payload:载荷
// - 触发调用mutations里面的方法:点击按钮里面的方法这样写: this.$store.commit('mutations里面的函数名')
// - 可接收两个参数,形参; 实参在this.$store.commit('SET_COUNT', 10), 10为实参

// - getters: 相当于计算属性computed
export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    // 相当于计算属性computed
    bigNum(state) {
      return state.count * 10
    }
  },
  mutations: {
    SET_COUNT(state, payload) {
      // 此函数可接收两个参数; 实参在this.$store.commit('SET_COUNT', 10), 10为实参
      state.count += payload // 比如点击按钮让count++
    }
  }
})
