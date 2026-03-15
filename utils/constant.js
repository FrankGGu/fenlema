// 常量定义

// 关系状态
export const RELATIONSHIP_STATUS = {
  NORMAL: 1,      // 正常
  WARNING: 2,     // 预警
  DISCONNECTED: 3 // 断开
}

// 预警类型
export const WARNING_TYPE = {
  MISS_CHECKIN: 1,      // 漏打卡
  LOW_SCORE: 2,         // 低评分
  BOTH_COLD: 3,         // 双方冷淡
  CONFLICT_UPGRADE: 4   // 冲突升级
}

// 预警等级
export const WARNING_LEVEL = {
  LIGHT: 1,     // 轻提醒
  MEDIUM: 2,    // 中预警
  HIGH: 3       // 高风险
}

// 任务状态
export const TASK_STATUS = {
  PENDING: 1,     // 待完成
  IN_PROGRESS: 2, // 进行中
  COMPLETED: 3,   // 已完成
  EXPIRED: 4      // 已过期
}

// 任务类型
export const TASK_TYPE = {
  LISTEN: 1,      // 倾听
  THANKS: 2,      // 感谢
  AGREEMENT: 3,   // 约定
  MEMORY: 4,      // 回忆
  OTHER: 5        // 其他
}

// 心情等级
export const MOOD_LEVEL = {
  VERY_SAD: 1,    // 非常难过
  SAD: 2,         // 难过
  NORMAL: 3,      // 一般
  HAPPY: 4,       // 开心
  VERY_HAPPY: 5   // 非常开心
}

// 矛盾类型
export const CONFLICT_TYPE = {
  COLD_WAR: '冷战',
  MISUNDERSTANDING: '误解',
  TRUST_ISSUE: '信任问题',
  LACK_COMMUNICATION: '沟通不足',
  REALITY_PRESSURE: '现实压力'
}

// 疗愈内容类型
export const HEALING_TYPE = {
  AUDIO: 1,       // 语音
  TEXT: 2,        // 文案
  BREATHING: 3,   // 呼吸练习
  CARD: 4         // 关系建议卡片
}

// 颜色常量
export const COLORS = {
  PRIMARY: '#FF6B8B',
  PRIMARY_LIGHT: '#FFE8E8',
  SECONDARY: '#6B8BFF',
  SUCCESS: '#6BFF8B',
  WARNING: '#FFB86B',
  DANGER: '#FF6B6B',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_LIGHT: '#999999',
  BACKGROUND: '#FFF9F9',
  CARD_BACKGROUND: '#FFFFFF',
  BORDER: '#F0F0F0'
}

// 表情符号映射
export const MOOD_EMOJIS = {
  1: '😭', // 非常难过
  2: '😔', // 难过
  3: '😐', // 一般
  4: '😊', // 开心
  5: '😄'  // 非常开心
}

// 表情描述
export const MOOD_DESCRIPTIONS = {
  1: '非常难过',
  2: '难过',
  3: '一般',
  4: '开心',
  5: '非常开心'
}

// API 接口地址（模拟）
export const API = {
  BASE_URL: 'https://api.example.com',
  CHECKIN: '/checkin',
  RELATIONSHIP: '/relationship',
  WARNING: '/warning',
  TASK: '/task',
  MEDIATION: '/mediation',
  MOOD: '/mood',
  HEALING: '/healing'
}

// 本地存储键名
export const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  RELATIONSHIP: 'relationship',
  CHECKIN_HISTORY: 'checkinHistory',
  WARNINGS: 'warnings',
  TASKS: 'tasks',
  MOOD_RECORDS: 'moodRecords',
  SETTINGS: 'settings'
}

// 默认配置
export const DEFAULT_CONFIG = {
  CHECKIN_REMINDER_HOUR: 20, // 晚上8点提醒打卡
  WARNING_THRESHOLD: {
    MISS_CHECKIN: 1,      // 漏打卡1天提醒
    LOW_SCORE: 2,         // 低评分2天预警
    BOTH_COLD: 3,         // 双方冷淡3天预警
    CONFLICT_UPGRADE: 1   // 冲突升级立即预警
  },
  TEMPERATURE: {
    MIN: 0,
    MAX: 100,
    INITIAL: 75
  }
}