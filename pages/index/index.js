// pages/index/index.js
import { getTemperatureColor, getTemperatureDescription, getToday, getMoodEmoji, showSuccess } from '../../utils/util.js'

Page({
  data: {
    // 用户信息
    userInfo: null,
    partnerInfo: null,
    
    // 关系状态
    relationship: {
      temperature: 75,
      continuousDays: 7,
      status: 1, // 1正常 2预警 3断开
      startDate: '2025-01-01',
      lastCheckinDate: getToday()
    },
    
    // 今日打卡状态
    todayCheckin: null,
    partnerTodayCheckin: null,
    checkinToday: false,
    
    // 预警信息
    warnings: [],
    
    // 待完成任务
    pendingTasks: [],
    
    // AI提醒
    aiReminder: '',
    
    // 页面数据加载状态
    loading: true
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    // 页面显示时刷新数据
    this.checkTodayCheckin()
    this.loadWarnings()
    this.loadTasks()
  },

  loadData() {
    const app = getApp()
    
    this.setData({
      userInfo: app.globalData.userInfo,
      partnerInfo: app.globalData.mockData.partner,
      relationship: app.globalData.relationship || app.globalData.mockData.relationship,
      loading: false
    })
    
    this.checkTodayCheckin()
    this.loadWarnings()
    this.loadTasks()
    this.generateAIReminder()
  },

  // 检查今日打卡状态
  checkTodayCheckin() {
    const app = getApp()
    const today = getToday()
    
    // 模拟数据
    const todayCheckin = app.globalData.mockData.todayCheckin
    const checkinToday = app.globalData.checkinToday || false
    
    this.setData({
      todayCheckin,
      checkinToday,
      partnerTodayCheckin: {
        mood: 5,
        communication: 4,
        intimacy: 5,
        conflict: 1
      }
    })
  },

  // 加载预警信息
  loadWarnings() {
    const app = getApp()
    const warnings = app.globalData.warnings || []
    
    // 只显示未处理的预警
    const unhandledWarnings = warnings.filter(w => !w.handled)
    
    this.setData({
      warnings: unhandledWarnings
    })
  },

  // 加载任务
  loadTasks() {
    const app = getApp()
    const tasks = app.globalData.tasks || []
    
    // 待完成任务
    const pendingTasks = tasks.filter(t => t.status === 'pending')
    
    this.setData({
      pendingTasks: pendingTasks.slice(0, 3) // 只显示前3个
    })
  },

  // 生成AI提醒
  generateAIReminder() {
    const { relationship, todayCheckin, checkinToday } = this.data
    let reminder = ''
    
    if (!checkinToday) {
      reminder = '今天还未打卡哦，记得记录你们的关系状态～'
    } else if (relationship.temperature < 60) {
      reminder = '最近关系温度有些下降，建议多沟通交流～'
    } else if (todayCheckin && todayCheckin.conflict >= 4) {
      reminder = '今天冲突评分较高，建议冷静后好好沟通～'
    } else {
      const reminders = [
        '关系状态良好，继续保持哦～',
        '每天打卡是维系关系的好习惯～',
        '记得多倾听对方的感受～',
        '小惊喜能让关系更甜蜜～'
      ]
      reminder = reminders[Math.floor(Math.random() * reminders.length)]
    }
    
    this.setData({
      aiReminder: reminder
    })
  },

  // 跳转到打卡页
  goToCheckin() {
    wx.navigateTo({
      url: '/pages/checkin/checkin'
    })
  },

  // 跳转到日历页
  goToCalendar() {
    wx.switchTab({
      url: '/pages/calendar/calendar'
    })
  },

  // 跳转到预警页
  goToWarning() {
    wx.navigateTo({
      url: '/pages/warning/warning'
    })
  },

  // 跳转到AI调解室
  goToAIMediation() {
    wx.navigateTo({
      url: '/pages/ai-mediation/ai-mediation'
    })
  },

  // 跳转到任务页
  goToTask() {
    wx.navigateTo({
      url: '/pages/task/task'
    })
  },

  // 完成任务
  completeTask(e) {
    const taskId = e.currentTarget.dataset.id
    const app = getApp()
    
    app.completeTask(taskId)
    
    showSuccess('任务完成！关系温度+5')
    
    // 刷新数据
    this.loadTasks()
    this.setData({
      'relationship.temperature': app.globalData.temperature
    })
  },

  // 处理预警
  handleWarning(e) {
    const warningId = e.currentTarget.dataset.id
    const app = getApp()
    
    // 标记为已处理
    const warnings = app.globalData.warnings
    const warning = warnings.find(w => w.id === warningId)
    if (warning) {
      warning.handled = true
      warning.handledAt = new Date().toISOString()
      wx.setStorageSync('warnings', warnings)
      
      showSuccess('预警已处理')
      
      // 刷新预警列表
      this.loadWarnings()
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '关系晴雨表 - 记录我们的每一天',
      path: '/pages/index/index'
    }
  }
})