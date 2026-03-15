// pages/calendar/calendar.js
import { formatDate, getToday, getPastDate, daysBetween } from '../../utils/util.js'

Page({
  data: {
    // 当前日期
    currentDate: getToday(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    
    // 日历数据
    calendarDays: [],
    
    // 打卡记录
    checkinRecords: [],
    
    // 关系温度趋势
    temperatureTrend: [],
    
    // 统计信息
    stats: {
      totalDays: 0,
      checkinDays: 0,
      avgMood: 0,
      avgCommunication: 0,
      avgIntimacy: 0,
      conflictDays: 0
    },
    
    // 选中的日期
    selectedDate: getToday(),
    selectedDateData: null,
    
    // 加载状态
    loading: true
  },

  onLoad() {
    this.loadCalendarData()
  },

  onShow() {
    this.loadCheckinRecords()
  },

  // 加载日历数据
  loadCalendarData() {
    this.generateCalendar()
    this.loadCheckinRecords()
    this.generateTemperatureTrend()
    this.calculateStats()
    
    this.setData({
      loading: false
    })
  },

  // 生成日历
  generateCalendar() {
    const { currentYear, currentMonth } = this.data
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay()
    
    const days = []
    
    // 上个月的空格
    for (let i = 0; i < firstDay; i++) {
      days.push({ type: 'prev', day: '' })
    }
    
    // 本月日期
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({
        type: 'current',
        day: i,
        date,
        hasCheckin: false,
        mood: 0,
        conflict: 0
      })
    }
    
    // 补齐到42个格子（6行）
    const totalCells = 42
    while (days.length < totalCells) {
      days.push({ type: 'next', day: '' })
    }
    
    this.setData({
      calendarDays: days
    })
  },

  // 加载打卡记录
  loadCheckinRecords() {
    // 模拟数据
    const records = []
    const today = new Date()
    
    // 生成过去30天的模拟数据
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = formatDate(date, 'YYYY-MM-DD')
      
      // 随机生成打卡数据
      const hasCheckin = Math.random() > 0.2 // 80%的打卡率
      
      if (hasCheckin) {
        const mood = Math.floor(Math.random() * 5) + 1
        const communication = Math.floor(Math.random() * 5) + 1
        const intimacy = Math.floor(Math.random() * 5) + 1
        const conflict = Math.floor(Math.random() * 5) + 1
        
        records.push({
          date: dateStr,
          mood,
          communication,
          intimacy,
          conflict,
          note: i % 5 === 0 ? '今天很开心～' : ''
        })
      }
    }
    
    this.setData({
      checkinRecords: records
    })
    
    // 更新日历上的打卡标记
    this.updateCalendarMarks(records)
  },

  // 更新日历标记
  updateCalendarMarks(records) {
    const { calendarDays } = this.data
    const updatedDays = [...calendarDays]
    
    records.forEach(record => {
      const dayIndex = updatedDays.findIndex(day => day.date === record.date)
      if (dayIndex !== -1) {
        updatedDays[dayIndex] = {
          ...updatedDays[dayIndex],
          hasCheckin: true,
          mood: record.mood,
          conflict: record.conflict
        }
      }
    })
    
    this.setData({
      calendarDays: updatedDays
    })
  },

  // 生成温度趋势
  generateTemperatureTrend() {
    const trend = []
    let temperature = 75
    
    // 生成过去30天的温度趋势
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const dateStr = formatDate(date, 'MM-DD')
      
      // 随机波动
      const change = Math.floor(Math.random() * 6) - 2 // -2到+3
      temperature = Math.max(0, Math.min(100, temperature + change))
      
      trend.push({
        date: dateStr,
        temperature
      })
    }
    
    this.setData({
      temperatureTrend: trend
    })
  },

  // 计算统计信息
  calculateStats() {
    const { checkinRecords } = this.data
    const totalDays = 30 // 过去30天
    const checkinDays = checkinRecords.length
    
    let totalMood = 0
    let totalCommunication = 0
    let totalIntimacy = 0
    let conflictDays = 0
    
    checkinRecords.forEach(record => {
      totalMood += record.mood
      totalCommunication += record.communication
      totalIntimacy += record.intimacy
      if (record.conflict >= 4) {
        conflictDays++
      }
    })
    
    this.setData({
      stats: {
        totalDays,
        checkinDays,
        checkinRate: Math.round((checkinDays / totalDays) * 100),
        avgMood: checkinDays > 0 ? (totalMood / checkinDays).toFixed(1) : 0,
        avgCommunication: checkinDays > 0 ? (totalCommunication / checkinDays).toFixed(1) : 0,
        avgIntimacy: checkinDays > 0 ? (totalIntimacy / checkinDays).toFixed(1) : 0,
        conflictDays,
        conflictRate: Math.round((conflictDays / checkinDays) * 100) || 0
      }
    })
  },

  // 选择日期
  selectDate(e) {
    const date = e.currentTarget.dataset.date
    if (!date || date.type !== 'current') return
    
    this.setData({
      selectedDate: date.date
    })
    
    this.loadSelectedDateData(date.date)
  },

  // 加载选中日期的数据
  loadSelectedDateData(date) {
    const record = this.data.checkinRecords.find(r => r.date === date)
    
    if (record) {
      this.setData({
        selectedDateData: {
          ...record,
          moodEmoji: this.getMoodEmoji(record.mood),
          moodText: this.getMoodText(record.mood),
          conflictText: this.getConflictText(record.conflict)
        }
      })
    } else {
      this.setData({
        selectedDateData: null
      })
    }
  },

  // 获取心情表情
  getMoodEmoji(mood) {
    const emojis = ['😭', '😔', '😐', '😊', '😄']
    return emojis[mood - 1] || '😐'
  },

  // 获取心情文本
  getMoodText(mood) {
    const texts = ['非常难过', '难过', '一般', '开心', '非常开心']
    return texts[mood - 1] || '一般'
  },

  // 获取冲突文本
  getConflictText(conflict) {
    const texts = ['无冲突', '轻微分歧', '一般冲突', '较大冲突', '严重冲突']
    return texts[conflict - 1] || '无冲突'
  },

  // 切换月份
  changeMonth(e) {
    const direction = e.currentTarget.dataset.direction
    let { currentYear, currentMonth } = this.data
    
    if (direction === 'prev') {
      if (currentMonth === 1) {
        currentMonth = 12
        currentYear--
      } else {
        currentMonth--
      }
    } else if (direction === 'next') {
      if (currentMonth === 12) {
        currentMonth = 1
        currentYear++
      } else {
        currentMonth++
      }
    }
    
    this.setData({
      currentYear,
      currentMonth
    }, () => {
      this.generateCalendar()
      this.loadCheckinRecords()
    })
  },

  // 跳转到今天
  goToToday() {
    const today = new Date()
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1,
      selectedDate: getToday()
    }, () => {
      this.generateCalendar()
      this.loadCheckinRecords()
      this.loadSelectedDateData(getToday())
    })
  },

  // 查看详情
  viewDetail() {
    if (!this.data.selectedDateData) {
      wx.showToast({
        title: '该日期没有打卡记录',
        icon: 'none'
      })
      return
    }
    
    wx.navigateTo({
      url: `/pages/checkin/checkin?date=${this.data.selectedDate}`
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '我们的关系日历',
      path: '/pages/calendar/calendar'
    }
  }
})