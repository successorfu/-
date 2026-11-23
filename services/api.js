/**
 * Service 层 · 数据访问统一出口
 * ------------------------------------------------------------
 * 页面永远不直接 require mock，只调 api。
 * 接真后端时，只需把这里的 ok() 换成 wx.request，
 * 上层 ViewModel 与页面完全不用改。
 */

const db = require('./mock');
const dg = require('./mock.diagnose');

const DELAY = 0; // 模拟网络延迟，联调时可设 300

function ok(data, delay = DELAY) {
  return new Promise((resolve) => {
    if (!delay) return resolve(data);
    setTimeout(() => resolve(data), delay);
  });
}

module.exports = {
  /* ---------------- 首页 ---------------- */
  getHome() {
    return ok(db.HOME);
  },

  getPonds() {
    return ok(db.PONDS);
  },

  getPond(id) {
    const p = db.PONDS.find((x) => x.id === id) || db.PONDS[0];
    return ok(p);
  },

  getCases(status) {
    const list = status && status !== 'all'
      ? db.ALL_CASES.filter((c) => c.status === status)
      : db.ALL_CASES;
    return ok(list);
  },

  getDrugs() {
    return ok(db.DRUGS);
  },

  /* ---------------- 诊断域 ---------------- */
  /** 诊断入口：塘口 + 可拍部位 */
  getDiagnoseStart() {
    return ok({
      ponds: db.PONDS.map((p) => ({ id: p.id, name: p.name, selected: p.id === 'P-001' })),
      parts: dg.PARTS
    });
  },

  /** 症状字典 */
  getSymptoms() {
    return ok(dg.SYMPTOM_GROUPS);
  },

  /** 环境字段与事件 */
  getEnvSchema() {
    return ok({ fields: dg.ENV_FIELDS, events: dg.ENV_EVENTS });
  },

  /** 诊断中进度 */
  getDiagnoseProgress() {
    return ok(dg.DIAG_STEPS);
  },

  /** 诊断结果（候选病 + 依据） */
  getDiagnosis() {
    return ok(db.DIAGNOSIS);
  },

  /** 补证据选项 */
  getProofs() {
    return ok(dg.PROOFS);
  },

  /** 相似病例 */
  getSimilarCases() {
    return ok(dg.SIMILAR);
  },

  /** 治疗方案 */
  getPlan() {
    return ok(db.PLAN);
  },

  /** 合规校验 */
  getCompliance() {
    return ok({ checks: dg.CHECKS, sources: dg.SOURCES });
  },

  /** 回访 */
  getFollowup() {
    return ok(db.FOLLOWUP);
  },

  /** 提交回访（原型：本地模拟成功） */
  submitFollowup(payload) {
    return ok({ ok: true, received: payload });
  }
};
