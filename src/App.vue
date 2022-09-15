<template>
  <div>
    <!-- 动画：transition是vuejs的内置组件，out-in是先出后进 -->
    <!-- 路由切换，页面切换会有一个左滑的动画效果 -->
    <transition name="van-slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.box {
  width: 2rem;
  height: 2rem;
  background-color: gold;
}
</style>
