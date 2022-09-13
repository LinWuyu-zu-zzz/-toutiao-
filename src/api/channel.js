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
