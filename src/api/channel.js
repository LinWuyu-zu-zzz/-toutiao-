// 封装所有关于频道的接口

import request from '@/utils/request'

/**
 * 获取用户自己的频道(分为用户自己的和未登录游客的)
 * @returns Promise
 */
export const getChannelAPI = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

/**
 * 推荐频道，获取所有的频道
 * @returns Promise
 */
export const getAllChannelsAPI = () => {
  return request({
    url: '/v1_0/channels'
  })
}

/**
 *  删除频道
 * @param {String|Number} id 频道的id
 * @returns Promise
 */
export const delChannelAPI = (id) => {
  return request({
    url: `/v1_0/user/channels/${id}`,
    method: 'DELETE'
  })
}

/**
 * 新增频道
 * @param {Number|String} id 新增频道的id
 * @param {Number} seq 新增频道的索引值，要加在后端数据库的哪个位置
 * @returns Promise
 */
export const addChannelAPI = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }] // 接口文档要求这样写
    }
  })
}
