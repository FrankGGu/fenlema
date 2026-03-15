// pages/mood/mood.js
import { formatDate, showSuccess, showError } from '../../utils/util.js'

Page({
  data: {
    // 情绪记录
    moodRecord: {
      content: '',
      emotionTags: [],
      isAnonymous: true
    },
    
    // 情绪标签选项
    emotionTags: [
      { id: 'happy', name: '开心', emoji: '😊', selected: false },
      { id: 'sad', name: '难过', emoji: '😔', selected: false },
      { id: 'angry', name: '生气', emoji: '😠', selected: false },
      { id: 'anxious', name: '焦虑', emoji: '😰', selected: false },
      { id: 'tired', name: '疲惫', emoji: '😫', selected: false },
      { id: 'confused', name: '困惑', emoji: '😕', selected: false },
      { id: 'grateful', name: '感恩', emoji: '🙏', selected: false },
      { id: 'hopeful', name: '期待', emoji: '🤗', selected: false },
      { id: 'lonely', name: '孤独', emoji: '😔', selected: false },
      { id: 'peaceful', name: '平静', emoji: '😌', selected: false }
    ],
    
    // 历史记录
    historyRecords: [],
    
    // 筛选条件
    filter: {
      tag: 'all', // all 或具体标签
      date: 'all' // all, today, week, month
    },
    
    // 加载状态
    loading: true,
    
    // 是否显示详情弹窗
    showDetailModal: false,
    selectedRecord: null,
    
    // 推荐疗愈内容
    recommendedContent: []
  },

  onLoad() {
    this.loadMoodData()
  },

  onShow() {
    this.loadHistoryRecords()
  },

  // 加载情绪数据
  loadMoodData() {
    this.loadHistoryRecords()
    this.loadRecommendedContent()
    
    this.setData({
      loading: false
    })
  },

  // 加载历史记录
  loadHistoryRecords() {
    // 模拟数据
    const records = [
      {
        id: 1,
        content: '今天工作很累，但回家看到他准备的晚餐，心里暖暖的。',
        emotionTags: ['tired', 'grateful'],
        isAnonymous: true,
        createdAt: '2025-03-14 20:30',
        formattedDate: '03-14 20:30'
      },
      {
        id: 2,
        content: '因为小事吵架了，现在有点后悔。其实不是什么大事。',
        emotionTags: ['angry', 'confused'],
        isAnonymous: true,
        createdAt: '2025-03-13 22:15',
        formattedDate: '03-13 22:15'
      },
      {
        id: 3,
        content: '一起看了喜欢的电影，感觉很幸福。',
        emotionTags: ['happy', 'peaceful'],
        isAnonymous: true,
        createdAt: '2025-03-12 21:00',
        formattedDate: '03-12 21:00'
      },
      {
        id: 4,
        content: '最近压力好大，希望他能多理解我一些。',
        emotionTags: ['anxious', 'tired'],
        isAnonymous: true,
        createdAt: '2025-03-10 19:45',
        formattedDate: '03-10 19:45'
      }
    ]
    
    this.setData({
      historyRecords: records
    })
  },

  // 加载推荐内容
  loadRecommendedContent() {
    // 模拟推荐内容
    const content = [
      {
        id: 1,
        title: '5分钟呼吸放松',
        type: 'audio',
        duration: '5分钟',
        description: '引导式呼吸练习，帮助缓解焦虑',
        reason: '检测到你可能有焦虑情绪'
      },
      {
        id: 2,
        title: '感恩练习指南',
        type: 'text',
        duration: '3分钟阅读',
        description: '学会用感恩的心态看待关系',
        reason: '检测到你有感恩情绪'
      },
      {
        id: 3,
        title: '冲突后的修复',
        type: 'card',
        duration: '2分钟',
        description: '关系修复建议卡片',
        reason: '检测到你有生气情绪'
      }
    ]
    
    this.setData({
      recommendedContent: content
    })
  },

  // 输入情绪内容
  inputContent(e) {
    this.setData({
      'moodRecord.content': e.detail.value
    })
  },

  // 选择情绪标签
  selectEmotionTag(e) {
    const tagId = e.currentTarget.dataset.id
    const { emotionTags } = this.data
    
    const updatedTags = emotionTags.map(tag => {
      if (tag.id === tagId) {
        return { ...tag, selected: !tag.selected }
      }
      return tag
    })
    
    // 获取选中的标签ID
    const selectedTagIds = updatedTags
      .filter(tag => tag.selected)
      .map(tag => tag.id)
    
    this.setData({
      emotionTags: updatedTags,
      'moodRecord.emotionTags': selectedTagIds
    })
  },

  // 切换匿名状态
  toggleAnonymous() {
    this.setData({
      'moodRecord.isAnonymous': !this.data.moodRecord.isAnonymous
    })
  },

  // 提交情绪记录
  submitMoodRecord() {
    const { moodRecord } = this.data
    
    // 验证
    if (!moodRecord.content.trim()) {
      showError('请写下你的感受')
      return
    }
    
    if (moodRecord.emotionTags.length === 0) {
      showError('请选择至少一个情绪标签')
      return
    }
    
    // 创建新记录
    const newRecord = {
      id: Date.now(),
      content: moodRecord.content,
      emotionTags: moodRecord.emotionTags,
      isAnonymous: moodRecord.isAnonymous,
      createdAt: new Date().toISOString(),
      formattedDate: formatDate(new Date(), 'MM-DD HH:mm')
    }
    
    // 添加到历史记录
    const updatedRecords = [newRecord, ...this.data.historyRecords]
    
    this.setData({
      historyRecords: updatedRecords,
      moodRecord: {
        content: '',
        emotionTags: [],
        isAnonymous: true
      },
      emotionTags: this.data.emotionTags.map(tag => ({ ...tag, selected: false }))
    })
    
    showSuccess('情绪已记录到树洞')
    
    // 更新推荐内容
    this.updateRecommendedContent(moodRecord.emotionTags)
  },

  // 更新推荐内容
  updateRecommendedContent(emotionTags) {
    // 根据情绪标签更新推荐内容
    // 这里可以调用API获取更精准的推荐
    // 暂时使用模拟数据
    this.loadRecommendedContent()
  },

  // 查看记录详情
  viewRecordDetail(e) {
    const recordId = e.currentTarget.dataset.id
    const record = this.data.historyRecords.find(r => r.id === recordId)
    
    if (!record) return
    
    // 获取选中的标签信息
    const selectedTags = this.data.emotionTags
      .filter(tag => record.emotionTags.includes(tag.id))
      .map(tag => ({
        name: tag.name,
        emoji: tag.emoji
      }))
    
    this.setData({
      showDetailModal: true,
      selectedRecord: {
        ...record,
        selectedTags
      }
    })
  },

  // 隐藏详情弹窗
  hideDetailModal() {
    this.setData({
      showDetailModal: false,
      selectedRecord: null
    })
  },

  // 删除记录
  deleteRecord() {
    const { selectedRecord } = this.data
    
    if (!selectedRecord) return
    
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条情绪记录吗？删除后无法恢复。',
      success: (res) => {
        if (res.confirm) {
          const updatedRecords = this.data.historyRecords.filter(
            r => r.id !== selectedRecord.id
          )
          
          this.setData({
            historyRecords: updatedRecords,
            showDetailModal: false,
            selectedRecord: null
          })
          
          showSuccess('记录已删除')
        }
      }
    })
  },

  // 筛选记录
  filterRecords(e) {
    const filterType = e.currentTarget.dataset.type
    const filterValue = e.currentTarget.dataset.value
    
    this.setData({
      [`filter.${filterType}`]: filterValue
    })
  },

  // 获取筛选后的记录
  getFilteredRecords() {
    const { historyRecords, filter } = this.data
    
    let filteredRecords = [...historyRecords]
    
    // 按标签筛选
    if (filter.tag !== 'all') {
      filteredRecords = filteredRecords.filter(record =>
        record.emotionTags.includes(filter.tag)
      )
    }
    
    // 按时间筛选
    if (filter.date !== 'all') {
      const now = new Date()
      let startDate = new Date()
      
      switch (filter.date) {
        case 'today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.createdAt)
        return recordDate >= startDate
      })
    }
    
    return filteredRecords
  },

  // 获取情绪统计
  getEmotionStats() {
    const { historyRecords } = this.data
    const stats = {}
    
    historyRecords.forEach(record => {
      record.emotionTags.forEach(tag => {
        if (!stats[tag]) {
          stats[tag] = 0
        }
        stats[tag]++
      })
    })
    
    return Object.entries(stats)
      .map(([tag, count]) => {
        const tagInfo = this.data.emotionTags.find(t => t.id === tag)
        return {
          tag: tag,
          name: tagInfo ? tagInfo.name : tag,
          emoji: tagInfo ? tagInfo.emoji : '❓',
          count: count,
          percentage: Math.round((count / historyRecords.length) * 100) || 0
        }
      })
      .sort((a, b) => b.count - a.count)
  },

  // 查看疗愈内容
  viewHealingContent(e) {
    const contentId = e.currentTarget.dataset.id
    const content = this.data.recommendedContent.find(c => c.id === contentId)
    
    if (!content) return
    
    wx.navigateTo({
      url: `/pages/healing/healing?contentId=${contentId}`
    })
  },

  // 导出情绪报告
  exportMoodReport() {
    wx.showToast({
      title: '报告导出功能开发中',
      icon: 'none'
    })
  },

  // 分享树洞
  shareMoodTreehole() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  // 清除筛选
  clearFilters() {
    this.setData({
      filter: {
        tag: 'all',
        date: 'all'
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadMoodData()
    wx.stopPullDownRefresh()
  }
})