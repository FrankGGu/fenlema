// pages/login/login.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType: 'quick', // quick, phone, wechat
    phoneNumber: '',
    smsCode: '',
    countdown: 0,
    agreePrivacy: false,
    showPrivacyModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查是否已登录
    if (app.globalData.userInfo && app.globalData.token) {
      this.redirectToHome();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 切换登录方式
   */
  switchLoginType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      loginType: type,
      phoneNumber: '',
      smsCode: '',
      countdown: 0
    });
  },

  /**
   * 输入手机号
   */
  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value.replace(/\D/g, '')
    });
  },

  /**
   * 输入验证码
   */
  onSmsCodeInput(e) {
    this.setData({
      smsCode: e.detail.value.replace(/\D/g, '')
    });
  },

  /**
   * 获取验证码
   */
  getSmsCode() {
    if (!this.data.phoneNumber || this.data.phoneNumber.length !== 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return;
    }

    if (this.data.countdown > 0) return;

    // 模拟发送验证码
    wx.showLoading({
      title: '发送中...',
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      });

      // 开始倒计时
      this.setData({ countdown: 60 });
      this.startCountdown();
    }, 1500);
  },

  /**
   * 开始倒计时
   */
  startCountdown() {
    const timer = setInterval(() => {
      let countdown = this.data.countdown - 1;
      if (countdown <= 0) {
        clearInterval(timer);
        countdown = 0;
      }
      this.setData({ countdown });
    }, 1000);
  },

  /**
   * 切换隐私协议同意状态
   */
  toggleAgreePrivacy() {
    this.setData({
      agreePrivacy: !this.data.agreePrivacy
    });
  },

  /**
   * 显示隐私协议模态框
   */
  showPrivacyModal() {
    this.setData({
      showPrivacyModal: true
    });
  },

  /**
   * 隐藏隐私协议模态框
   */
  hidePrivacyModal() {
    this.setData({
      showPrivacyModal: false
    });
  },

  /**
   * 快速登录（模拟）
   */
  quickLogin() {
    if (!this.data.agreePrivacy) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '登录中...',
    });

    // 模拟登录过程
    setTimeout(() => {
      wx.hideLoading();

      // 模拟获取用户信息
      const userInfo = {
        avatarUrl: '/images/avatar-default.png',
        nickName: '用户_' + Math.floor(Math.random() * 10000),
        userId: 'user_' + Date.now()
      };

      // 保存到全局数据
      app.globalData.userInfo = userInfo;
      app.globalData.token = 'mock_token_' + Date.now();

      // 跳转到首页
      this.redirectToHome();
    }, 2000);
  },

  /**
   * 手机号登录
   */
  phoneLogin() {
    if (!this.data.agreePrivacy) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      });
      return;
    }

    if (!this.data.phoneNumber || this.data.phoneNumber.length !== 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return;
    }

    if (!this.data.smsCode || this.data.smsCode.length !== 6) {
      wx.showToast({
        title: '请输入6位验证码',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '登录中...',
    });

    // 模拟登录过程
    setTimeout(() => {
      wx.hideLoading();

      // 模拟获取用户信息
      const userInfo = {
        avatarUrl: '/images/avatar-default.png',
        nickName: '用户_' + this.data.phoneNumber.slice(-4),
        phoneNumber: this.data.phoneNumber,
        userId: 'user_' + this.data.phoneNumber
      };

      // 保存到全局数据
      app.globalData.userInfo = userInfo;
      app.globalData.token = 'mock_token_' + Date.now();

      // 跳转到首页
      this.redirectToHome();
    }, 2000);
  },

  /**
   * 微信登录
   */
  wechatLogin() {
    if (!this.data.agreePrivacy) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '授权中...',
    });

    // 模拟微信授权登录
    setTimeout(() => {
      wx.hideLoading();

      // 模拟获取用户信息
      const userInfo = {
        avatarUrl: '/images/avatar-default.png',
        nickName: '微信用户_' + Math.floor(Math.random() * 10000),
        userId: 'wx_user_' + Date.now()
      };

      // 保存到全局数据
      app.globalData.userInfo = userInfo;
      app.globalData.token = 'mock_token_' + Date.now();

      // 跳转到首页
      this.redirectToHome();
    }, 2000);
  },

  /**
   * 跳转到首页
   */
  redirectToHome() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  /**
   * 跳转到注册页面
   */
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register',
    });
  },

  /**
   * 跳转到忘记密码页面
   */
  goToForgotPassword() {
    wx.navigateTo({
      url: '/pages/forgot/forgot',
    });
  }
})