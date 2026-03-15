// utils/mock-data.js
/**
 * 模拟数据生成器
 */

// 用户信息
export const mockUser = {
  id: 1,
  nickname: '小明',
  avatar: '/images/avatar-default.png',
  gender: 'male',
  birthday: '1995-05-20',
  relationshipStatus: 'in_relationship',
  joinDate: '2025-01-01'
};

// 伴侣信息
export const mockPartner = {
  id: 2,
  nickname: '小红',
  avatar: '/images/avatar-partner.png',
  gender: 'female',
  birthday: '1996-08-15',
  lastCheckin: new Date().toISOString(),
  checkinRate: 92,
  moodAvg: 7.8
};

// 关系信息
export const mockRelationship = {
  id: 1,
  startDate: '2025-01-01',
  days: 128,
  temperature: 75,
  temperatureLevel: 'good',
  continuousDays: 45,
  status: 'normal', // normal, warning, critical
  lastCheckinDate: new Date().toISOString().split('T')[0],
  checkinHistory: generateCheckinHistory(30)
};

// 打卡数据
export const mockCheckin = {
  id: Date.now(),
  date: new Date().toISOString().split('T')[0],
  mood: 4,
  communication: 3,
  intimacy: 4,
  conflict: 1,
  note: '今天一起吃了晚餐，聊得很开心',
  completed: true,
  partnerCheckin: {
    mood: 5,
    communication: 4,
    intimacy: 4,
    conflict: 0,
    note: '今天很开心'
  }
};

// 预警数据
export const mockWarnings = [
  {
    id: 1,
    type: 'missed_checkin',
    level: 'light',
    title: '漏打卡提醒',
    description: '您昨天未进行关系打卡',
    date: '2025-03-14',
    handled: false,
    action: '立即补卡'
  },
  {
    id: 2,
    type: 'low_score',
    level: 'medium',
    title: '低评分预警',
    description: '连续2天沟通评分较低',
    date: '2025-03-13',
    handled: true,
    action: '查看建议'
  },
  {
    id: 3,
    type: 'conflict',
    level: 'high',
    title: '冲突预警',
    description: '检测到冲突升级趋势',
    date: '2025-03-10',
    handled: true,
    action: 'AI调解'
  }
];

// 修复任务数据
export const mockTasks = [
  {
    id: 1,
    title: '认真倾听10分钟',
    description: '今天找个时间，专心倾听伴侣说话10分钟',
    type: 'communication',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedTime: '10分钟',
    rewardPoints: 10,
    createdBy: 'ai',
    steps: [
      { id: 1, text: '找一个安静的环境', completed: true },
      { id: 2, text: '放下手机，专心倾听', completed: false },
      { id: 3, text: '不打断，不评价', completed: false }
    ]
  },
  {
    id: 2,
    title: '写一句感谢',
    description: '写下一句感谢伴侣的话',
    type: 'intimacy',
    priority: 'low',
    status: 'completed',
    dueDate: '2025-03-15',
    estimatedTime: '5分钟',
    rewardPoints: 5,
    createdBy: 'ai',
    completedAt: '2025-03-15 10:30:00',
    steps: [
      { id: 1, text: '思考伴侣为你做的事', completed: true },
      { id: 2, text: '写下感谢的话', completed: true },
      { id: 3, text: '发送给伴侣', completed: true }
    ]
  },
  {
    id: 3,
    title: '共同完成一个小约定',
    description: '和伴侣约定一件小事并一起完成',
    type: 'action',
    priority: 'high',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    estimatedTime: '30分钟',
    rewardPoints: 20,
    createdBy: 'user',
    steps: [
      { id: 1, text: '和伴侣商量约定内容', completed: true },
      { id: 2, text: '确定具体时间', completed: true },
      { id: 3, text: '一起完成约定', completed: false }
    ]
  }
];

// AI消息数据
export const mockAIMessages = [
  {
    id: 1,
    type: 'comfort',
    content: '我注意到你们最近打卡有些波动，需要聊聊吗？',
    sender: 'ai',
    timestamp: '2025-03-15 09:30:00',
    suggestions: [
      '聊聊最近的压力',
      '分享一个开心的事',
      '暂时跳过这个话题'
    ]
  },
  {
    id: 2,
    type: 'suggestion',
    content: '根据打卡数据，建议你们今天花10分钟专注沟通',
    sender: 'ai',
    timestamp: '2025-03-14 14:20:00',
    suggestions: [
      '设置定时提醒',
      '现在开始沟通',
      '晚点再提醒我'
    ]
  },
  {
    id: 3,
    type: 'warning',
    content: '检测到连续2天沟通评分较低，建议关注沟通质量',
    sender: 'ai',
    timestamp: '2025-03-13 18:45:00',
    suggestions: [
      '查看沟通建议',
      '启动AI调解',
      '标记已处理'
    ]
  }
];

