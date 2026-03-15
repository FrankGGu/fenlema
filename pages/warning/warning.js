// pages/warning/warning.js
import { formatDate, showSuccess, showError } from '../../utils/util.js'

Page({
  data: {
    // 当前风险等级
    currentRisk: {
      level: '中预警',
      score: 65,
      description: '最近沟通较少，建议增加交流',
      color: '#FFB86B'
    },
    
    // 预警列表
    warnings: [],
    
    // 风险原因分析
    riskAnalysis: {
      mainReasons: [],
      suggestions: []
    },
    
    // 处理建议
    handlingSuggestions: [],
    
    // 筛选条件
    filter: {
      type: 'all', // all, miss_checkin, low_score, both_cold, conflict
      level: 'all', // all, light, medium, high
      handled: 'all' // all, handled, unhandled
    },
    
    // 预警统计
    warningsStats: {
      total: 0,
      unhandled: 0,
      highRisk: 0,
      missCheckin: 0
    },
    
    // 加载状态
    loading: true
  },

  onLoad() {
    this.loadWarningData()
  },

  onShow() {
    this.loadWarnings()
  },

  // 加载预警数据
  loadWarningData() {
    this.loadCurrentRisk()
    this.loadWarnings()
    this.loadRiskAnalysis()
    this.loadHandlingSuggestions()
    
    this.setData({
      loading: false
    })
  },

  // 加载当前风险
  loadCurrentRisk() {
    const app = getApp()
    const warnings = app.globalData.warnings || []
    
    // 计算风险等级
    let riskLevel = '正常'
    let riskScore = 0
    let description = '关系状态良好'
    let color = '#6BFF8B'
    
    const unhandledWarnings = warnings.filter(w => !w.handled)
    
    if (unhandledWarnings.length === 0) {
      riskLevel = '正常'
      riskScore = 0
      description = '暂无预警，关系状态良好'
      color = '#6BFF8B'
    } else {
      // 计算最高风险等级
      const highRisk = unhandledWarnings.some(w => w.level === 'high')
      const mediumRisk = unhandledWarnings.some(w => w.level === 'medium')
      
      if (highRisk) {
        riskLevel = '高风险'
        riskScore = 85
        description = '存在严重预警，建议立即处理'
        color = '#FF6B6B'
      } else if (mediumRisk) {
        riskLevel = '中预警'
        riskScore = 65
        description = '存在中等预警，建议关注'
        color = '#FFB86B'
      } else {
        riskLevel = '轻提醒'
        riskScore = 40
        description = '存在轻微提醒，注意观察'
        color = '#6B8BFF'
      }
    }
    
    this.setData({
      currentRisk: {
        level: riskLevel,
        score: riskScore,
        description,
        color
      }
    })
  },

  // 加载预警列表
  loadWarnings() {
    const app = getApp()
    const warnings = app.globalData.warnings || []
    
    // 格式化预警数据
    const formattedWarnings = warnings.map(warning => ({
      ...warning,
      formattedDate: formatDate(warning.date, 'MM-DD HH:mm'),
      levelColor: this.getLevelColor(warning.level),
      typeIcon: this.getTypeIcon(warning.type)
    }))
    
    this.setData({
      warnings: formattedWarnings,
      warningsStats: this.computeWarningStats(formattedWarnings)
    })
  },

  // 加载风险分析
  loadRiskAnalysis() {
    // 模拟风险分析数据
    const mainReasons = [
      { type: '漏打卡', count: 3, percentage: 40 },
      { type: '低评分', count: 2, percentage: 27 },
      { type: '沟通不足', count: 1, percentage: 13 },
      { type: '冲突升级', count: 1, percentage: 13 },
      { type: '双方冷淡', count: 1, percentage: 7 }
    ]
    
    const suggestions = [
      '建议每天固定时间进行沟通交流',
      '遇到冲突时先冷静，避免情绪化表达',
      '定期进行关系复盘，了解彼此需求',
      '增加共同活动，提升亲密度'
    ]
    
    this.setData({
      riskAnalysis: {
        mainReasons,
        suggestions
      }
    })
  },

  // 加载处理建议
  loadHandlingSuggestions() {
    const suggestions = [
      {
        title: '立即处理',
        items: [
          '与伴侣坦诚沟通当前问题',
          '完成AI建议的修复任务',
          '寻求AI调解帮助'
        ]
      },
      {
        title: '短期改善',
        items: [
          '坚持每日打卡，记录关系状态',
          '增加日常互动和关心',
          '学习有效沟通技巧'
        ]
      },
      {
        title: '长期维护',
        items: [
          '建立定期关系复盘习惯',
          '共同制定关系发展目标',
          '参加关系成长课程或咨询'
        ]
      }
    ]
    
    this.setData({
      handlingSuggestions: suggestions
    })
  },

  // 获取风险等级颜色
  getLevelColor(level) {
    const colors = {
      light: '#6B8BFF',
      medium: '#FFB86B',
      high: '#FF6B6B'
    }
    return colors[level] || '#999999'
  },

  // 获取预警类型图标
  getTypeIcon(type) {
    const icons = {
      '漏打卡': '⏰',
      '低评分': '📉',
      '双方冷淡': '❄️',
      '冲突升级': '⚡',
      '沟通不足': '💬'
    }
    return icons[type] || '⚠️'
  },

  // 处理预警
  handleWarning(e) {
    const warningId = e.currentTarget.dataset.id
    const app = getApp()
    
    // 找到预警
    const warnings = app.globalData.warnings
    const warning = warnings.find(w => w.id === warningId)
    
    if (!warning) {
      showError('预警不存在')
      return
    }
    
    if (warning.handled) {
      showError('该预警已处理')
      return
    }
    
    wx.showModal({
      title: '处理预警',
      content: `确定要标记「${warning.type}」预警为已处理吗？`,
      success: (res) => {
        if (res.confirm) {
          // 标记为已处理
          warning.handled = true
          warning.handledAt = new Date().toISOString()
          wx.setStorageSync('warnings', warnings)
          
          showSuccess('预警已处理')
          
          // 刷新数据
          this.loadCurrentRisk()
          this.loadWarnings()
        }
      }
    })
  },

  // 查看预警详情
  viewWarningDetail(e) {
    const warningId = e.currentTarget.dataset.id
    const warning = this.data.warnings.find(w => w.id === warningId)
    
    if (!warning) return
    
    wx.showModal({
      title: `预警详情 - ${warning.type}`,
      content: `
时间：${warning.formattedDate}
等级：${warning.level === 'light' ? '轻提醒' : warning.level === 'medium' ? '中预警' : '高风险'}
原因：${warning.reason}
状态：${warning.handled ? '已处理' : '未处理'}
      `.trim(),
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 筛选预警
  filterWarnings(e) {
    const filterType = e.currentTarget.dataset.type
    const filterValue = e.currentTarget.dataset.value
    
    this.setData({
      [`filter.${filterType}`]: filterValue
    })
    
    // 实际项目中这里应该重新请求数据
    // 这里只是模拟筛选
    this.applyFilters()
  },

  // 应用筛选
  applyFilters() {
    const { filter } = this.data
    const app = getApp()
    const allWarnings = app.globalData.warnings || []
    
    let filteredWarnings = [...allWarnings]
    
    // 按类型筛选
    if (filter.type !== 'all') {
      filteredWarnings = filteredWarnings.filter(w => w.type === filter.type)
    }
    
    // 按等级筛选
    if (filter.level !== 'all') {
      filteredWarnings = filteredWarnings.filter(w => w.level === filter.level)
    }
    
    // 按处理状态筛选
    if (filter.handled !== 'all') {
      const handled = filter.handled === 'handled'
      filteredWarnings = filteredWarnings.filter(w => w.handled === handled)
    }
    
    // 格式化
    const formattedWarnings = filteredWarnings.map(warning => ({
      ...warning,
      formattedDate: formatDate(warning.date, 'MM-DD HH:mm'),
      levelColor: this.getLevelColor(warning.level),
      typeIcon: this.getTypeIcon(warning.type)
    }))
    
    this.setData({
      warnings: formattedWarnings,
      warningsStats: this.computeWarningStats(formattedWarnings)
    })
  },

  // 计算预警统计
  computeWarningStats(warnings) {
    const stats = {
      total: warnings.length,
      unhandled: 0,
      highRisk: 0,
      missCheckin: 0
    }

    warnings.forEach(w => {
      if (!w.handled) stats.unhandled++
      if (w.level === 'high') stats.highRisk++
      if (w.type === '漏打卡') stats.missCheckin++
    })

    return stats
  },

  // 清除筛选
  clearFilters() {
    this.setData({
      filter: {
        type: 'all',
        level: 'all',
        handled: 'all'
      }
    }, () => {
      this.loadWarnings()
    })
  },

  // 寻求AI帮助
  seekAIHelp() {
    wx.navigateTo({
      url: '/pages/ai-mediation/ai-mediation'
    })
  },

  // 查看修复任务
  viewRepairTasks() {
    wx.navigateTo({
      url: '/pages/task/task'
    })
  },

  // 寻求专业帮助
  seekProfessionalHelp() {
    wx.showModal({
      title: '寻求专业帮助',
      content: '如果您觉得关系问题比较严重，建议寻求专业心理咨询师或关系顾问的帮助。',
      confirmText: '了解详情',
      cancelText: '暂不需要',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          })
        }
      }
    })
  },

  // 导出预警报告
  exportReport() {
    wx.showToast({
      title: '报告导出功能开发中',
      icon: 'none'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadWarningData()
    wx.stopPullDownRefresh()
  }
})