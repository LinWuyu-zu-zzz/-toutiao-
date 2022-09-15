<template>
  <div class="result">
    <van-list
      v-model="loading"
      @load="getResults"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
    <!-- 点击跳转到文章详情页面，先写路径，查询参数，用query传参 -->
      <van-cell
        v-for="item in results"
        :key="item.art_id"
        :title="item.title"
        @click="
          $router.push({
            path: '/detail',
            query: { articleId: item.art_id }
          })
        "
      ></van-cell>
    </van-list>
  </div>
</template>

<script>
import { getResultsAPI } from '@/api'
export default {
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      page: 1, // 自己写的（接口表示该参数不是必带的）
      perPage: 10, // 自己写的
      results: [], // 接收渲染的文章数据
      finished: false,
      error: false // 错误提示，默认false
    }
  },
  // immediate-check:是否在初始化时立即执行滚动位置检查,默认为true
  // created() {  //注意：不需要调用，@load一进来就调用，不需要写在created里
  //   this.getResults()
  // },
  methods: {
    async getResults() {
      try {
        const { data } = await getResultsAPI(
          this.page++, // 每加载一页，page都+1，下载下一页数据
          this.perPage,
          this.keywords
        )

        if (data.data.results.length === 0) {
          this.finished = true // 打一个111会发现无限循环一直发起请求，且results数组为空，finished为true终止加载
        }

        // 保存数据
        // this.results.push(data.data.results) 方法一：把新请求回来的数据push加到后面
        this.results = [...this.results, ...data.data.results] // 总的数组：[老数据，新数据]
      } catch {
        this.error = true // 有错误的时候不走上面的代码，进到catch，把error的提示显示出来
      } finally {
        // 关闭loading 不管有没有错误都进到finally里
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.result {
  height: calc(100vh - 108px);
  overflow: auto; // 滚动条，auto/scroll/overlay（不占空间，和auto用法一致）
}
</style>
