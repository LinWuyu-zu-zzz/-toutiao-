<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar title="登录" class="nav-bar" />
    <!-- 表单 -->
    <!-- van-field: 输入框,有text类,password类,文本域类,验证码类 -->
    <!-- v-model: 用户输入的值 -->
    <!-- name: 标识表单项, 一般写上 -->
    <!-- :rules="[{ required: 必填, message: '错误信息',pattern:正则,trigger:规则的触发时机onChange,onblue(默认值) }]" -->
    <!-- 加字体图标: 用插槽 -->
    <van-form @submit="onSubmit" class="form" ref="form1">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>

      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <!-- 插槽:字体图标 -->
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>

        <!-- 插槽:验证码按钮 -->
        <template #button>
          <van-button
            class="btn"
            block
            round
            size="small"
            type="default"
            native-type="button"
            v-if="isShowCodeBtn"
            @click="sendCode"
            >获取验证码</van-button
          >

          <van-count-down
            :time="60 * 1000"
            format="ss秒"
            v-else
            @finish="isShowCodeBtn = true"
          />
          <!-- format: 时间的格式 -->
          <!-- @finish事件: 倒计时结束时触发 -->
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { mobileRules, codeRules } from './rule'
import { login, sendCodeAPI } from '@/api'

import { mapMutations } from 'vuex'

// token: 身份证,标识用的   把存在vuex里面

export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules: mobileRules,
      codeRules, // 简写
      isShowCodeBtn: true
    }
  },
  methods: {
    ...mapMutations(['SET_TOKEN']),
    async onSubmit(values) {
      // submit事件通过之后才会触发打印
      this.loading()

      try {
        // 登录
        const { data } = await login(this.mobile, this.code)
        console.log(data.data) // 一个对象,包含token和refresh_token的值
        this.SET_TOKEN(data.data) // 登录成功后端会有一个token,将token存进vuex

        this.$router.push('/profile') // 登录成功,跳转路由页面

        this.$toast.success('登录成功') // 因为duration为0,需要覆盖掉
      } catch (error) {
        // 细分一下失败类型:比如手机号还是验证码失败
        // error: 1.是js抛出的错   2.axios封装的error对象
        // 是js抛出的错 : 直接打印consloe.dir(error)
        // axios封装的error对象:
        //  - error.response.data  是后端返回的数据(包括data为null,message为验证码不正确)
        //  - error.response.status  是后端返回的状态码 200 201 400 507等
        if (error.response && error.response.status === 400) {
          this.$toast.fail(error.response.data.message)
        } else {
          // 否则就是js抛出的错,我们自己写错了代码 (或者是状态码507,不用管)
          console.dir(error)
          this.$toast.clear() // 因为duration为0,直接清掉
          // throw error
        }
      }
    },

    loading() {
      // 把加载时提示的文案封装一个函数, 上面下面都调用一次
      this.$toast.loading({
        message: '加载中...', // 提示文案
        forbidClick: true, // 禁止点击
        duration: 0 // 展示的时长, 为0会一直展示
      })
    },

    async sendCode() {
      // 点击验证码事件:
      // 优化: 有了手机号码才能发送验证码
      //  - 给van-form绑定 ref属性 获取到组件实例
      //  - 验证手机号: this.$refs.form.validate('mobile')  或者(['mobile','code'])
      await this.$refs.form1.validate('mobile') // (因为文档说$refs返回Promise,可以写await,也可写成.then)

      // 验证成功了再发送请求,给用户手机发短信
      this.loading() // 调用函数,加载时的文案
      try {
        await sendCodeAPI(this.mobile) // 1.发送请求
        this.isShowCodeBtn = false // 2.显示倒计时组件
        this.$toast.success('发送验证码成功')
      } catch (error) {
        this.$toast.fail('发送验证码失败')
        if (
          // 如果是axios的错误,且状态码是,404手机号不正确,或者429接口访问次数受限
          error.response &&
          (error.response.status === 429 || error.response.status === 404)
        ) {
          // 那么提示错误信息,'验证码发送过于频繁,请多少秒后重试'
          this.$toast.fail(error.response.data.message) // 即"验证码发送过于频繁"
        } else {
          // 否则不是axios的错误,而是js的错误,就浏览器抛出error
          this.$toast.clear() // (记得清空一下duration)
          throw error
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
//  :deep 深度选择器(发生组件穿透时起作用,或者直接去掉scoped也可以)
.nav-bar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
}
:deep(.form) {
  .van-cell__title {
    flex: 1;
  }
  .van-cell__value {
    flex: 19;
  }
  toutiao {
    font-size: 4px; // postcss是按照375的大小设计的,我们的代码是750,所以谷歌上是20px
  }
}
.btn {
  height: 0.64rem;
  background-color: #eee;
  color: #a58594;
}
</style>
