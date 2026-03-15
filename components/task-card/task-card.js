// components/task-card/task-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 任务数据
    task: {
      type: Object,
      value: {
        id: '',
        title: '',
        description: '',
        type: 'communication', // communication, intimacy, healing, reflection, action
        priority: 'medium', // low, medium, high, urgent
        status: 'pending', // pending, in_progress, completed, cancelled
        dueDate: '',
        estimatedTime: '',
        rewardPoints: 0,
        createdBy: 'ai', // ai, user, system
        steps: []
      }
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      value: true
    },
    // 是否显示进度条
    showProgress: {
      type: Boolean,
      value: false
    },
    // 当前进度（0-100）
    progress: {
      type: Number,
      value: 0
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 任务类型配置
    typeConfig: {
      'communication': {
        icon: '💬',
        color: '#D4A574',
        bgColor: '#FFE8D6',
        name: '沟通任务'
      },
      'intimacy': {
        icon: '💖',
        color: '#FFB6C1',
        bgColor: '#FFE8E8',
        name: '亲密任务'
      },
      'healing': {
        icon: '🌿',
        color: '#A8D5BA',
        bgColor: '#E8F5E9',
        name: '疗愈任务'
      },
      'reflection': {
        icon: '📝',
        color: '#5C6BC0',
        bgColor: '#E8EAF6',
        name: '反思任务'
      },
      'action': {
        icon: '🎯',
        color: '#FF9800',
        bgColor: '#FFF3CD',
        name: '行动任务'
      }
    },
    // 优先级配置
    priorityConfig: {
      'low': {
        color: '#5CB85C',
        name: '低优先级'
      },
      'medium': {
        color: '#D4A574',
        name: '中优先级'
      },
      'high': {
        color: '#FF9800',
        name: '高优先级'
      },
      'urgent': {
        color: '#FF6B6B',
        name: '紧急'
      }
    },
    // 状态配置
    statusConfig: {
      'pending': {
        color: '#8B7355',
        bgColor: '#F5F5F5',
        name: '待开始'
      },
      'in_progress': {
        color: '#5C6BC0',
        bgColor: '#E8EAF6',
        name: '进行中'
      },
      'completed': {
        color: '#5CB85C',
        bgColor: '#E8F5E8',
        name: '已完成'
      },
      'cancelled': {
        color: '#999999',
        bgColor: '#F5F5F5',
        name: '已取消'
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击任务卡片
     */
    onTaskTap() {
      if (!this.properties.clickable) return;
      this.triggerEvent('tap', { task: this.properties.task });
    },

    /**
     * 点击开始按钮
     */
    onStartTap() {
      this.triggerEvent('start', { task: this.properties.task });
    },

    /**
     * 点击完成按钮
     */
    onCompleteTap() {
      this.triggerEvent('complete', { task: this.properties.task });
    },

    /**
     * 点击取消按钮
     */
    onCancelTap() {
      this.triggerEvent('cancel', { task: this.properties.task });
    },

    /**
     * 点击编辑按钮
     */
    onEditTap() {
      this.triggerEvent('edit', { task: this.properties.task });
    },

    /**
     * 点击删除按钮
     */
    onDeleteTap() {
      this.triggerEvent('delete', { task: this.properties.task });
    },

    /**
     * 格式化日期
     */
    formatDate(dateString) {
      if (!dateString) return '无截止日期';
      
      const date = new Date(dateString);
      const now = new Date();
      const diff = date - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      if (days < 0) {
        return '已过期';
      } else if (days === 0) {
        return '今天截止';
      } else if (days === 1) {
        return '明天截止';
      } else if (days <= 7) {
        return `${days}天后截止`;
      } else {
        return date.toLocaleDateString('zh-CN', { 
          month: '2-digit', 
          day: '2-digit' 
        }) + '截止';
      }
    },

    /**
     * 获取任务类型配置
     */
    getTypeConfig() {
      const type = this.properties.task.type;
      return this.data.typeConfig[type] || this.data.typeConfig.communication;
    },

    /**
     * 获取优先级配置
     */
    getPriorityConfig() {
      const priority = this.properties.task.priority;
      return this.data.priorityConfig[priority] || this.data.priorityConfig.medium;
    },

    /**
     * 获取状态配置
     */
    getStatusConfig() {
      const status = this.properties.task.status;
      return this.data.statusConfig[status] || this.data.statusConfig.pending;
    }
  }
})