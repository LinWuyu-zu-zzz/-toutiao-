<template>
  <div>
    <!-- 搜索框 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button icon="search" size="small" block round>搜索</van-button>
      </template>
    </van-nav-bar>

    <!-- 频道及文章展示 -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 每一篇文章详情-组件 -->
        <article-list :id="item.id"></article-list>
      </van-tab>

      <span class="toutiao toutiao-gengduo" @click="isShow = true"></span>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup
      v-model="isShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 弹窗频道组件 -->
      <!-- 自定义事件：让父组件传过来index, -->
      <more-edit
        @change-active=";[(isShow = false), (active = $event)]"
        :myChannels="channels"
      ></more-edit>
    </van-popup>
  </div>
</template>

<script>
import { getChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import MoreEdit from './components/MoreEdit'

export default {
  components: { ArticleList, MoreEdit },
  data() {
    return {
      active: 0, // 高亮,下标索引
      channels: [],
      isShow: false
    }
  },
  created() {
    this.getChannel()
  },
  // 拓展笔记:
  // 1.  ??  相当于||, 常用于if语句 if(a ?? b){}   if(a || b){}
  // 2.  ?.  可选链操作符, 如果?号前面是undefined, 那么不会往后取值 if(a?.b){}
  methods: {
    async getChannel() {
      try {
        const { data } = await getChannelAPI()
        // console.log(data)
        this.channels = data.data.channels
      } catch (error) {
        if (!error.response) {
          // js的错误,上抛
          throw error
        } else {
          const status = error.response.status
          status === 507 && this.$toast.fail('服务端异常,请刷新')
          // status === 507 ?? this.$toast.fail('服务端异常,请刷新')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;

  // inherit 继承
  // unset 不设置
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button--default {
    background-color: #5babfb;
    border: 0;
    color: #fff;
    font-size: 30px;
  }

  .van-icon {
    color: #fff;
  }
  .van-button--block {
    width: 7.4rem;
  }
}

/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
</style>
