// pages/task/task.js
import { formatDate, showSuccess, showError } from '../../utils/util.js'

Page({
  data: {
    // 任务筛选
    filter: 'all', // all, pending, in_progress, completed
    
    // 任务列表
    tasks: [],
    
    // 任务统计
    stats: {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      completionRate: 0
    },
    
    // 推荐任务
    recommendedTasks: [],
    
    // 加载状态
    loading: true,
    
    // 是否显示新建任务弹窗
    showCreateModal: false,
    newTask: {
      title: '',
      description: '',
      deadline: '',
      type: 'other'
    },
    
    // 任务类型选项
    taskTypes: [
      { value: 'listen', label: '倾听', icon: '👂' },
      { value: 'thanks', label: '感谢', icon: '🙏' },
      { value: 'agreement', label: '约定', icon: '🤝' },
      { value: 'memory', label: '回忆', icon: '📸' },
      { value: 'other', label: '其他', icon: '📝' }
    ]
  },

  onLoad() {
    this.loadTaskData()
  },

  onShow() {
    this.loadTasks()
  },

  // 加载任务数据
  loadTaskData() {
    this.loadTasks()
    this.loadRecommendedTasks()
    this.calculateStats()
    
    this.setData({
      loading: false
    })
  },

  // 加载任务列表
  loadTasks() {
    const app = getApp()
    const tasks = app.globalData.tasks || []
    
    // 格式化任务数据
    const formattedTasks = tasks.map(task => ({
      ...task,
      formattedDeadline: task.deadline ? formatDate(task.deadline, 'MM-DD HH:mm') : '无期限',
      typeIcon: this.getTypeIcon(task.type),
      typeColor: this.getTypeColor(task.type),
      overdue: this.isOverdue(task)
    }))
    
    this.setData({
      tasks: formattedTasks
    })
    
    this.calculateStats()
  },

  // 加载推荐任务
  loadRecommendedTasks() {
    // 模拟推荐任务
    const recommendations = [
      {
        id: 'rec1',
        title: '十分钟倾听',
        description: '专心倾听伴侣说话十分钟，不打断',
        type: 'listen',
        reason: '基于最近的沟通评分较低'
      },
      {
        id: 'rec2',
        title: '写一句感谢',
        description: '写下一句感谢伴侣的话',
        type: 'thanks',
        reason: '提升关系温度'
      },
      {
        id: 'rec3',
        title: '共同约定',
        description: '约定一个每周的固定活动',
        type: 'agreement',
        reason: '增加共同相处时间'
      }
    ]
    
    this.setData({
      recommendedTasks: recommendations
    })
  },

  // 计算统计信息
  calculateStats() {
    const { tasks } = this.data
    
    const total = tasks.length
    const pending = tasks.filter(t => t.status === 'pending').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const completed = tasks.filter(t => t.status === 'completed').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    this.setData({
      stats: {
        total,
        pending,
        inProgress,
        completed,
        completionRate
      }
    })
  },

  // 获取任务类型图标
  getTypeIcon(type) {
    const iconMap = {
      listen: '👂',
      thanks: '🙏',
      agreement: '🤝',
      memory: '📸',
      other: '📝'
    }
    return iconMap[type] || '📝'
  },

  // 获取任务类型颜色
  getTypeColor(type) {
    const colorMap = {
      listen: '#6B8BFF',
      thanks: '#FFB86B',
      agreement: '#6BFF8B',
      memory: '#FF6B8B',
      other: '#999999'
    }
    return colorMap[type] || '#999999'
  },

  // 检查任务是否过期
  isOverdue(task) {
    if (!task.deadline || task.status === 'completed') return false
    
    const now = new Date()
    const deadline = new Date(task.deadline)
    return now > deadline
  },

  // 筛选任务
  filterTasks(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ filter })
  },

  // 获取筛选后的任务
  getFilteredTasks() {
    const { tasks, filter } = this.data
    
    if (filter === 'all') {
      return tasks
    }
    
    return tasks.filter(task => {
      if (filter === 'pending') return task.status === 'pending' && !task.overdue
      if (filter === 'overdue') return task.overdue
      if (filter === 'in_progress') return task.status === 'in_progress'
      if (filter === 'completed') return task.status === 'completed'
      return true
    })
  },

  // 开始任务
  startTask(e) {
    const taskId = e.currentTarget.dataset.id
    const app = getApp()
    
    const task = app.globalData.tasks.find(t => t.id === taskId)
    if (!task) {
      showError('任务不存在')
      return
    }
    
    if (task.status === 'in_progress') {
      showError('任务已在进行中')
      return
    }
    
    if (task.status === 'completed') {
      showError('任务已完成')
      return
    }
    
    wx.showModal({
      title: '开始任务',
      content: '确定要开始这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          task.status = 'in_progress'
          task.startedAt = new Date().toISOString()
          wx.setStorageSync('tasks', app.globalData.tasks)
          
          showSuccess('任务已开始')
          this.loadTasks()
        }
      }
    })
  },

  // 完成任务
  completeTask(e) {
    const taskId = e.currentTarget.dataset.id
    const app = getApp()
    
    const task = app.globalData.tasks.find(t => t.id === taskId)
    if (!task) {
      showError('任务不存在')
      return
    }
    
    if (task.status === 'completed') {
      showError('任务已完成')
      return
    }
    
    wx.showModal({
      title: '完成任务',
      content: '请简要描述你是如何完成这个任务的（可选）',
      editable: true,
      placeholderText: '例如：我们认真地聊了十分钟...',
      success: (res) => {
        if (res.confirm) {
          task.status = 'completed'
          task.completedAt = new Date().toISOString()
          task.completedNote = res.content || ''
          wx.setStorageSync('tasks', app.globalData.tasks)
          
          // 更新关系温度
          app.updateTemperature(5)
          
          showSuccess('任务完成！关系温度+5')
          this.loadTasks()
        }
      }
    })
  },

  // 放弃任务
  abandonTask(e) {
    const taskId = e.currentTarget.dataset.id
    const app = getApp()
    
    wx.showModal({
      title: '放弃任务',
      content: '确定要放弃这个任务吗？连续放弃任务可能会影响关系温度。',
      success: (res) => {
        if (res.confirm) {
          // 从任务列表中移除
          const index = app.globalData.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            app.globalData.tasks.splice(index, 1)
            wx.setStorageSync('tasks', app.globalData.tasks)
            
            showSuccess('任务已放弃')
            this.loadTasks()
          }
        }
      }
    })
  },

  // 查看任务详情
  viewTaskDetail(e) {
    const taskId = e.currentTarget.dataset.id
    const task = this.data.tasks.find(t => t.id === taskId)
    
    if (!task) return
    
    let content = `
任务：${task.title}
描述：${task.description}
状态：${task.status === 'pending' ? '待完成' : task.status === 'in_progress' ? '进行中' : '已完成'}
    `.trim()
    
    if (task.deadline) {
      content += `\n截止：${task.formattedDeadline}`
    }
    
    if (task.overdue) {
      content += '\n\n⚠️ 任务已过期'
    }
    
    if (task.completedNote) {
      content += `\n\n完成记录：${task.completedNote}`
    }
    
    wx.showModal({
      title: '任务详情',
      content: content,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 接受推荐任务
  acceptRecommendedTask(e) {
    const taskId = e.currentTarget.dataset.id
    const recommendedTask = this.data.recommendedTasks.find(t => t.id === taskId)
    
    if (!recommendedTask) {
      showError('任务不存在')
      return
    }
    
    const app = getApp()
    const newTask = {
      id: Date.now(),
      title: recommendedTask.title,
      description: recommendedTask.description,
      type: recommendedTask.type,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    app.globalData.tasks.push(newTask)
    wx.setStorageSync('tasks', app.globalData.tasks)
    
    showSuccess('任务已添加到待办列表')
    this.loadTasks()
  },

  // 显示创建任务弹窗
  showCreateTaskModal() {
    this.setData({
      showCreateModal: true,
      newTask: {
        title: '',
        description: '',
        deadline: '',
        type: 'other'
      }
    })
  },

  // 隐藏创建任务弹窗
  hideCreateTaskModal() {
    this.setData({ showCreateModal: false })
  },

  // 输入任务标题
  inputTaskTitle(e) {
    this.setData({
      'newTask.title': e.detail.value
    })
  },

  // 输入任务描述
  inputTaskDescription(e) {
    this.setData({
      'newTask.description': e.detail.value
    })
  },

  // 选择任务类型
  selectTaskType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      'newTask.type': type
    })
  },

  // 选择截止日期
  selectDeadline() {
    wx.showDatePicker({
      currentDate: new Date(),
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      success: (res) => {
        const date = new Date(res.year, res.month, res.day)
        this.setData({
          'newTask.deadline': date.toISOString()
        })
      }
    })
  },

  // 创建任务
  createTask() {
    const { newTask } = this.data
    
    if (!newTask.title.trim()) {
      showError('请输入任务标题')
      return
    }
    
    if (!newTask.description.trim()) {
      showError('请输入任务描述')
      return
    }
    
    const app = getApp()
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      deadline: newTask.deadline || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    app.globalData.tasks.push(task)
    wx.setStorageSync('tasks', app.globalData.tasks)
    
    showSuccess('任务创建成功')
    this.hideCreateTaskModal()
    this.loadTasks()
  },

  // 分享任务
  shareTask(e) {
    const taskId = e.currentTarget.dataset.id
    const task = this.data.tasks.find(t => t.id === taskId)
    
    if (!task) return
    
    wx.showShareMenu({
      withShareTicket: true,
      title: `一起完成：${task.title}`,
      path: `/pages/task/task?taskId=${taskId}`
    })
  },

  // 导出任务报告
  exportTaskReport() {
    wx.showToast({
      title: '报告导出功能开发中',
      icon: 'none'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadTaskData()
    wx.stopPullDownRefresh()
  }
})