// 通用工具函数

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象或时间戳
 * @param {string} format - 格式字符串，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 获取今天日期字符串
 * @returns {string} YYYY-MM-DD格式的今天日期
 */
export function getToday() {
  return formatDate(new Date(), 'YYYY-MM-DD')
}

/**
 * 获取过去N天的日期
 * @param {number} days - 过去的天数
 * @returns {string} 日期字符串
 */
export function getPastDate(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 计算两个日期之间的天数差
 * @param {string} date1 - 日期字符串 YYYY-MM-DD
 * @param {string} date2 - 日期字符串 YYYY-MM-DD
 * @returns {number} 天数差
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 深拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * 验证手机号格式（中国）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function isValidPhone(phone) {
  const re = /^1[3-9]\d{9}$/
  return re.test(phone)
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @param {string} url - URL字符串，默认为当前页面URL
 * @returns {string|null} 参数值
 */
export function getUrlParam(name, url = '') {
  const search = url ? url.split('?')[1] : window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

/**
 * 对象转URL参数字符串
 * @param {Object} obj - 参数对象
 * @returns {string} URL参数字符串
 */
export function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * 计算关系温度颜色
 * @param {number} temperature - 关系温度（0-100）
 * @returns {string} 颜色值
 */
export function getTemperatureColor(temperature) {
  if (temperature >= 80) return '#6BFF8B' // 绿色
  if (temperature >= 60) return '#FFB86B' // 橙色
  if (temperature >= 40) return '#FF6B8B' // 粉色
  return '#FF6B6B' // 红色
}

/**
 * 获取温度描述
 * @param {number} temperature - 关系温度（0-100）
 * @returns {string} 描述文本
 */
export function getTemperatureDescription(temperature) {
  if (temperature >= 90) return '关系非常融洽'
  if (temperature >= 80) return '关系良好'
  if (temperature >= 70) return '关系稳定'
  if (temperature >= 60) return '关系一般'
  if (temperature >= 50) return '关系需要关注'
  if (temperature >= 40) return '关系紧张'
  if (temperature >= 30) return '关系较差'
  if (temperature >= 20) return '关系危险'
  return '关系濒临破裂'
}

/**
 * 获取心情表情
 * @param {number} moodLevel - 心情等级（1-5）
 * @returns {string} 表情符号
 */
export function getMoodEmoji(moodLevel) {
  const emojis = ['😭', '😔', '😐', '😊', '😄']
  return emojis[moodLevel - 1] || '😐'
}

/**
 * 获取心情描述
 * @param {number} moodLevel - 心情等级（1-5）
 * @returns {string} 描述文本
 */
export function getMoodDescription(moodLevel) {
  const descriptions = ['非常难过', '难过', '一般', '开心', '非常开心']
  return descriptions[moodLevel - 1] || '一般'
}

/**
 * 显示成功提示
 * @param {string} title - 提示标题
 * @param {number} duration - 显示时长（毫秒）
 */
export function showSuccess(title, duration = 2000) {
  wx.showToast({
    title,
    icon: 'success',
    duration
  })
}

/**
 * 显示错误提示
 * @param {string} title - 提示标题
 * @param {number} duration - 显示时长（毫秒）
 */
export function showError(title, duration = 2000) {
  wx.showToast({
    title,
    icon: 'error',
    duration
  })
}

/**
 * 显示加载中
 * @param {string} title - 提示标题
 */
export function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载中
 */
export function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示确认对话框
 * @param {string} content - 对话框内容
 * @param {string} title - 对话框标题
 * @returns {Promise<boolean>} 用户是否确认
 */
export function showConfirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
export function copyText(text) {
  wx.setClipboardData({
    data: text,
    success: () => {
      showSuccess('复制成功')
    }
  })
}

/**
 * 获取系统信息
 * @returns {Promise<Object>} 系统信息
 */
export function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 检查网络状态
 * @returns {Promise<boolean>} 是否有网络连接
 */
export function checkNetwork() {
  return new Promise((resolve) => {
    wx.getNetworkType({
      success: (res) => {
        resolve(res.networkType !== 'none')
      },
      fail: () => resolve(false)
    })
  })
}