<template>
  <div>
    <article-item
      v-for="item in articles"
      :key="item.id"
      :article="item"
    ></article-item>
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
      articles: []
    }
  },
  created() {
    this.getFirstPageArticle()
  },
  methods: {
    async getFirstPageArticle() {
      // new Date().valueof 时间戳的三种方式
      // Date.now()
      // +new Date()
      try {
        const { data } = await getArticleAPI(this.id, +new Date())
        this.articles = data.data.results
      } catch (error) {
        // js的错误上抛, 507的服务器炸了上抛, 400参数丢失也上抛 中文
        const status = error.response?.status //
        if (!error.response || status === 507) {
          throw error
        } else {
          if (status === 400) {
            throw new Error(error.response.data.message) // 把507服务端的错误提示到控制台上
          }
        }
      }
    }
  }
}
</script>

<style></style>
