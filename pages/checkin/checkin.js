// pages/checkin/checkin.js
import { showSuccess, showError, getMoodEmoji, getMoodDescription } from '../../utils/util.js'

Page({
  data: {
    // 打卡数据
    checkinData: {
      mood: 3,        // 心情，默认一般
      communication: 3, // 沟通状态，默认一般
      intimacy: 3,     // 亲密度，默认一般
      conflict: 1,     // 冲突情况，默认无冲突
      note: ''         // 备注
    },
    
    // 心情选项
    moodOptions: [
      { value: 1, emoji: '😭', label: '非常难过', selected: false },
      { value: 2, emoji: '😔', label: '难过', selected: false },
      { value: 3, emoji: '😐', label: '一般', selected: true },
      { value: 4, emoji: '😊', label: '开心', selected: false },
      { value: 5, emoji: '😄', label: '非常开心', selected: false }
    ],
    
    // 沟通状态选项
    communicationOptions: [
      { value: 1, label: '几乎没有', selected: false },
      { value: 2, label: '较少', selected: false },
      { value: 3, label: '一般', selected: true },
      { value: 4, label: '良好', selected: false },
      { value: 5, label: '非常充分', selected: false }
    ],
    
    // 亲密度选项
    intimacyOptions: [
      { value: 1, label: '非常疏远', selected: false },
      { value: 2, label: '有些疏远', selected: false },
      { value: 3, label: '一般', selected: true },
      { value: 4, label: '比较亲密', selected: false },
      { value: 5, label: '非常亲密', selected: false }
    ],
    
    // 冲突情况选项
    conflictOptions: [
      { value: 1, label: '无冲突', selected: true },
      { value: 2, label: '轻微分歧', selected: false },
      { value: 3, label: '一般冲突', selected: false },
      { value: 4, label: '较大冲突', selected: false },
      { value: 5, label: '严重冲突', selected: false }
    ],
    
    // 今日是否已打卡
    alreadyCheckedIn: false,
    
    // 伴侣今日打卡状态
    partnerCheckin: null,
    
    // 提交状态
    submitting: false
  },

  onLoad() {
    this.checkTodayCheckin()
    this.loadPartnerCheckin()
  },

  // 检查今日是否已打卡
  checkTodayCheckin() {
    const app = getApp()
    const alreadyCheckedIn = app.globalData.checkinToday || false
    
    if (alreadyCheckedIn) {
      const todayCheckin = app.globalData.mockData.todayCheckin
      this.setData({
        alreadyCheckedIn: true,
        'checkinData.mood': todayCheckin.mood,
        'checkinData.communication': todayCheckin.communication,
        'checkinData.intimacy': todayCheckin.intimacy,
        'checkinData.conflict': todayCheckin.conflict,
        'checkinData.note': todayCheckin.note || ''
      })
      
      // 更新选项选中状态
      this.updateOptionsSelection()
    }
  },

  // 加载伴侣打卡状态
  loadPartnerCheckin() {
    // 模拟伴侣打卡数据
    this.setData({
      partnerCheckin: {
        mood: 5,
        communication: 4,
        intimacy: 5,
        conflict: 1,
        note: '今天很开心～',
        time: '18:30'
      }
    })
  },

  // 更新选项选中状态
  updateOptionsSelection() {
    const { checkinData } = this.data
    
    // 更新心情选项
    const moodOptions = this.data.moodOptions.map(option => ({
      ...option,
      selected: option.value === checkinData.mood
    }))
    
    // 更新沟通选项
    const communicationOptions = this.data.communicationOptions.map(option => ({
      ...option,
      selected: option.value === checkinData.communication
    }))
    
    // 更新亲密度选项
    const intimacyOptions = this.data.intimacyOptions.map(option => ({
      ...option,
      selected: option.value === checkinData.intimacy
    }))
    
    // 更新冲突选项
    const conflictOptions = this.data.conflictOptions.map(option => ({
      ...option,
      selected: option.value === checkinData.conflict
    }))
    
    this.setData({
      moodOptions,
      communicationOptions,
      intimacyOptions,
      conflictOptions
    })
  },

  // 选择心情
  selectMood(e) {
    const value = parseInt(e.currentTarget.dataset.value)
    
    const moodOptions = this.data.moodOptions.map(option => ({
      ...option,
      selected: option.value === value
    }))
    
    this.setData({
      moodOptions,
      'checkinData.mood': value
    })
  },

  // 选择沟通状态
  selectCommunication(e) {
    const value = parseInt(e.currentTarget.dataset.value)
    
    const communicationOptions = this.data.communicationOptions.map(option => ({
      ...option,
      selected: option.value === value
    }))
    
    this.setData({
      communicationOptions,
      'checkinData.communication': value
    })
  },

  // 选择亲密度
  selectIntimacy(e) {
    const value = parseInt(e.currentTarget.dataset.value)
    
    const intimacyOptions = this.data.intimacyOptions.map(option => ({
      ...option,
      selected: option.value === value
    }))
    
    this.setData({
      intimacyOptions,
      'checkinData.intimacy': value
    })
  },

  // 选择冲突情况
  selectConflict(e) {
    const value = parseInt(e.currentTarget.dataset.value)
    
    const conflictOptions = this.data.conflictOptions.map(option => ({
      ...option,
      selected: option.value === value
    }))
    
    this.setData({
      conflictOptions,
      'checkinData.conflict': value
    })
  },

  // 输入备注
  inputNote(e) {
    this.setData({
      'checkinData.note': e.detail.value
    })
  },

  // 提交打卡
  submitCheckin() {
    if (this.data.submitting) return
    
    const { checkinData, alreadyCheckedIn } = this.data
    
    // 验证数据
    if (!this.validateCheckinData(checkinData)) {
      return
    }
    
    this.setData({ submitting: true })
    
    const app = getApp()
    
    // 模拟网络请求延迟
    setTimeout(() => {
      try {
        // 提交打卡数据
        const result = app.submitCheckin(checkinData)
        
        if (result) {
          showSuccess(alreadyCheckedIn ? '打卡更新成功！' : '打卡成功！')
          
          // 返回首页
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          showError('打卡失败，请重试')
        }
      } catch (error) {
        showError('打卡失败，请重试')
      } finally {
        this.setData({ submitting: false })
      }
    }, 800)
  },

  // 验证打卡数据
  validateCheckinData(data) {
    if (data.mood < 1 || data.mood > 5) {
      showError('请选择心情')
      return false
    }
    
    if (data.communication < 1 || data.communication > 5) {
      showError('请选择沟通状态')
      return false
    }
    
    if (data.intimacy < 1 || data.intimacy > 5) {
      showError('请选择亲密度')
      return false
    }
    
    if (data.conflict < 1 || data.conflict > 5) {
      showError('请选择冲突情况')
      return false
    }
    
    return true
  },

  // 跳过打卡
  skipCheckin() {
    wx.showModal({
      title: '跳过打卡',
      content: '确定要跳过今天的打卡吗？连续打卡天数将会中断。',
      success: (res) => {
        if (res.confirm) {
          showSuccess('已跳过今日打卡')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
    })
  },

  // 查看打卡历史
  viewHistory() {
    wx.navigateTo({
      url: '/pages/calendar/calendar'
    })
  },

  // 分享打卡
  shareCheckin() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  // 获取打卡建议
  getSuggestion() {
    const { checkinData } = this.data
    let suggestion = ''
    
    if (checkinData.mood <= 2) {
      suggestion = '心情不太好？试试深呼吸，或者和伴侣聊聊～'
    } else if (checkinData.communication <= 2) {
      suggestion = '沟通较少？建议每天预留专属的交流时间～'
    } else if (checkinData.intimacy <= 2) {
      suggestion = '感觉有些疏远？一个小惊喜或许能让关系更亲密～'
    } else if (checkinData.conflict >= 4) {
      suggestion = '冲突较严重？冷静下来，尝试用「我感受」句式表达～'
    } else {
      suggestion = '关系状态不错！继续保持沟通和互动～'
    }
    
    wx.showModal({
      title: 'AI建议',
      content: suggestion,
      showCancel: false
    })
  }
})