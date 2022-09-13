// 单独封装dayjs格式化时间
// 默认语言是英文 如2 year ago
import dayjs from 'dayjs'
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-cn')

dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 全局使用简体中文

// 暴露出去，在需要用到的地方使用
export default dayjs
