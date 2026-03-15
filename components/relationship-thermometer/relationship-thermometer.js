// components/relationship-thermometer/relationship-thermometer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 关系温度值（0-100）
    temperature: {
      type: Number,
      value: 50,
      observer: function(newVal) {
        this.updateTemperature(newVal);
      }
    },
    // 是否显示详细描述
    showDescription: {
      type: Boolean,
      value: true
    },
    // 是否显示趋势箭头
    showTrend: {
      type: Boolean,
      value: false
    },
    // 趋势值（-100 到 100）
    trend: {
      type: Number,
      value: 0
    },
    // 自定义尺寸：small, medium, large
    size: {
      type: String,
      value: 'medium'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 计算后的温度百分比（0-100）
    temperaturePercent: 50,
    // 温度等级
    temperatureLevel: 'normal',
    // 温度描述
    temperatureDescription: '关系温度正常',
    // 温度颜色
    temperatureColor: '#D4A574',
    // 温度图标
    temperatureIcon: '🌡️',
    // 趋势箭头
    trendArrow: '→',
    // 趋势颜色
    trendColor: '#8B7355'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 更新温度显示
     */
    updateTemperature(temp) {
      const percent = Math.max(0, Math.min(100, temp));
      const level = this.getTemperatureLevel(percent);
      const description = this.getTemperatureDescription(level);
      const color = this.getTemperatureColor(level);
      const icon = this.getTemperatureIcon(level);
      
      this.setData({
        temperaturePercent: percent,
        temperatureLevel: level,
        temperatureDescription: description,
        temperatureColor: color,
        temperatureIcon: icon
      });

      // 更新趋势显示
      if (this.properties.showTrend) {
        this.updateTrend();
      }
    },

    /**
     * 更新趋势显示
     */
    updateTrend() {
      const trend = this.properties.trend;
      let arrow = '→';
      let color = '#8B7355';

      if (trend > 10) {
        arrow = '↗';
        color = '#5CB85C';
      } else if (trend > 5) {
        arrow = '↗';
        color = '#A8D5BA';
      } else if (trend < -10) {
        arrow = '↘';
        color = '#FF6B6B';
      } else if (trend < -5) {
        arrow = '↘';
        color = '#FFB6C1';
      } else {
        arrow = '→';
        color = '#8B7355';
      }

      this.setData({
        trendArrow: arrow,
        trendColor: color
      });
    },

    /**
     * 获取温度等级
     */
    getTemperatureLevel(percent) {
      if (percent >= 80) return 'excellent';
      if (percent >= 60) return 'good';
      if (percent >= 40) return 'normal';
      if (percent >= 20) return 'low';
      return 'critical';
    },

    /**
     * 获取温度描述
     */
    getTemperatureDescription(level) {
      const descriptions = {
        'excellent': '关系非常温暖',
        'good': '关系良好',
        'normal': '关系温度正常',
        'low': '关系温度偏低',
        'critical': '关系温度过低'
      };
      return descriptions[level] || '未知状态';
    },

    /**
     * 获取温度颜色
     */
    getTemperatureColor(level) {
      const colors = {
        'excellent': '#5CB85C', // 绿色
        'good': '#A8D5BA', // 浅绿色
        'normal': '#D4A574', // 橙色
        'low': '#FFB6C1', // 粉色
        'critical': '#FF6B6B' // 红色
      };
      return colors[level] || '#8B7355';
    },

    /**
     * 获取温度图标
     */
    getTemperatureIcon(level) {
      const icons = {
        'excellent': '🔥',
        'good': '☀️',
        'normal': '🌡️',
        'low': '🌥️',
        'critical': '❄️'
      };
      return icons[level] || '🌡️';
    },

    /**
     * 点击温度计
     */
    onThermometerTap() {
      this.triggerEvent('tap', {
        temperature: this.properties.temperature,
        level: this.data.temperatureLevel,
        description: this.data.temperatureDescription
      });
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function() {
      this.updateTemperature(this.properties.temperature);
      if (this.properties.showTrend) {
        this.updateTrend();
      }
    }
  }
})