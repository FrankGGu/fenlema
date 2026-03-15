// pages/profile/profile.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatar: '/images/avatar-default.png',
      nickname: '未设置昵称',
      relationshipDays: 0,
      checkinDays: 0,
      relationshipStatus: '正常'
    },
    partnerInfo: {
      avatar: '/images/avatar-partner.png',
      nickname: '伴侣昵称',
      lastCheckin: '今天 08:30'
    },
    menuItems: [
      {
        id: 1,
        icon: 'calendar',
        title: '关系日历',
        url: '/pages/calendar/calendar'
      },
      {
        id: 2,
        icon: 'task',
        title: '修复任务',
        url: '/pages/task/task'
      },
      {
        id: 3,
        icon: 'mood',
        title: '心情树洞',
        url: '/pages/mood/mood'
      },
      {
        id: 4,
        icon: 'healing',
        title: '疗愈内容',
        url: '/pages/healing/healing'
      },
      {
        id: 5,
        icon: 'warning',
        title: '风险预警',
        url: '/pages/warning/warning'
      },
      {
        id: 6,
        icon: 'mediation',
        title: 'AI调解室',
        url: '/pages/ai-mediation/ai-mediation'
      },
      {
        id: 7,
        icon: 'settings',
        title: '设置',
        url: '/pages/settings/settings'
      },
      {
        id: 8,
        icon: 'help',
        title: '帮助与反馈',
        url: '/pages/help/help'
      }
    ],
    showPartnerModal: false,
    showLogoutModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 尝试获取用户信息
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        'userInfo.avatar': userInfo.avatarUrl || '/images/avatar-default.png',
        'userInfo.nickname': userInfo.nickName || '未设置昵称'
      });
    }
    
    // 模拟关系数据
    this.setData({
      'userInfo.relationshipDays': 128,
      'userInfo.checkinDays': 45,
      'userInfo.relationshipStatus': '良好'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示时更新打卡天数
    const checkinDays = Math.min(this.data.userInfo.checkinDays + 1, this.data.userInfo.relationshipDays);
    this.setData({
      'userInfo.checkinDays': checkinDays
    });
  },

  /**
   * 用户点击菜单项
   */
  onMenuItemTap(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url,
      });
    }
  },

  /**
   * 编辑个人信息
   */
  onEditProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit/edit',
    });
  },

  /**
   * 查看伴侣信息
   */
  onViewPartner() {
    this.setData({
      showPartnerModal: true
    });
  },

  /**
   * 关闭伴侣信息模态框
   */
  onClosePartnerModal() {
    this.setData({
      showPartnerModal: false
    });
  },

  /**
   * 邀请伴侣
   */
  onInvitePartner() {
    wx.showToast({
      title: '邀请链接已复制',
      icon: 'success'
    });
    // 实际项目中这里应该生成并复制邀请链接
  },

  /**
   * 显示退出登录确认
   */
  onShowLogoutConfirm() {
    this.setData({
      showLogoutModal: true
    });
  },

  /**
   * 关闭退出登录确认
   */
  onCloseLogoutModal() {
    this.setData({
      showLogoutModal: false
    });
  },

  /**
   * 确认退出登录
   */
  onConfirmLogout() {
    // 清除登录状态
    app.globalData.userInfo = null;
    app.globalData.token = null;
    
    // 跳转到登录页
    wx.reLaunch({
      url: '/pages/login/login',
    });
  },

  /**
   * 联系客服
   */
  onContactService() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567',
    });
  }
})