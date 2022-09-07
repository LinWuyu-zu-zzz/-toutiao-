// 请求封装都在api文件夹, user.js划分是跟后端的接口文档一致
import request from '@/utils/request'

/**
 * 发送登录请求
 * @param {String} mobile 手机号
 * @param {Number} code 验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile, // 外界传进来,形参接收
      code
    }
  })
}

/**
 * 发送验证码功能, 发送请求
 * @param {String} mobile 手机号
 * @returns Promise
 */
export const sendCodeAPI = (mobile) => { // get请求
  return request({
    url: `/v1_0/sms/codes/${mobile}` // 直接写手机号131...,所以外界传进来,形参接收
  })
}
