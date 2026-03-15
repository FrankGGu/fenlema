// 网络请求工具
import { showLoading, hideLoading, showError, showSuccess } from './util.js'

// 请求基础配置
const BASE_CONFIG = {
  baseURL: 'https://api.example.com',
  timeout: 10000,
  header: {
    'content-type': 'application/json'
  }
}

// 请求拦截器
const requestInterceptor = {
  before: (config) => {
    // 显示加载中
    if (config.showLoading !== false) {
      showLoading(config.loadingText || '加载中...')
    }
    
    // 添加token
    const token = wx.getStorageSync('token')
    if (token) {
      config.header = config.header || {}
      config.header['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  after: (response) => {
    // 隐藏加载中
    if (response.config.showLoading !== false) {
      hideLoading()
    }
    return response
  },
  error: (error) => {
    // 隐藏加载中
    if (error.config?.showLoading !== false) {
      hideLoading()
    }
    return Promise.reject(error)
  }
}

// 响应拦截器
const responseInterceptor = {
  success: (response) => {
    const { data, statusCode } = response
    
    // 处理HTTP状态码
    if (statusCode >= 200 && statusCode < 300) {
      // 业务状态码处理
      if (data.code === 0 || data.code === 200) {
        return data.data || data
      } else {
        // 业务错误
        const errorMsg = data.message || `请求失败，错误码：${data.code}`
        showError(errorMsg)
        return Promise.reject(new Error(errorMsg))
      }
    } else {
      // HTTP错误
      const errorMsg = `请求失败，状态码：${statusCode}`
      showError(errorMsg)
      return Promise.reject(new Error(errorMsg))
    }
  },
  error: (error) => {
    let errorMsg = '网络请求失败'
    
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        errorMsg = '请求超时，请检查网络'
      } else if (error.errMsg.includes('fail')) {
        errorMsg = '网络连接失败，请检查网络设置'
      }
    }
    
    showError(errorMsg)
    return Promise.reject(new Error(errorMsg))
  }
}

/**
 * 发起请求
 * @param {Object} config - 请求配置
 * @returns {Promise} 请求结果
 */
function request(config) {
  // 合并配置
  const mergedConfig = {
    ...BASE_CONFIG,
    ...config,
    header: {
      ...BASE_CONFIG.header,
      ...config.header
    }
  }
  
  // 请求拦截
  const processedConfig = requestInterceptor.before(mergedConfig)
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...processedConfig,
      success: (res) => {
        const processedResponse = requestInterceptor.after({
          data: res.data,
          statusCode: res.statusCode,
          header: res.header,
          config: processedConfig
        })
        
        responseInterceptor.success(processedResponse)
          .then(resolve)
          .catch(reject)
      },
      fail: (err) => {
        const error = requestInterceptor.error({
          err,
          config: processedConfig
        })
        responseInterceptor.error(error)
          .then(resolve)
          .catch(reject)
      }
    })
  })
}

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求结果
 */
export function get(url, params = {}, config = {}) {
  return request({
    url,
    data: params,
    method: 'GET',
    ...config
  })
}

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求结果
 */
export function post(url, data = {}, config = {}) {
  return request({
    url,
    data,
    method: 'POST',
    ...config
  })
}

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求结果
 */
export function put(url, data = {}, config = {}) {
  return request({
    url,
    data,
    method: 'PUT',
    ...config
  })
}

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求结果
 */
export function del(url, params = {}, config = {}) {
  return request({
    url,
    data: params,
    method: 'DELETE',
    ...config
  })
}

/**
 * 上传文件
 * @param {string} url - 上传地址
 * @param {string} filePath - 文件路径
 * @param {Object} formData - 表单数据
 * @param {string} name - 文件字段名
 * @param {Object} config - 额外配置
 * @returns {Promise} 上传结果
 */
export function uploadFile(url, filePath, formData = {}, name = 'file', config = {}) {
  return new Promise((resolve, reject) => {
    const uploadTask = wx.uploadFile({
      url: config.baseURL ? `${config.baseURL}${url}` : `${BASE_CONFIG.baseURL}${url}`,
      filePath,
      name,
      formData,
      header: {
        ...BASE_CONFIG.header,
        ...config.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 0 || data.code === 200) {
              resolve(data.data || data)
            } else {
              showError(data.message || '上传失败')
              reject(new Error(data.message || '上传失败'))
            }
          } catch (e) {
            showError('上传结果解析失败')
            reject(new Error('上传结果解析失败'))
          }
        } else {
          showError('上传失败')
          reject(new Error('上传失败'))
        }
      },
      fail: (err) => {
        showError('上传失败')
        reject(err)
      }
    })
    
    // 监听上传进度
    if (config.onProgressUpdate) {
      uploadTask.onProgressUpdate(config.onProgressUpdate)
    }
  })
}

/**
 * 下载文件
 * @param {string} url - 下载地址
 * @param {Object} config - 额外配置
 * @returns {Promise} 下载结果
 */
export function downloadFile(url, config = {}) {
  return new Promise((resolve, reject) => {
    const downloadTask = wx.downloadFile({
      url: config.baseURL ? `${config.baseURL}${url}` : `${BASE_CONFIG.baseURL}${url}`,
      header: {
        ...BASE_CONFIG.header,
        ...config.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.tempFilePath)
        } else {
          showError('下载失败')
          reject(new Error('下载失败'))
        }
      },
      fail: (err) => {
        showError('下载失败')
        reject(err)
      }
    })
    
    // 监听下载进度
    if (config.onProgressUpdate) {
      downloadTask.onProgressUpdate(config.onProgressUpdate)
    }
  })
}

// 导出所有方法
export default {
  request,
  get,
  post,
  put,
  delete: del,
  uploadFile,
  downloadFile
}