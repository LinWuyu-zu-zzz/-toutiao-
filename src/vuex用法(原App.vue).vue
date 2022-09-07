<template>
  <div>
    <!-- <router-view></router-view> -->
    <h1>{{ count }}</h1>
    <h2>count的十倍{{ bigNum }}</h2>
    <button @click="SET_COUNT(10)">点击</button>
  </div>
</template>

<script>
// 因为<h1>{{ $store.state.count }}</h1>比较繁琐,所以需要mapState函数,效果一样

// mapState作用: 将vuex里面的state映射到computed计算属性中
// mapGetters作用: 将vuex里面的getters映射到computed计算属性中
// mapMutations作用: 将vuex里面的mutations映射到methods方法中

// mapState函数返回一个对象, mapGetters也一样
// 接收的参数: ['count']

// vuex默认暴露出mapState函数,所以按需引入就好了
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  methods: {
    // add() {
    //   this.$store.commit('SET_COUNT', 10)
    // }
    ...mapMutations(['SET_COUNT']) // 参数在上面结构里 @click="SET_COUNT(10)"
  },
  computed: {
    ...mapState(['count']), // 扩展运算符  mapState函数返回一个对象
    ...mapGetters(['bigNum']) // 扩展运算符  mapState函数返回一个对象
  }
}
</script>

<style scoped>
.box {
  width: 2rem;
  height: 2rem;
  background-color: gold;
}
</style>
