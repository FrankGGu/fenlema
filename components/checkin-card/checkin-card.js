// components/checkin-card/checkin-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 打卡数据
    checkinData: {
      type: Object,
      value: {
        date: '',
        mood: 5,
        communication: 5,
        intimacy: 5,
        conflict: 0,
        note: '',
        completed: false
      }
    },
    // 是否显示编辑按钮
    showEdit: {
      type: Boolean,
      value: false
    },
    // 是否显示删除按钮
    showDelete: {
      type: Boolean,
      value: false
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    moodIcons: ['😭', '😢', '😐', '🙂', '😊', '😍'],
    communicationIcons: ['📵', '📞', '💬', '💌', '💖'],
    intimacyIcons: ['🚫', '🤝', '🤗', '💏', '💑'],
    conflictLevels: ['无冲突', '轻微', '中等', '严重']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击编辑按钮
     */
    onEditTap() {
      if (this.data.readOnly) return;
      this.triggerEvent('edit', { data: this.properties.checkinData });
    },

    /**
     * 点击删除按钮
     */
    onDeleteTap() {
      if (this.data.readOnly) return;
      this.triggerEvent('delete', { data: this.properties.checkinData });
    },

    /**
     * 点击卡片
     */
    onCardTap() {
      this.triggerEvent('tap', { data: this.properties.checkinData });
    },

    /**
     * 获取心情描述
     */
    getMoodDescription(score) {
      const descriptions = [
        '非常糟糕',
        '不太好',
        '一般',
        '还不错',
        '很好',
        '非常棒'
      ];
      return descriptions[score] || '未知';
    },

    /**
     * 获取沟通描述
     */
    getCommunicationDescription(score) {
      const descriptions = [
        '没有沟通',
        '很少沟通',
        '一般沟通',
        '良好沟通',
        '深度沟通'
      ];
      return descriptions[score] || '未知';
    },

    /**
     * 获取亲密度描述
     */
    getIntimacyDescription(score) {
      const descriptions = [
        '没有互动',
        '保持距离',
        '一般亲密',
        '比较亲密',
        '非常亲密'
      ];
      return descriptions[score] || '未知';
    }
  }
})