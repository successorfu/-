const TITLES = {
  P00: '塘口鱼医',
  P01: '首页',
  P02: '我的塘口',
  P03: '东塘 3 号',
  P04: '编辑塘口',
  P10: '拍照诊断',
  P11: '拍摄 · 鳃丝',
  P12: '照片检查',
  P13: '补充症状',
  P14: '环境快录',
  P20: '正在诊断',
  P21: '可能是什么',
  P22: '补一项证据',
  P23: '诊断结果',
  P30: '诊断结果',
  P31: '相似病例',
  P32: '判定依据',
  P40: '治疗方案',
  P41: '算用量',
  P42: '合规校验',
  P43: '出塘日历',
  P44: '用药单',
  P50: '治疗跟踪',
  P60: '第 3 天回访',
  P61: '疗效结论',
  P70: '我的病例',
  P71: '病例详情',
  P80: '诊断报告',
  P90: '病害图鉴',
  P91: '药品查询',
  P92: '塘口计算器',
  P93: '本县病害动态',
  P95: '渔医工作台',
  P99: '我的'
};

const ALL = Object.keys(TITLES);

function tabOf(p) {
  const n = Number(p.slice(1));
  if (p === 'P00') return -1;
  if (p === 'P01' || (n >= 2 && n <= 4)) return 0;
  if (n >= 10 && n <= 44) return 1;
  if (n >= 50 && n <= 80) return 2;
  if (n >= 90) return 3;
  return -1;
}

Page({
  data: {
    page: 'P00',
    tab: -1,
    pages: ALL,
    // ---- 交互态（原型用，真实数据后续接接口）----
    symptom: ['鳃丝腐烂', '附泥', '浮头', '不吃食', '每天 20–50 条'],
    sizeChoice: 1,
    dead: 8,
    deadToday: 12
  },

  onLoad() {
    this.go('P00');
  },

  go(e) {
    const p = typeof e === 'string' ? e : e.currentTarget.dataset.page;
    if (!p || !TITLES[p]) return;
    wx.setNavigationBarTitle({ title: TITLES[p] });
    wx.setNavigationBarColor({
      frontColor: p === 'P00' ? '#ffffff' : '#000000',
      backgroundColor: p === 'P00' ? '#0E7C86' : '#ffffff'
    });
    this.setData({ page: p, tab: tabOf(p) });
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },

  // 死鱼数 +/-
  step(e) {
    const d = Number(e.currentTarget.dataset.d);
    const key = e.currentTarget.dataset.key;
    let v = this.data[key] + d;
    if (v < 0) v = 0;
    this.setData({ [key]: v });
  },

  // 单选
  pick(e) {
    this.setData({ sizeChoice: Number(e.currentTarget.dataset.i) });
  },

  /** 跳到 MVVM 版首页（参考实现） */
  goMvvm() {
    wx.navigateTo({ url: '/pages/home/home' });
  },

  toast(e) {
    wx.showToast({
      title: (e.currentTarget.dataset.msg) || '原型占位',
      icon: 'none'
    });
  }
});
