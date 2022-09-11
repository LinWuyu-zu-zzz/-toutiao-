<template>
  <div class="profile">
    <!-- 1.头部 ES5新语法-->
    <header>
      <!-- 已登录的结构 或者这样写 v-if='$store.state.tokenObj.token'-->
      <div class="login banner" v-if="isLogin">
        <van-row></van-row>

        <van-row>
          <van-col span="12">
            <van-row
              style="height: 100%"
              type="flex"
              justify="space-around"
              align="center"
            >
              <van-image
                round
                width="1.5rem"
                height="1.5rem"
                :src="userInfo.photo"
              />
              <span class="mobile">{{ userInfo.name }}</span>
            </van-row>
          </van-col>
          <van-col span="7"></van-col>
          <van-col span="5">
            <van-row
              type="flex"
              justify="center"
              align="center"
              style="height: 100%"
            >
              <van-button class="edit-btn" size="mini" round
                >编辑资料</van-button
              >
            </van-row>
          </van-col>
        </van-row>

        <van-row>
          <!-- 不用icon字体图标,但要在图标的位置写文字,用插槽 -->
          <van-grid class="grid" :border="false">
            <van-grid-item text="头条">
              <template #icon>{{ userInfo.art_count }}</template>
            </van-grid-item>
            <van-grid-item text="粉丝">
              <template #icon>{{ userInfo.fans_count }}</template>
            </van-grid-item>
            <van-grid-item text="关注">
              <template #icon>{{ userInfo.follow_count }}</template>
            </van-grid-item>
            <van-grid-item text="获赞">
              <template #icon>{{ userInfo.like_count }}</template>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>

      <!-- 未登录的结构 用v-if v-else控制-->
      <div class="logout banner" v-else @click="$router.push('/login')">
        <van-image width="1.76rem" height="1.76rem" :src="mobileSrc" />
        <span class="text">登录 / 注册</span>
      </div>
    </header>

    <!-- 2.主体 -->
    <main>
      <van-grid column-num="2" clickable>
        <van-grid-item text="收藏">
          <template #icon>
            <span class="toutiao toutiao-shoucang"></span>
          </template>
        </van-grid-item>
        <van-grid-item text="历史">
          <template #icon>
            <span class="toutiao toutiao-lishi"></span>
          </template>
        </van-grid-item>
      </van-grid>

      <div class="link">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>
    </main>

    <!-- 3.底部 -->
    <!-- 触发mutations里面函数的写法: $store.commit('函数名', {})-->
    <footer>
      <van-button style="color: red" block v-if="isLogin" @click="loginOut"
        >退出</van-button
      >
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mobileSrc from '@/assets/images/mobile.png' // 引入的这个变量就是图片的路径
import { getUserInfoAPI } from '@/api' // 引入被封装的请求

export default {
  name: 'My',
  data() {
    return {
      mobileSrc, // 引入的这个变量就是图片的路径
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  created() {
    this.getUserInfoAPI() // 调用函数
  },
  methods: {
    async loginOut() {
      await this.$dialog.confirm({
        title: '黑马头条',
        message: '是否确认退出该账号'
      })

      this.$store.commit('SET_TOKEN', {})
    },
    async getUserInfoAPI() {
      try {
        if (!this.isLogin) return // 如果未登录,不请求,不获取token

        const { data } = await getUserInfoAPI()

        console.log(data.data)

        this.userInfo = data.data // 把请求回来的数据对象渲染出来
      } catch (error) {
        // error分为js错误和axios错误
        // 文档中,401是给用户提示,用户认证失败,需要重新登录
        // 400和507给程序员提示
        if (error.response && error.response.status === 401) {
          this.$toast.fail('用户认证失败,请重新登录') // 给用户提示
        } else {
          throw error // 上抛错误给浏览器,输出在控制台我们能看到
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.profile {
  height: 100vh;
  background-color: #f5f7f9;
  .link {
    margin: 10px 0;
  }
  .toutiao {
    font-size: 40px;
  }
  .toutiao-shoucang {
    color: red;
  }
  .toutiao-lishi {
    color: orange;
  }
}

.banner {
  width: 100%;
  height: 5.333rem;
  background: url('../../assets/images/banner.png') no-repeat 0 0 / cover;
}

.logout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .text {
    // span的类名
    font-size: 30px;
    color: #fff;
    margin-top: 10px;
  }
}

.login {
  display: flex;
  flex-direction: column;
  > .van-row {
    flex: 1;
  }
  .mobile {
    // 电话号码
    font-size: 30px;
    color: #fff;
  }
  .van-col {
    height: 100%;
  }
  .edit-btn {
    width: 1.6rem;
    height: 0.42667rem;
    color: #666;
  }
  :deep(.grid) {
    color: #fff;
    .van-grid-item__content {
      font-size: 30px;
      background-color: inherit;
    }
    .van-grid-item__text {
      color: #fff;
    }
  }
}
</style>
