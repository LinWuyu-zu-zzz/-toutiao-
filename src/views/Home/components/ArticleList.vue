<template>
  <!-- 中间每一篇文章部分，不包括顶部和底部 -->
  <div class="article">
    <!-- 1.@load： 触底的时候触发 -->
    <!-- 2. offset： 滚动条与底部距离小于 offset 时触发load事件，默认值是300-->
    <!-- 3.immediate-check：是否在一刷新时立即执行滚动位置检查，默认是true -->

    <!-- v-model="loading:  -->
    <!-- loading为true时，load事件不会被触发 -->
    <!-- loading为false时，load事件会被触发 -->
    <!-- finished属性： 为false则会让load事件被触发 ，为true不会触发-->
    <!-- refresh属性： 上拉刷新，默认是flase,上拉时自动改为true -->
    <van-pull-refresh v-model="refreshing" @refresh="getNextPageArticle">
      <van-list
        v-model="loading"
        @load="getNextPageArticle"
        offset="300"
        :immediate-check="false"
        :finished="finished"
        finished-text="没有更多文章了~"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <article-item
          v-for="item in articles"
          :key="item.id"
          :article="item"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleAPI } from '@/api' // 引入封装好的request请求
import ArticleItem from './ArticleItem.vue' // 引入单独抽取出去的'渲染每一篇文章列表'的组件
export default {
  name: 'ArticleList', // vue工具能看到的组件名称
  components: { ArticleItem },
  props: {
    id: [String, Number]
  },
  data() {
    return {
      articles: [],
      preTimestamp: '',
      loading: false, // 默认为false，触发下拉加载
      finished: false,
      error: false, // 默认没有错误提示
      refreshing: false
    }
  },
  created() {
    this.getFirstPageArticle()
  },
  methods: {
    // 获取下一页的文章, 渲染在页面上
    async getFirstPageArticle() {
      // 获取第一页的文章，渲染在页面上
      // new Date().valueof 时间戳的三种方式
      // Date.now()
      // +new Date()
      try {
        const { data } = await getArticleAPI(this.id, +new Date())
        this.articles = data.data.results

        // 保存下一页的时间戳，用于下拉刷新时作为参数传递
        this.preTimestamp = data.data.pre_timestamp
      } catch (error) {
        // js的错误上抛, 507的服务器炸了上抛, 400参数丢失也上抛 中文
        const status = error.response?.status
        if (!error.response || status === 507) {
          throw error
        } else {
          if (status === 400) {
            throw new Error(error.response.data.message) // 把507服务端的错误提示到控制台上
          }
        }
      }
    },
    // 获取下一页的文章，即刷新出下一页
    async getNextPageArticle() {
      try {
        //   if (Math.random() < 0.5) {  //测试概率为0.5，去看提示的错误
        //     throw new Error()
        //   }
        // 1.发送请求，和上面请求是同一个接口，所以同一个getArticleAPI函数
        const { data } = await getArticleAPI(this.id, this.preTimestamp)

        if (!data.data.pre_timestamp) {
          // 提示'没有更多文章了'
          this.finished = true
        }

        // 如果是下拉加载，this.loading是true, 将数据放在最后
        // 如果是上拉刷新，this.refreshing是true, 将数据放在最前
        if (this.refreshing) {
          //
          this.articles.unshift(...data.data.results)
        } else {
          // 2.添加到articles
          this.articles.push(...data.data.results) // results是一个数组，要把里面每一项push进去，用扩展运算符...
        }

        // 3.更新时间戳
        this.preTimestamp = data.data.pre_timestamp
      } catch (error) {
        this.error = true // 为true有错误提示
      } finally {
        // finally无论也没用错误都会执行
        // 4.更改loading，让他是false继续触发下拉
        // 4.更改refreshing，让他是false继续触发上滑
        this.loading = false
        this.refreshing = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article {
  // 注意我们是按照750的高度来算的，记得调到750高度下再算92px,83px
  height: calc(100vh - 92px - 83px - 100px); // calc自动计算高度
  overflow: auto; // 让中间文章部分有自己的滚动条（注意先定高）

  // &: 代表当前元素他爹
  // ::-webkit-scrollbar : 滚动槽
  // ::-webkit-scrollbar-thumb: 滚动的滑块
  &::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3296fa;
    border-radius: 10px;
  }
}
</style>
