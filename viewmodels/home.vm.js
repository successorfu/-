/**
 * ViewModel 层 · 首页
 * ------------------------------------------------------------
 * 职责：把 Model 的原始数据，加工成"View 直接可用"的结构。
 * 规则：不含任何 wx.* 调用，不碰 DOM/setData，纯函数，好测。
 */

/**
 * @param {Object} raw 由 service 返回的原始数据
 * @param {Object} ui  页面传入的交互态（如倒计时）
 * @returns {Object} view model
 */
function buildHomeVM(raw, ui = {}) {
  const pond = raw.pond;
  return {
    // 头部
    county: raw.county,
    pondName: pond.name,
    pondMeta: `${pond.fish} · ${pond.area} 亩 · 水深 ${pond.depth}m · ≈${pond.stockWeight} 斤`,
    metricValue: ui.daysLeft != null ? ui.daysLeft : raw.metric.value,
    metricLabel: raw.metric.label,

    // 待办
    todos: raw.todos.map((t) => ({
      id: t.id,
      icon: t.icon,
      title: t.title,
      sub: t.sub,
      tagType: t.tagType,
      tagText: t.tagText,
      to: t.to
    })),
    todoCount: raw.todos.length,

    // 提醒
    notice: raw.notice,

    // 最近病例
    cases: raw.recentCases.map((c) => ({
      id: c.id,
      icon: c.icon,
      name: c.name,
      sub: c.sub,
      tagType: c.tagType,
      tagText: c.tagText
    })),

    // 空态（无塘口时 View 显示引导）
    isEmpty: !pond
  };
}

module.exports = { buildHomeVM };
