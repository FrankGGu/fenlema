// components/ai-message/ai-message.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 消息数据
    message: {
      type: Object,
      value: {
        id: '',
        type: 'text', // text, suggestion, question, warning, comfort
        content: '',
        sender: 'ai', // ai, user
        timestamp: '',
        suggestions: [],
        isRead: false
      }
    },
    // 是否显示时间
    showTime: {
      type: Boolean,
      value: true
    },
    // 是否显示头像
    showAvatar: {
      type: Boolean,
      value: true
    },
    // 是否显示已读状态
    showReadStatus: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 消息类型配置
    typeConfig: {
      'text': {
        bgColor: '#F5F5F5',
        textColor: '#5C4033',
        icon: '💬',
        avatar: '/images/ai-avatar.png'
      },
      'suggestion': {
        bgColor: '#E8F5E9',
        textColor: '#2E7D32',
        icon: '💡',
        avatar: '/images/ai-avatar.png'
      },
      'question': {
        bgColor: '#E3F2FD',
        textColor: '#1565C0',
        icon: '❓',
        avatar: '/images/ai-avatar.png'
      },
      'warning': {
        bgColor: '#FFF3CD',
        textColor: '#856404',
        icon: '⚠️',
        avatar: '/images/ai-avatar.png'
      },
      'comfort': {
        bgColor: '#FFE8D6',
        textColor: '#D4A574',
        icon: '🤗',
        avatar: '/images/ai-avatar.png'
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击消息
     */
    onMessageTap() {
      this.triggerEvent('tap', { message: this.properties.message });
    },

    /**
     * 点击建议项
     */
    onSuggestionTap(e) {
      const index = e.currentTarget.dataset.index;
      const suggestion = this.properties.message.suggestions[index];
      this.triggerEvent('suggestiontap', { 
        suggestion: suggestion,
        index: index,
        messageId: this.properties.message.id
      });
    },

    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      // 如果是今天
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      // 如果是昨天
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      // 其他情况
      return date.toLocaleDateString('zh-CN', { 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    /**
     * 获取消息样式
     */
    getMessageStyle() {
      const type = this.properties.message.type;
      const config = this.data.typeConfig[type] || this.data.typeConfig.text;
      const sender = this.properties.message.sender;
      
      if (sender === 'user') {
        return {
          bgColor: '#D4A574',
          textColor: '#FFFFFF',
          icon: '👤',
          avatar: '/images/user-avatar.png'
        };
      }
      
      return config;
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function() {
      // 初始化消息类型配置
      const config = this.data.typeConfig;
      this.setData({ typeConfig: config });
    }
  }
})