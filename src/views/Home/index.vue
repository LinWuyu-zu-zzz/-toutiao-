<template>
  <div>
    <!-- 搜索框 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button
          icon="search"
          size="small"
          block
          round
          @click="$router.push('/search')"
          >搜索</van-button
        >
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
      <!-- 自定义事件：让父组件传过来index,父组件写@事件名和methods里的处理函数，子组件写this.$emit('事件名'，要传什么) -->
      <more-edit
        v-if="isShow"
        @change-active=";[(isShow = false), (active = $event)]"
        :myChannels="channels"
        @del-channel="delChannel"
        @add-channel="addChannel"
      ></more-edit>
    </van-popup>
  </div>
</template>

<script>
import { addChannelAPI, delChannelAPI, getChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import MoreEdit from './components/MoreEdit'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: { ArticleList, MoreEdit },
  data() {
    return {
      active: 0, // 高亮,下标索引
      channels: [], // 请求回来的每一个频道数据
      isShow: false
    }
  },
  created() {
    // this.getChannel()
    this.initChannels() // 因为要分为发请求和本地存储两套系统，所以在init里做个是否登录的判断
  },
  computed: {
    ...mapGetters(['isLogin']) // 把是否登录的函数映射到这里
  },
  // 拓展笔记:
  // 1.  ??  相当于||, 常用于if语句 if(a ?? b){}   if(a || b){}
  // 2.  ?.  可选链操作符, 如果?号前面是undefined, 那么不会往后取值 if(a?.b){}
  methods: {
    ...mapMutations(['STE_My_CHANNELS']),

    // 因为要分为发请求和本地存储两套系统，所以在init里做个判断
    initChannels() {
      if (this.isLogin) {
        // 1.如果登录了， channels应该发请求获取用户自己的频道
        this.getChannel()
      } else {
        // 2.如果没有登录
        // - 1.本地没有数据，就发起请求，获取默认的频道数据,和上面的一样，都是channels
        // - 1.本地存储有数据，那么channels用本地存储的
        const myChannels = this.$store.state.myChannels // 从vuex里取，也可以用...mapState
        if (myChannels.length === 0) {
          this.getChannel() // 本地没有数据，就发请求
        } else {
          this.channels = myChannels // 本地有数据，从vuex里拿
        }
      }
    },

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
    },
    // -------------------------------------------------------------------------
    // 删除操作，接收子组件MoreEdit传过来的id,子传父id
    // 首页头部的推荐、css/html和更多里的id一致，所以让父组件给子绑定自定义事件
    async delChannel(id) {
      // 删除
      try {
        const newChannels = this.channels.filter((item) => item.id !== id)
        if (this.isLogin) {
          // 如果登录了，正常发请求更新后端数据
          // 1.发送请求，在后端删除每一个频道
          await delChannelAPI(id)
        } else {
          // 如果没登录，把数据存到本地存储
          this.STE_My_CHANNELS(newChannels)
        }

        // 2.在前端页面上删除
        this.channels = newChannels
        this.$toast.success('删除频道成功') // 提示
      } catch (error) {
        // 401：用户未认证  这是axios错误
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再删除')
        } else {
          throw error
        }
      }
    },
    // ---------------------------------------------------------------------------
    async addChannel(item) {
      // 添加 每次请求都是传一个
      try {
        // 1.发送请求添加频道 this.channels.length是seq的插入后端数据的位置
        // 注意：后端数据库的channels数组信息和前端页面的channels是同一个，所以可以用this.channels.length
        if (this.isLogin) {
          // 如果登录了，正常发请求，更新后端数据
          await addChannelAPI(item.id, this.channels.length)
        } else {
          // 如果没登录，把数据存到本地存储。 每次请求都是传一个看，加到老数组的最后面
          this.STE_My_CHANNELS([...this.channels, item]) // 必须要最新数据
        }

        // 2. item是MoreEdit传过来的每一项item，一个个css/html...
        this.channels.push(item)

        this.$toast.success('添加频道成功')
      } catch (error) {
        // 401：用户未认证  这是axios错误
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再添加')
        } else {
          throw error
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
