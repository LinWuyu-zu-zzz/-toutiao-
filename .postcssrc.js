// 所有的 预处理器postcss的插件都是一个函数
const pxToRem = require('postcss-pxtorem')
module.exports = {
  plugins: [
    pxToRem({
      // rootValue: 37.5, // 根节点字体大小
      rootValue: ({ file }) => (/vant/.test(file) ? 37.5 : 75),
      // rootValue: (module) => {
      //   console.log(module);
      //  },
      propList: ['*'] // 通配符,所有的属性都转成rem
    })
  ]
}
