<template>
  <div>
    黑马头条
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <div class="box"></div>
  </div>
</template>

<script>
// 1.git提交  2.导入字体图标fonts
// 3.rem适配: 3.1 下载包amfe-flexible,引入amfe-flexible
//            3.2 下载post-css(预处理器), 新建.postcssrc.js文件并配置
export default {}
</script>

<style scoped>
.box {
  width: 2rem;
  height: 2rem;
  background-color: gold;
}
</style>
