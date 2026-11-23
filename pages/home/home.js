const api = require('../../services/api');
const { buildHomeVM } = require('../../viewmodels/home.vm');

Page({
  data: {
    loading: true,
    vm: {}
  },

  onLoad() {
    this.load();
  },

  onPullDownRefresh() {
    this.load().then(() => wx.stopPullDownRefresh());
  },

  /** 拉数据 → 交 VM 加工 → 一次性 setData */
  load() {
    this.setData({ loading: true });
    return api.getHome().then((raw) => {
      this.setData({
        loading: false,
        vm: buildHomeVM(raw)
      });
    });
  },

  /** 待办 / 病例点击：路由集中在这里，组件不碰路由 */
  onCellTap(e) {
    const to = e.detail.id;
    if (to === 'P71' || to === 'case') {
      wx.showToast({ title: '病例详情（待接入）', icon: 'none' });
      return;
    }
    wx.showToast({ title: `去「${to}」（待接入）`, icon: 'none' });
  },

  /** 拍照诊断：进入诊断域（MVVM 版） */
  goCapture() {
    wx.navigateTo({ url: '/pages/diagnose/diagnose' });
  },

  goPrototype() {
    wx.navigateTo({ url: '/pages/index/index' });
  }
});
