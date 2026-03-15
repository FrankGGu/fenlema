// pages/healing/healing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    healingList: [
      {
        id: 1,
        type: 'audio',
        title: '放松呼吸练习',
        duration: '5分钟',
        icon: 'audio',
        played: false
      },
      {
        id: 2,
        type: 'article',
        title: '如何有效表达情绪',
        description: '学习用非暴力沟通表达感受',
        icon: 'article',
        read: false
      },
      {
        id: 3,
        type: 'card',
        title: '关系修复卡片',
        content: '今天，试着对TA说一句感谢的话',
        icon: 'card',
        completed: false
      },
      {
        id: 4,
        type: 'exercise',
        title: '正念冥想',
        duration: '10分钟',
        icon: 'exercise',
        completed: false
      }
    ],
    selectedType: 'all'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 切换类型
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedType: type
    });
  },

  // 播放音频
  playAudio(e) {
    const id = e.currentTarget.dataset.id;
    console.log('播放音频', id);
    wx.showToast({
      title: '开始播放',
      icon: 'none'
    });
  },

  // 阅读文章
  readArticle(e) {
    const id = e.currentTarget.dataset.id;
    console.log('阅读文章', id);
    wx.navigateTo({
      url: `/pages/healing/article/article?id=${id}`,
    });
  },

  // 完成卡片
  completeCard(e) {
    const id = e.currentTarget.dataset.id;
    console.log('完成卡片', id);
    const healingList = this.data.healingList.map(item => {
      if (item.id === id) {
        return { ...item, completed: true };
      }
      return item;
    });
    this.setData({ healingList });
    wx.showToast({
      title: '已完成',
      icon: 'success'
    });
  }
})