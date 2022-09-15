<template>
  <div>
    <!-- 搜索框 -->
    <!-- focus: 输入框获得焦点时触发 -->
    <form action="/">
      <van-search
        class="search"
        v-model.trim="keywords"
        background="#3296fa"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @focus="isRenderSearchResult = false"
        @cancel="$router.push('/')"
      />
    </form>

    <!-- 动态组件：搜索历史/搜索建议/搜索结果，一次传参，三个组件都能用-->
    <!-- <search-history></search-history>
    <search-suggestion></search-suggestion>
    <search-result></search-result> -->

    <!--可以写成这样：@change-keywords="[keywords = $event, isRenderSearchResult = true]"  -->
    <component
      :keywords="keywords"
      :is="componentName"
      @change-keywords="onSearch"
    ></component>
  </div>
</template>

<script>
// background等属性是用props接收的，但class和style特殊，直接由vue自动合并到组件的根节点上 div
import SearchHistory from './components/SearchHistory.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
import SearchResult from './components/SearchResult.vue'
import { mapMutations, mapState } from 'vuex'
export default {
  components: { SearchHistory, SearchSuggestion, SearchResult },
  data() {
    return {
      keywords: '',
      isRenderSearchResult: false // 不渲染搜索结果，用这个变量代表搜索结果
    }
  },
  computed: {
    ...mapState(['histories']),
    // 计算动态组件
    // 1.显示搜索历史：搜索框的值为空
    // 2.显示搜索建议：搜索框有值，并且不渲染搜索结果 看isRenderSearchResult
    // 3.显示搜索结果，触发search事件时
    componentName() {
      if (this.keywords === '') {
        return 'SearchHistory'
      }
      if (this.isRenderSearchResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }
  },
  methods: {
    ...mapMutations(['SET_HISTORIES']),
    onSearch(keywords) {
      // 存储搜索历史
      // 两种情况下存储： 1.用户手动敲回车  2.点击了吗搜索建议
      // 用户手动输的关键词放前面， 之前的搜索历史放后面

      // 去重完再存储： 1.获取没有去重的数组  2.放在new Set(arr)  3.[...set] 扩展运算符解构
      const set = new Set([keywords, ...this.histories])
      const distinctHistories = [...set]
      // console.log(set) // 类似于对象的去重后的数据
      // console.log(distinctHistories)
      this.SET_HISTORIES(distinctHistories)

      // 传过来的keywords参数就成为用户输入的keywords
      this.keywords = keywords // 绑定自定义事件：把要传的值 给动态组件里SearchSuggestion组件
      this.isRenderSearchResult = true // 确定搜索时触发，展示搜索结果
    }
  }
}
</script>

<style scoped lang="less">
[role='button'] {
  color: #fff;
}
</style>
