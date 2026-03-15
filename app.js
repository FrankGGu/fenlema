// app.js
App({
  globalData: {
    userInfo: null,
    relationship: null,
    checkinToday: false,
    temperature: 75,
    continuousDays: 0,
    warnings: [],
    tasks: [],
    // 模拟数据
    mockData: {
      user: {
        id: 1,
        nickname: '小明',
        avatar: '/images/ai-avatar.png'
      },
      partner: {
        id: 2,
        nickname: '小红',
        avatar: '/images/ai-avatar.png'
      },
      relationship: {
        id: 1,
        startDate: '2025-01-01',
        temperature: 75,
        continuousDays: 7,
        status: 1 // 1正常 2预警 3断开
      },
      todayCheckin: {
        mood: 4,
        communication: 3,
        intimacy: 4,
        conflict: 1,
        note: ''
      },
      warnings: [
        { id: 1, type: '漏打卡', level: '轻提醒', date: '2025-03-14', handled: false }
      ],
      tasks: [
        { id: 1, title: '认真倾听10分钟', description: '今天找个时间，专心倾听伴侣说话10分钟', status: 'pending' },
        { id: 2, title: '写一句感谢', description: '写下一句感谢伴侣的话', status: 'completed' }
      ]
    }
  },

  onLaunch() {
    // 初始化云开发（如需）
    // wx.cloud.init()
    
    // 检查登录状态
    this.checkLoginStatus()
    
    // 获取设备信息（兼容 HarmonyOS）
    wx.getDeviceInfo({
      success: res => {
        this.globalData.deviceInfo = res
      },
      fail: (err) => {
        console.warn('获取设备信息失败:', err)
        // 降级处理
        this.globalData.deviceInfo = {
          platform: 'unknown',
          system: 'unknown'
        }
      }
    })
  },

  checkLoginStatus() {
    // 模拟登录状态
    const userInfo = wx.getStorageSync('userInfo')

    const normalizeAvatar = (avatar) => {
      if (avatar && avatar.startsWith('/')) return avatar
      return '/images/ai-avatar.png'
    }

    if (userInfo) {
      // 兼容旧缓存中的示例头像
      this.globalData.userInfo = {
        ...userInfo,
        avatar: normalizeAvatar(userInfo.avatar)
      }
      wx.setStorageSync('userInfo', this.globalData.userInfo)
      // 获取关系状态
      this.fetchRelationship()
    } else {
      // 未登录，跳转到登录页（实际开发中可能需要微信授权）
      // 这里先模拟用户信息，并初始化关系数据
      this.globalData.userInfo = {
        ...this.globalData.mockData.user,
        avatar: normalizeAvatar(this.globalData.mockData.user.avatar)
      }
      wx.setStorageSync('userInfo', this.globalData.userInfo)
      // 初始化关系数据
      this.fetchRelationship()
    }
  },

  fetchRelationship() {
    // 模拟获取关系数据
    this.globalData.relationship = this.globalData.mockData.relationship
    this.globalData.temperature = this.globalData.relationship.temperature
    this.globalData.continuousDays = this.globalData.relationship.continuousDays
    this.globalData.warnings = this.globalData.mockData.warnings
    this.globalData.tasks = this.globalData.mockData.tasks
    
    // 检查今日是否已打卡
    const today = new Date().toISOString().split('T')[0]
    const lastCheckinDate = this.globalData.relationship.lastCheckinDate
    this.globalData.checkinToday = lastCheckinDate === today
  },

  // 更新关系温度
  updateTemperature(delta) {
    const newTemp = this.globalData.temperature + delta
    this.globalData.temperature = Math.max(0, Math.min(100, newTemp))
    return this.globalData.temperature
  },

  // 添加预警
  addWarning(warning) {
    this.globalData.warnings.unshift(warning)
    wx.setStorageSync('warnings', this.globalData.warnings)
  },

  // 完成任务
  completeTask(taskId) {
    const task = this.globalData.tasks.find(t => t.id === taskId)
    if (task) {
      task.status = 'completed'
      task.completedAt = new Date().toISOString()
      wx.setStorageSync('tasks', this.globalData.tasks)
      // 完成任务后温度提升
      this.updateTemperature(5)
    }
  },

  // 提交打卡
  submitCheckin(data) {
    // 确保关系数据已初始化
    if (!this.globalData.relationship) {
      this.fetchRelationship()
    }

    // 模拟提交打卡
    const checkin = {
      ...data,
      date: new Date().toISOString().split('T')[0],
      id: Date.now()
    }
    
    // 更新连续打卡天数
    const lastCheckinDate = this.globalData.relationship.lastCheckinDate
    const today = new Date().toISOString().split('T')[0]
    if (lastCheckinDate === today) {
      // 今日已打卡，不增加
    } else {
      this.globalData.continuousDays += 1
    }
    
    // 更新最后打卡日期
    this.globalData.relationship.lastCheckinDate = today
    this.globalData.checkinToday = true
    
    // 根据打卡数据更新温度
    const tempDelta = this.calculateTemperatureDelta(data)
    this.updateTemperature(tempDelta)
    
    // 检查是否需要预警
    this.checkWarning(data)
    
    // 保存到本地
    wx.setStorageSync('lastCheckin', checkin)
    wx.setStorageSync('continuousDays', this.globalData.continuousDays)
    wx.setStorageSync('temperature', this.globalData.temperature)
    
    return checkin
  },

  // 计算温度变化
  calculateTemperatureDelta(checkinData) {
    let delta = 0
    // 心情权重
    delta += (checkinData.mood - 3) * 2
    // 沟通权重
    delta += (checkinData.communication - 3) * 2
    // 亲密度权重
    delta += (checkinData.intimacy - 3) * 3
    // 冲突负权重
    delta -= (checkinData.conflict - 1) * 5
    return delta
  },

  // 检查预警
  checkWarning(checkinData) {
    const warnings = []
    
    // 检查漏打卡（由定时任务检查）
    // 检查低评分
    if (checkinData.mood <= 2 || checkinData.communication <= 2 || checkinData.intimacy <= 2) {
      warnings.push({
        type: '低评分',
        level: '轻提醒',
        reason: '今日评分较低，请注意沟通'
      })
    }
    
    // 检查冲突
    if (checkinData.conflict >= 4) {
      warnings.push({
        type: '冲突升级',
        level: '中预警',
        reason: '今日冲突评分较高，建议冷静沟通'
      })
    }
    
    warnings.forEach(warning => {
      this.addWarning({
        ...warning,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        handled: false
      })
    })
  },

  // 获取AI调解建议
  getAIMediationSuggestion(conflictType) {
    const suggestions = {
      '冷战': '建议双方先冷静下来，通过文字表达感受，避免面对面冲突。',
      '误解': '尝试换位思考，明确表达自己的需求，同时倾听对方的解释。',
      '信任问题': '建立透明沟通机制，分享日常点滴，逐步重建信任。',
      '沟通不足': '约定每日固定沟通时间，分享彼此的感受和想法。',
      '现实压力': '共同面对压力，制定实际可行的解决方案，互相支持。'
    }
    return suggestions[conflictType] || '建议双方平心静气地沟通，表达真实感受。'
  },

  // 生成修复任务
  generateRepairTask(conflictType) {
    const tasks = {
      '冷战': {
        title: '主动破冰',
        description: '主动发送一条关心消息，打破沉默'
      },
      '误解': {
        title: '澄清误会',
        description: '找一个安静的时间，澄清之前的误会'
      },
      '信任问题': {
        title: '分享日常',
        description: '今天主动分享三件日常小事'
      },
      '沟通不足': {
        title: '十分钟倾听',
        description: '专心倾听伴侣说话十分钟，不打断'
      },
      '现实压力': {
        title: '共同规划',
        description: '一起制定一个应对压力的计划'
      }
    }
    return tasks[conflictType] || {
      title: '表达感谢',
      description: '写下一句感谢伴侣的话'
    }
  }
})