const api = require('../../services/api');
const VM = require('../../viewmodels/diagnose.vm');

Page({
  data: {
    step: 'P10',
    ready: false,
    start: {},
    symptom: { groups: [], selectedCount: 0 },
    env: { fields: [], events: [] },
    progress: { steps: [], percent: 0 },
    candidates: { candidates: [], imageCount: 0 },
    detail: { candidates: [], lesions: [], reasons: [], evidence: [] },
    proof: { options: [] },
    plan: { drugs: [], doses: [], withdraw: {} },
    compliance: { checks: [], sources: [], passCount: 0 },
    calendar: { title: '', weekdays: [], cells: [] },
    receipt: { rows: [], meds: [], tail: [] },
    similar: { cases: [] },
    deadToday: 12
  },

  onLoad() {
    Promise.all([api.getDiagnoseStart(), api.getSymptoms(), api.getEnvSchema()]).then(
      ([start, symptoms, env]) => {
        this.setData({
          ready: true,
          start: VM.buildStartVM(start),
          symptom: VM.buildSymptomVM(symptoms),
          env: VM.buildEnvVM(env),
          calendar: VM.buildCalendarVM(23)
        });
      }
    );
  },

  /* ---------------- 路由 ---------------- */
  goStep(e) {
    const step = e.currentTarget.dataset.step;
    if (!step) return;
    this.setData({ step });
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
    this.ensure(step);
  },

  /** 按需加载该步需要的数据 —— 不做全量预载 */
  ensure(step) {
    if (step === 'P20' && !this.data.progress.steps.length) {
      api.getDiagnoseProgress().then((steps) => {
        this.setData({ progress: VM.buildProgressVM(steps) });
        // 原型：2 秒后自动进入结果
        setTimeout(() => {
          if (this.data.step === 'P20') this.goStep({ currentTarget: { dataset: { step: 'P21' } } });
        }, 2000);
      });
    }
    if (step === 'P21' && !this.data.candidates.candidates.length) {
      api.getDiagnosis().then((d) => this.setData({ candidates: VM.buildCandidatesVM(d) }));
    }
    if (step === 'P30') {
      if (!this.data.detail.candidates.length) {
        api.getDiagnosis().then((d) => this.setData({ detail: VM.buildDetailVM(d) }));
      }
      if (!this.data.similar.cases.length) {
        api.getSimilarCases().then((s) => this.setData({ similar: VM.buildSimilarVM(s) }));
      }
    }
    if (step === 'P22' && !this.data.proof.options.length) {
      api.getProofs().then((p) => this.setData({ proof: VM.buildProofVM(p) }));
    }
    if (step === 'P40' && !this.data.plan.drugs.length) {
      api.getPlan().then((p) => this.setData({ plan: VM.buildPlanVM(p) }));
    }
    if (step === 'P42' && !this.data.compliance.checks.length) {
      api.getCompliance().then((c) => this.setData({ compliance: VM.buildComplianceVM(c) }));
    }
    if (step === 'P44' && !this.data.receipt.rows.length) {
      Promise.all([api.getDiagnosis(), api.getPlan()]).then(([d, p]) => {
        this.setData({ receipt: VM.buildReceiptVM(d, p) });
      });
    }
  },

  /* ---------------- 交互 ---------------- */
  toggleSymptom(e) {
    const gi = Number(e.currentTarget.dataset.gi);
    const ii = Number(e.currentTarget.dataset.ii);
    const groups = this.data.symptom.groups.map((g) => g);
    const items = groups[gi].items.map((it) => ({ text: it.text, on: it.on }));
    items[ii].on = !items[ii].on;
    groups[gi] = { key: groups[gi].key, title: groups[gi].title, items };
    // 交给 VM 重算计数，页面不自己算
    this.setData({ symptom: VM.buildSymptomVM(groups.map((g) => ({ key: g.key, title: g.title, items: g.items }))) });
  },

  toggleEvent(e) {
    const i = Number(e.currentTarget.dataset.i);
    const events = this.data.env.events.map((ev, idx) => ({
      name: ev.name,
      on: idx === i ? !ev.on : ev.on
    }));
    this.setData({ 'env.events': events });
  },

  pickPond(e) {
    const id = e.currentTarget.dataset.id;
    const ponds = this.data.start.ponds.map((p) => ({ ...p, selected: p.id === id }));
    this.setData({ 'start.ponds': ponds });
  },

  stepDead(e) {
    const d = Number(e.currentTarget.dataset.d);
    let v = this.data.deadToday + d;
    if (v < 0) v = 0;
    this.setData({ deadToday: v });
  },

  toast(e) {
    wx.showToast({ title: e.currentTarget.dataset.msg || '原型占位', icon: 'none' });
  }
});
