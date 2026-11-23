Component({
  options: {
    // 共享 app.wxss 的样式，避免组件内重复定义
    styleIsolation: 'apply-shared'
  },

  properties: {
    icon: { type: String, value: '' },
    title: { type: String, value: '' },
    sub: { type: String, value: '' },
    tagType: { type: String, value: '' },
    tagText: { type: String, value: '' },
    arrow: { type: Boolean, value: false },
    last: { type: Boolean, value: false },
    itemId: { type: String, value: '' }
  },

  methods: {
    onTap() {
      // 只抛事件，不自己跳转 —— 路由决策交给页面
      this.triggerEvent('celltap', { id: this.data.itemId });
    }
  }
});
