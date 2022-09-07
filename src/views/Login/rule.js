// 把表单验证规则抽出来, 不然写在结构里比较臃肿
export const mobileRules = [
  { required: true, message: '请填写手机号' },
  { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机格式错误' }
]

export const codeRules = [
  { required: true, message: '请填写验证码' },
  { pattern: /[0-9]{6}/, message: '验证码格式错误' }
]
