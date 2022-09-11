<template>
  <div>
    <!-- 单独抽取出来的'渲染每一篇文章列表',是ArticleList的子组件 -->

    <!-- 没有图片的结构 -->
    <van-cell
      v-if="article.cover.type === 0"
      :title="article.title"
      :label="label"
    ></van-cell>
    <!-- 一张图片的结构 -->
    <van-cell
      v-else-if="article.cover.type === 1"
      :title="article.title"
      :label="label"
    >
      <van-image width="100" height="100" :src="article.cover.images[0]" />
    </van-cell>
    <!-- 三张图片的结构 -->
    <van-cell
      v-else-if="article.cover.type === 3"
      :title="article.title"
      :label="label"
    >
      <template #label>
        <van-image
          v-for="(item, index) in article.cover.images"
          :key="index"
          width="100"
          height="100"
          :src="item"
        />

        <p>{{ label }}</p>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      default: () => ({}) // () => { return {} } 返回一个空对象
    }
  },
  computed: {
    label() {
      /* eslint-disable */
      const { aut_name, comm_count, pubdate } = this.article
      return `${aut_name} ${comm_count}评论  ${pubdate}`
    }
  }
}
</script>

<style></style>
