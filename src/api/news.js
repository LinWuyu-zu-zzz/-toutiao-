// 所有关于新闻的接口请求
import request from '@/utils/request'

/**
 *
 * @param {String | Number} id  频道的id,Home页面文章展示v-for channels循环的时候已经传了一种id
 * @param {Number} timestamp 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
 * @returns Promise
 */
export const getArticleAPI = (id, timestamp) => {
  // 接口文档里是query形式传参进来,用params配置项
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: id, // key是文档里规定的,value是传进来的形参
      timestamp: timestamp // 时间戳
    }
  })
}