// 疗愈内容数据
export const mockHealingContent = [
  {
    id: 1,
    type: 'audio',
    title: '放松呼吸练习',
    description: '5分钟引导式呼吸放松',
    duration: '5分钟',
    url: '',
    icon: 'audio',
    category: '放松'
  },
  {
    id: 2,
    type: 'article',
    title: '如何有效表达情绪',
    description: '学习用非暴力沟通表达感受',
    content: '情绪表达是关系中的重要环节...',
    readTime: '8分钟',
    icon: 'article',
    category: '沟通'
  },
  {
    id: 3,
    type: 'card',
    title: '关系修复卡片',
    content: '今天，试着对TA说一句感谢的话',
    icon: 'card',
    category: '修复'
  },
  {
    id: 4,
    type: 'exercise',
    title: '正念冥想',
    description: '10分钟正念冥想练习',
    duration: '10分钟',
    url: '',
    icon: 'exercise',
    category: '冥想'
  }
];

// 心情树洞数据
export const mockMoodEntries = [
  {
    id: 1,
    content: '今天工作压力好大，但回家看到TA的笑容就觉得轻松了很多',
    mood: 'positive',
    timestamp: '2025-03-15 19:30:00',
    isAnonymous: false,
    tags: ['工作', '感恩']
  },
  {
    id: 2,
    content: '因为小事吵架了，现在有点后悔，不知道怎么开口道歉',
    mood: 'negative',
    timestamp: '2025-03-14 21:15:00',
    isAnonymous: true,
    tags: ['冲突', '道歉']
  },
  {
    id: 3,
    content: '一起做饭的时光总是特别温馨，希望这样的日子能一直持续',
    mood: 'positive',
    timestamp: '2025-03-13 18:45:00',
    isAnonymous: false,
    tags: ['温馨', '日常']
  }
];

// 日历数据
export const mockCalendarData = generateCalendarData();

// 生成打卡历史数据
function generateCheckinHistory(days) {
  const history = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 模拟随机数据
    const mood = Math.floor(Math.random() * 5) + 1;
    const communication = Math.floor(Math.random() * 4) + 1;
    const intimacy = Math.floor(Math.random() * 4) + 1;
    const conflict = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0;
    const completed = Math.random() > 0.2;
    
    history.push({
      date: dateStr,
      mood,
      communication,
      intimacy,
      conflict,
      completed,
      temperature: Math.max(0, Math.min(100, 50 + (mood - 3) * 10 + (communication - 2.5) * 8 + (intimacy - 2.5) * 12 - conflict * 15))
    });
  }
  
  return history;
}

// 生成日历数据
function generateCalendarData() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  const data = {};
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const isToday = day === today.getDate() && currentMonth === today.getMonth();
    
    // 模拟数据
    const hasCheckin = Math.random() > 0.3;
    const mood = hasCheckin ? Math.floor(Math.random() * 5) + 1 : null;
    const conflict = hasCheckin && Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    data[dateStr] = {
      date: dateStr,
      hasCheckin,
      mood,
      conflict,
      isToday,
      temperature: hasCheckin ? Math.max(0, Math.min(100, 50 + (mood - 3) * 15 - conflict * 20)) : null
    };
  }
  
  return data;
}

// 导出所有模拟数据
export default {
  mockUser,
  mockPartner,
  mockRelationship,
  mockCheckin,
  mockWarnings,
  mockTasks,
  mockAIMessages,
  mockHealingContent,
  mockMoodEntries,
  mockCalendarData,
  
  // 数据获取函数
  getUserInfo() {
    return Promise.resolve(mockUser);
  },
  
  getPartnerInfo() {
    return Promise.resolve(mockPartner);
  },
  
  getRelationshipInfo() {
    return Promise.resolve(mockRelationship);
  },
  
  getTodayCheckin() {
    return Promise.resolve(mockCheckin);
  },
  
  getWarnings() {
    return Promise.resolve(mockWarnings);
  },
  
  getTasks(status = 'all') {
    if (status === 'all') {
      return Promise.resolve(mockTasks);
    }
    return Promise.resolve(mockTasks.filter(task => task.status === status));
  },
  
  getAIMessages() {
    return Promise.resolve(mockAIMessages);
  },
  
  getHealingContent() {
    return Promise.resolve(mockHealingContent);
  },
  
  getMoodEntries() {
    return Promise.resolve(mockMoodEntries);
  },
  
  getCalendarData() {
    return Promise.resolve(mockCalendarData);
  },
  
  // 数据提交函数
  submitCheckin(data) {
    console.log('提交打卡数据:', data);
    return Promise.resolve({
      success: true,
      data: {
        ...data,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      }
    });
  },
  
  completeTask(taskId) {
    console.log('完成任务:', taskId);
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
    }
    return Promise.resolve({ success: true, task });
  },
  
  addMoodEntry(content, mood, tags = [], isAnonymous = false) {
    console.log('添加心情记录:', content);
    const entry = {
      id: Date.now(),
      content,
      mood,
      tags,
      isAnonymous,
      timestamp: new Date().toISOString()
    };
    mockMoodEntries.unshift(entry);
    return Promise.resolve({ success: true, entry });
  }
};