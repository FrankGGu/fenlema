// pages/ai-mediation/ai-mediation.js
import { showSuccess, showError } from '../../utils/util.js'

Page({
  data: {
    // AI助手信息
    aiAssistant: {
      name: '关系小助手',
      avatar: '/images/ai-avatar.png',
      description: '专注于关系调解与情绪疏导的AI助手'
    },
    
    // 对话记录
    messages: [],
    
    // 当前对话状态
    conversationState: 'welcome', // welcome, listening, analyzing, suggesting, task_generating
    
    // 用户输入
    userInput: '',
    
    // 矛盾类型选项
    conflictTypes: [
      { id: 'cold_war', name: '冷战', icon: '❄️', selected: false },
      { id: 'misunderstanding', name: '误解', icon: '❓', selected: false },
      { id: 'trust_issue', name: '信任问题', icon: '🔒', selected: false },
      { id: 'lack_communication', name: '沟通不足', icon: '💬', selected: false },
      { id: 'reality_pressure', name: '现实压力', icon: '🏠', selected: false }
    ],
    
    // AI建议
    aiSuggestions: [],
    
    // 生成的修复任务
    generatedTasks: [],
    
    // 是否正在处理
    processing: false,
    
    // 是否已完成调解
    mediationCompleted: false
  },

  onLoad() {
    this.initConversation()
  },

  // 初始化对话
  initConversation() {
    const welcomeMessages = [
      {
        id: 1,
        type: 'ai',
        content: '你好，我是关系小助手。我注意到你们最近的关系状态有些波动，需要我的帮助吗？',
        time: '刚刚'
      },
      {
        id: 2,
        type: 'ai',
        content: '我会先倾听你的感受，然后分析问题，最后提供一些温和的建议。请放心，这里没有评判，只有理解和支持。',
        time: '刚刚'
      }
    ]
    
    this.setData({
      messages: welcomeMessages,
      conversationState: 'welcome'
    })
  },

  // 发送消息
  sendMessage() {
    const { userInput, processing } = this.data
    
    if (!userInput.trim() || processing) {
      return
    }
    
    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput,
      time: '刚刚'
    }
    
    this.setData({
      messages: [...this.data.messages, userMessage],
      userInput: '',
      processing: true
    })
    
    // 滚动到底部
    this.scrollToBottom()
    
    // AI回复
    setTimeout(() => {
      this.aiReply(userInput)
    }, 800)
  },

  // AI回复
  aiReply(userInput) {
    const { conversationState } = this.data
    let aiMessage = null
    
    switch (conversationState) {
      case 'welcome':
        aiMessage = this.getWelcomeReply(userInput)
        break
      case 'listening':
        aiMessage = this.getListeningReply(userInput)
        break
      case 'analyzing':
        aiMessage = this.getAnalyzingReply(userInput)
        break
      default:
        aiMessage = this.getDefaultReply(userInput)
    }
    
    if (aiMessage) {
      this.setData({
        messages: [...this.data.messages, aiMessage],
        processing: false
      })
      
      this.scrollToBottom()
      
      // 更新对话状态
      if (aiMessage.nextState) {
        setTimeout(() => {
          this.setData({
            conversationState: aiMessage.nextState
          })
        }, 500)
      }
    }
  },

  // 欢迎阶段回复
  getWelcomeReply(input) {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('需要') || lowerInput.includes('帮助') || lowerInput.includes('好的')) {
      return {
        id: Date.now(),
        type: 'ai',
        content: '感谢你的信任。首先，请告诉我你现在的感受如何？可以描述一下最近让你困扰的事情。',
        time: '刚刚',
        nextState: 'listening'
      }
    } else if (lowerInput.includes('不用') || lowerInput.includes('暂时')) {
      return {
        id: Date.now(),
        type: 'ai',
        content: '好的，我理解。当你需要帮助的时候，我随时在这里。记住，寻求帮助是勇敢的表现。',
        time: '刚刚'
      }
    } else {
      return {
        id: Date.now(),
        type: 'ai',
        content: '我理解你可能有些犹豫。没关系，我们可以慢慢来。你愿意和我聊聊现在的感受吗？',
        time: '刚刚',
        nextState: 'listening'
      }
    }
  },

  // 倾听阶段回复
  getListeningReply(input) {
    // 分析情绪关键词
    const positiveWords = ['开心', '高兴', '幸福', '满意', '温暖']
    const negativeWords = ['难过', '伤心', '失望', '生气', '委屈', '压力', '累']
    const conflictWords = ['吵架', '争执', '冲突', '矛盾', '分歧']
    
    let emotionType = 'neutral'
    let hasConflict = false
    
    negativeWords.forEach(word => {
      if (input.includes(word)) emotionType = 'negative'
    })
    
    positiveWords.forEach(word => {
      if (input.includes(word)) emotionType = 'positive'
    })
    
    conflictWords.forEach(word => {
      if (input.includes(word)) hasConflict = true
    })
    
    let reply = ''
    
    if (emotionType === 'negative') {
      reply = '听起来你现在有些难过或困扰，我完全理解这种感受。在关系中感到不适是很正常的。'
    } else if (emotionType === 'positive') {
      reply = '很高兴听到你有一些积极的感受。不过既然你来找我，可能还是有些地方需要调整？'
    } else {
      reply = '感谢你分享这些。我注意到你在描述时很平静，这很好。'
    }
    
    if (hasConflict) {
      reply += '\n\n我注意到你们之间可能有一些冲突或分歧。这其实是关系中很常见的部分。'
    }
    
    reply += '\n\n基于你的描述，你觉得主要的问题属于以下哪种类型呢？'
    
    return {
      id: Date.now(),
      type: 'ai',
      content: reply,
      time: '刚刚',
      nextState: 'analyzing',
      showConflictTypes: true
    }
  },

  // 分析阶段回复
  getAnalyzingReply(input) {
    // 这里应该根据用户选择的矛盾类型来回复
    // 暂时使用通用回复
    return {
      id: Date.now(),
      type: 'ai',
      content: '我明白了。基于你的描述，这看起来像是一个典型的「沟通不足」问题。让我为你分析一下...',
      time: '刚刚',
      nextState: 'suggesting'
    }
  },

  // 默认回复
  getDefaultReply(input) {
    const replies = [
      '我理解你的感受。在关系中，沟通和理解是最重要的桥梁。',
      '每个人在关系中都会遇到挑战，这恰恰是成长的机会。',
      '感谢你愿意分享这些。你的感受很重要，也值得被认真对待。',
      '有时候，只是被倾听和理解，就能让心情好很多。',
      '关系就像花园，需要定期浇水和照料。你们已经在做这件事了，这很棒。'
    ]
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)]
    
    return {
      id: Date.now(),
      type: 'ai',
      content: randomReply,
      time: '刚刚'
    }
  },

  // 选择矛盾类型
  selectConflictType(e) {
    const typeId = e.currentTarget.dataset.id
    const { conflictTypes } = this.data
    
    const updatedTypes = conflictTypes.map(type => ({
      ...type,
      selected: type.id === typeId
    }))
    
    this.setData({
      conflictTypes: updatedTypes,
      conversationState: 'suggesting'
    })
    
    // 显示AI分析
    setTimeout(() => {
      this.showAIAnalysis(typeId)
    }, 500)
  },

  // 显示AI分析
  showAIAnalysis(conflictTypeId) {
    const conflictMap = {
      cold_war: {
        name: '冷战',
        analysis: '冷战通常源于未解决的冲突或积累的情绪。双方可能因为害怕冲突升级而选择沉默，但沉默往往会让问题更复杂。',
        suggestion: '建议从小的沟通开始，比如发一条关心的消息，或者写一张表达感受的纸条。'
      },
      misunderstanding: {
        name: '误解',
        analysis: '误解常常源于沟通不畅或假设错误。我们容易用自己的角度理解对方的行为，而忽略了对方的真实意图。',
        suggestion: '尝试用「我感受」句式表达，而不是指责对方。例如：「当...的时候，我感到...」'
      },
      trust_issue: {
        name: '信任问题',
        analysis: '信任是关系的基石，一旦受损，需要时间和一致的行为来重建。信任问题可能源于过去的经历或当前的边界不清。',
        suggestion: '建立透明的沟通机制，分享日常点滴，逐步重建信任。小承诺的兑现很重要。'
      },
      lack_communication: {
        name: '沟通不足',
        analysis: '现代生活节奏快，容易忽略深度沟通。但缺乏沟通会让双方渐行渐远，产生孤独感。',
        suggestion: '约定每日的「专属沟通时间」，哪怕只有15分钟，专心倾听对方。'
      },
      reality_pressure: {
        name: '现实压力',
        analysis: '工作、经济、家庭等现实压力会影响关系。压力下容易情绪化，把压力发泄在最亲近的人身上。',
        suggestion: '共同面对压力，制定实际可行的解决方案。明确分工，互相支持。'
      }
    }
    
    const conflict = conflictMap[conflictTypeId] || conflictMap.lack_communication
    
    const analysisMessage = {
      id: Date.now(),
      type: 'ai',
      content: `【${conflict.name}分析】\n\n${conflict.analysis}\n\n${conflict.suggestion}`,
      time: '刚刚'
    }
    
    this.setData({
      messages: [...this.data.messages, analysisMessage],
      conversationState: 'task_generating'
    })
    
    this.scrollToBottom()
    
    // 生成修复任务
    setTimeout(() => {
      this.generateRepairTasks(conflictTypeId)
    }, 1000)
  },

  // 生成修复任务
  generateRepairTasks(conflictTypeId) {
    const taskMap = {
      cold_war: [
        { title: '主动破冰', description: '主动发送一条关心消息，打破沉默', duration: '今天内' },
        { title: '表达感受', description: '用非指责的方式表达自己的感受', duration: '今天内' },
        { title: '约定沟通', description: '约定一个时间好好聊聊', duration: '3天内' }
      ],
      misunderstanding: [
        { title: '澄清误会', description: '找一个安静的时间澄清之前的误会', duration: '今天内' },
        { title: '换位思考', description: '尝试从对方角度理解事情', duration: '今天内' },
        { title: '避免假设', description: '遇到不确定的事情先询问，不假设', duration: '长期' }
      ],
      trust_issue: [
        { title: '分享日常', description: '今天主动分享三件日常小事', duration: '今天内' },
        { title: '兑现小承诺', description: '兑现一个之前答应的小事情', duration: '今天内' },
        { title: '建立边界', description: '讨论并明确彼此的边界', duration: '3天内' }
      ],
      lack_communication: [
        { title: '十分钟倾听', description: '专心倾听伴侣说话十分钟，不打断', duration: '今天内' },
        { title: '分享感受', description: '分享一件今天让你开心或难过的事', duration: '今天内' },
        { title: '制定沟通时间', description: '制定每天的专属沟通时间', duration: '3天内' }
      ],
      reality_pressure: [
        { title: '共同规划', description: '一起制定一个应对压力的计划', duration: '今天内' },
        { title: '互相支持', description: '为对方做一件减轻压力的小事', duration: '今天内' },
        { title: '放松时间', description: '安排一个共同放松的时间', duration: '3天内' }
      ]
    }
    
    const tasks = taskMap[conflictTypeId] || taskMap.lack_communication
    
    const taskMessage = {
      id: Date.now(),
      type: 'ai',
      content: '基于分析，我为你生成了一些修复任务。这些是温和的小步骤，可以帮助改善关系：',
      time: '刚刚',
      showTasks: true,
      tasks: tasks
    }
    
    this.setData({
      messages: [...this.data.messages, taskMessage],
      generatedTasks: tasks,
      mediationCompleted: true
    })
    
    this.scrollToBottom()
  },

  // 输入框输入
  onInput(e) {
    this.setData({
      userInput: e.detail.value
    })
  },

  // 快速回复
  quickReply(e) {
    const replyText = e.currentTarget.dataset.text
    
    this.setData({
      userInput: replyText
    }, () => {
      this.sendMessage()
    })
  },

  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 99999,
        duration: 300
      })
    }, 100)
  },

  // 接受任务
  acceptTasks() {
    const app = getApp()
    const { generatedTasks } = this.data
    
    // 将任务添加到全局任务列表
    generatedTasks.forEach(task => {
      const newTask = {
        id: Date.now() + Math.random(),
        title: task.title,
        description: task.description,
        duration: task.duration,
        status: 'pending'
      }
      
      app.globalData.tasks.push(newTask)
    })
    
    wx.setStorageSync('tasks', app.globalData.tasks)
    
    showSuccess('任务已添加到你的待办列表')
    
    // 跳转到任务页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/task/task'
      })
    }, 1500)
  },

  // 重新开始
  restartConversation() {
    this.initConversation()
    this.setData({
      conflictTypes: this.data.conflictTypes.map(type => ({ ...type, selected: false })),
      aiSuggestions: [],
      generatedTasks: [],
      mediationCompleted: false,
      processing: false
    })
  },

  // 分享对话
  shareConversation() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  // 保存对话
  saveConversation() {
    showSuccess('对话已保存到本地')
  }
})