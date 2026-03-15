// pages/healing/healing.js
import { showSuccess, showError } from '../../utils/util.js'

Page({
  data: {
    // 疗愈内容列表
    healingList: [],
    
    // 筛选类型
    selectedType: 'all',
    
    // 类型选项
    typeOptions: [
      { id: 'all', name: '全部', icon: '📚' },
      { id: 'audio', name: '音频', icon: '🎵' },
      { id: 'article', name: '文章', icon: '📰' },
      { id: 'card', name: '卡片', icon: '💳' },
      { id: 'exercise', name: '练习', icon: '🧘' }
    ],
    
    // 加载状态
    loading: true,
    
    // 当前播放的音频
    currentPlayingAudio: null,
    
    // 当前阅读的文章
    currentReadingArticle: null
  },

  onLoad() {
    this.loadHealingContent()
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadHealingContent()
  },

  // 加载疗愈内容
  loadHealingContent() {
    // 模拟加载数据
    setTimeout(() => {
      // 从模拟数据获取内容
      const mockData = require('../../utils/mock-data.js')
      const healingContent = mockData.mockHealingContent || []
      
      // 格式化数据
      const formattedContent = healingContent.map(item => ({
        ...item,
        icon: this.getTypeIcon(item.type),
        color: this.getTypeColor(item.type),
        completed: false,
        progress: 0
      }))
      
      this.setData({
        healingList: formattedContent,
        loading: false
      })
    }, 500)
  },

  // 切换类型
  switchType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      selectedType: type
    })
  },

  // 获取类型图标
  getTypeIcon(type) {
    const iconMap = {
      'audio': '🎵',
      'article': '📰',
      'card': '💳',
      'exercise': '🧘'
    }
    return iconMap[type] || '📚'
  },

  // 获取类型颜色
  getTypeColor(type) {
    const colorMap = {
      'audio': '#6B8BFF',
      'article': '#FFB86B',
      'card': '#FF6B8B',
      'exercise': '#6BFF8B'
    }
    return colorMap[type] || '#999999'
  },

  // 获取筛选后的内容
  getFilteredContent() {
    const { healingList, selectedType } = this.data
    
    if (selectedType === 'all') {
      return healingList
    }
    
    return healingList.filter(item => item.type === selectedType)
  },

  // 播放音频
  playAudio(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.healingList.find(item => item.id === id)
    
    if (!item || item.type !== 'audio') return
    
    // 模拟播放音频
    this.setData({
      currentPlayingAudio: id
    })
    
    wx.showToast({
      title: '开始播放：' + item.title,
      icon: 'none',
      duration: 2000
    })
    
    // 模拟播放进度
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress > 100) {
        progress = 100
        clearInterval(interval)
        
        // 标记为已完成
        const updatedList = this.data.healingList.map(listItem => {
          if (listItem.id === id) {
            return { ...listItem, completed: true, progress: 100 }
          }
          return listItem
        })
        
        this.setData({
          healingList: updatedList,
          currentPlayingAudio: null
        })
        
        showSuccess('音频播放完成')
      } else {
        const updatedList = this.data.healingList.map(listItem => {
          if (listItem.id === id) {
            return { ...listItem, progress }
          }
          return listItem
        })
        
        this.setData({
          healingList: updatedList
        })
      }
    }, 500)
  },

  // 阅读文章
  readArticle(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.healingList.find(item => item.id === id)
    
    if (!item || item.type !== 'article') return
    
    this.setData({
      currentReadingArticle: id
    })
    
    // 显示文章内容
    wx.showModal({
      title: item.title,
      content: item.description + '\n\n' + (item.content || '文章内容加载中...'),
      showCancel: false,
      confirmText: '已阅读',
      success: (res) => {
        if (res.confirm) {
          // 标记为已阅读
          const updatedList = this.data.healingList.map(listItem => {
            if (listItem.id === id) {
              return { ...listItem, completed: true }
            }
            return listItem
          })
          
          this.setData({
            healingList: updatedList,
            currentReadingArticle: null
          })
          
          showSuccess('文章已阅读')
        }
      }
    })
  },

  // 完成卡片
  completeCard(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.healingList.find(item => item.id === id)
    
    if (!item || item.type !== 'card') return
    
    wx.showModal({
      title: item.title,
      content: item.content || '卡片内容',
      showCancel: true,
      confirmText: '已完成',
      cancelText: '稍后',
      success: (res) => {
        if (res.confirm) {
          const updatedList = this.data.healingList.map(listItem => {
            if (listItem.id === id) {
              return { ...listItem, completed: true }
            }
            return listItem
          })
          
          this.setData({
            healingList: updatedList
          })
          
          showSuccess('卡片任务已完成')
        }
      }
    })
  },

  // 开始练习
  startExercise(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.healingList.find(item => item.id === id)
    
    if (!item || item.type !== 'exercise') return
    
    wx.showModal({
      title: '开始练习',
      content: `准备开始「${item.title}」\n\n时长：${item.duration}\n\n${item.description}`,
      confirmText: '开始',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 模拟练习过程
          wx.showLoading({
            title: '练习中...',
          })
          
          setTimeout(() => {
            wx.hideLoading()
            
            const updatedList = this.data.healingList.map(listItem => {
              if (listItem.id === id) {
                return { ...listItem, completed: true }
              }
              return listItem
            })
            
            this.setData({
              healingList: updatedList
            })
            
            showSuccess('练习完成，感觉好多了！')
          }, 3000)
        }
      }
    })
  },

  // 查看详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.healingList.find(item => item.id === id)
    
    if (!item) return
    
    let content = `标题：${item.title}\n\n`
    content += `类型：${item.type === 'audio' ? '音频' : item.type === 'article' ? '文章' : item.type === 'card' ? '卡片' : '练习'}\n`
    
    if (item.description) {
      content += `描述：${item.description}\n`
    }
    
    if (item.duration) {
      content += `时长：${item.duration}\n`
    }
    
    if (item.category) {
      content += `分类：${item.category}\n`
    }
    
    content += `\n状态：${item.completed ? '✅ 已完成' : '⏳ 未开始'}`
    
    wx.showModal({
      title: '内容详情',
      content: content,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 收藏内容
  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id
    const updatedList = this.data.healingList.map(item => {
      if (item.id === id) {
        return { ...item, favorite: !item.favorite }
      }
      return item
    })
    
    this.setData({
      healingList: updatedList
    })
    
    const item = updatedList.find(item => item.id === id)
    if (item.favorite) {
      showSuccess('已收藏')
    } else {
      showSuccess('已取消收藏')
    }
  },

  // 分享内容
  shareContent(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.healingList.find(item => item.id === id)
    
    if (!item) return
    
    wx.showShareMenu({
      withShareTicket: true,
      title: `分享疗愈内容：${item.title}`,
      path: `/pages/healing/healing?id=${id}`
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadHealingContent()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // 分享页面
  onShareAppMessage() {
    return {
      title: '关系疗愈内容',
      path: '/pages/healing/healing'
    }
  }
})