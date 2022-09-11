<template>
  <div>
    <!-- 二级路由 -->
    <router-view></router-view>

    <!-- 导航区 -->
    <!-- route和active都是高亮的 -->
    <van-tabbar class="tabbar" route>
      <van-tabbar-item to="/ ">
        <!-- 没有合适的图标,用插槽#icon使用自己的图标 -->
        <template #icon>
          <span class="toutiao toutiao-shouye"></span>
          <span class="text">首页</span>
        </template>
      </van-tabbar-item>

      <van-tabbar-item to="/video">
        <template #icon>
          <span class="toutiao toutiao-shipin"></span>
          <span class="text">视频</span>
        </template>
      </van-tabbar-item>

      <van-tabbar-item to="/qa">
        <template #icon>
          <span class="toutiao toutiao-wenda"></span>
          <span class="text">问答</span>
        </template>
      </van-tabbar-item>

      <van-tabbar-item to="/profile">
        <template #icon>
          <span class="toutiao toutiao-wode"></span>
          <span class="text">{{ isLogin ? '我的' : '未登录' }}</span>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// 布局里面的底部导航栏,未登录显示'未登录', 登录显示'我的'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isLogin'])
  }
}
</script>

<style scoped lang="less">
.tabbar {
  :deep(.van-tabbar-item__icon) {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
  .toutiao {
    font-size: 40px;
  }
  .text {
    font-size: 30px;
  }
}
</style>
