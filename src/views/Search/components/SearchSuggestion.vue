<template>
  <div>
    <!-- 搜索建议 -->
    <!-- 原本循环suggestions，但需要高亮效果，把包含的关键字keywords提取出来，用map和正则 -->
    <!-- 点击搜索建议，跳到搜索结果(即详情)，传的是原来suggestions的数据，而不是item,item是hightLightSuggestions的数据，带有span的结构 -->
    <van-cell
      v-for="(item, index) in hightLightSuggestions"
      :key="index"
      icon="search"
      @click="$emit('change-keywords', suggestions[index])"
    >
      <!-- title插槽：自定义单元格左侧title内容 -->
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestionsAPI } from '@/api'
// 防抖debounce 下载yarn add lodash， 再按需导入 {debounce}
import { debounce } from 'lodash'

export default {
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  watch: {
    // 输入了第一个字符，才决定渲染SearchSuggestion组件，这个组件出现了才会有监听
    keywords: {
      immediate: true, // 第一次
      handler: 'getSuggestions' // 监听keywords，要处理的函数就是getSuggestions
    }
  },
  computed: {
    // 用户输入什么字母，什么就变红色，用span包裹这个字母替换成红色的字母
    // 1. map  如arr.map( item => item*0.8) 即每一项都×0.8
    //  - 返回映射之后的新数组, 长度和原数组一致, 接收一个函数，返回 新的元素
    // 2. 动态正则
    //  - new RegExp(字符串,修饰符'ig')是动态正则
    //  - /Anglar/ig 是字面量形式的正则, 写死的，不能动态生成正则的内容
    // 3. 字符串的replace方法：替换
    //  - 字符串.replace(正则,函数) 如：str.replace(/abc/gi, ()=>{} )
    //   - 函数接收一个参数match, 表示匹配上的结果, 函数的返回值回作为被替换的值
    hightLightSuggestions() {
      const reg = new RegExp(this.keywords, 'gi') // 动态正则：/this.keywords/
      return this.suggestions.map((str) => {
        return str.replace(
          reg, // 动态正则：/this.keywords/, 如/A/
          (match) => `<span style="color:red">${match}</span>`
        ) //  把字符串str的每一项建议 /A/替换为/红色的A或者a/
      })
    }
  },
  methods: {
    // 防抖debounce写法：用debounce包裹需要做防抖处理的函数 debounce(fn,300)
    getSuggestions: debounce(async function () {
      try {
        // Boolean()是window自带的方法，如Boolean(123) 打印是true; Boolean(0或者null或者undefined) 打印false
        const { data } = await getSuggestionsAPI(this.keywords)
        this.suggestions = data.data.options.filter(Boolean)
        // this.suggestions = data.data.options.filter( (item)=>{item !== null} ) 有可能获取到的data.option里面是null,过滤掉就可以了
      } catch (error) {
        if (error.resonse) {
          this.$toast.fail('获取搜索建议失败')
        } else {
          throw error
        }
      }
    }, 300) // 防抖
  }
}
</script>

<style></style>
