/**
 * ViewModel 层 · 诊断域
 * ------------------------------------------------------------
 * 全是纯函数：吃 Model 数据，吐 View 能直接渲染的结构。
 * 不调 wx.*、不 setData、不依赖页面实例 —— 可以单独跑单测。
 */

/** 诊断入口 */
function buildStartVM(raw) {
  return {
    ponds: raw.ponds.map((p) => ({
      id: p.id,
      name: p.name,
      selected: p.selected
    })),
    parts: raw.parts.map((p) => ({
      key: p.key,
      icon: p.icon,
      name: p.name,
      desc: p.desc,
      tagType: p.shot ? 'success' : 'gray',
      tagText: p.shot ? '已拍 1 张' : '待拍'
    }))
  };
}

/** 症状勾选 */
function buildSymptomVM(groups) {
  let count = 0;
  const list = groups.map((g) => {
    const items = g.items.map((it) => {
      if (it.on) count += 1;
      return { text: it.text, on: it.on };
    });
    return { key: g.key, title: g.title, items };
  });
  return { groups: list, selectedCount: count };
}

/** 环境录入 */
function buildEnvVM(schema) {
  return {
    fields: schema.fields.map((f) => ({
      key: f.key,
      label: f.label,
      value: f.value,
      placeholder: f.placeholder || '',
      filled: !!f.value
    })),
    events: schema.events.map((e) => ({
      name: e,
      on: e === '施肥' || e === '降温'
    }))
  };
}

/** 诊断中进度 */
function buildProgressVM(steps) {
  const done = steps.filter((s) => s.state === 'done').length;
  return {
    steps: steps.map((s) => ({
      title: s.title,
      desc: s.desc,
      done: s.state === 'done',
      doing: s.state === 'doing',
      muted: s.state === 'todo'
    })),
    percent: Math.round((done / steps.length) * 100)
  };
}

/** 候选病列表 */
function buildCandidatesVM(diag) {
  return {
    imageCount: diag.imageCount,
    candidates: diag.candidates.map((c) => ({
      icon: c.icon,
      name: c.name,
      sub: c.sub,
      conf: c.conf,
      confText: c.conf + '%',
      barClass: c.level === 'warn' ? 'warn' : (c.level === 'muted' ? 'muted' : ''),
      muted: c.level === 'muted',
      top: c.level === 'brand'
    }))
  };
}

/** 诊断详情：病灶 + 候选 + 依据 */
function buildDetailVM(diag) {
  const base = buildCandidatesVM(diag);
  return {
    imageCount: base.imageCount,
    candidates: base.candidates,
    lesions: diag.lesions.map((l) => ({
      label: l.label,
      style: `left:${l.left}%;top:${l.top}%;width:${l.width}%;height:${l.height}%;`
    })),
    reasons: diag.reasons.map((r) => ({
      icon: r.ok ? '✅' : '❌',
      text: r.text
    })),
    evidence: diag.evidence.map((e) => ({
      cls: 'badge b' + e.type,
      text: e.text
    }))
  };
}

/** 补证据 */
function buildProofVM(proofs) {
  return {
    options: proofs.map((p) => ({
      key: p.key,
      title: p.title,
      cost: p.cost,
      costType: p.costType,
      desc: p.desc,
      from: p.from,
      to: p.to,
      gain: p.to - p.from,
      note: p.note,
      probed: p.key === 'micro'
    }))
  };
}

/** 方案 */
function buildPlanVM(plan) {
  return {
    drugs: plan.drugs.map((d) => ({
      level: d.level,
      name: d.name,
      verdict: d.verdict,
      note: d.note,
      tag: d.tag,
      tagType: d.tagType
    })),
    doses: plan.doses.map((d) => ({
      name: d.name,
      formula: d.formula,
      value: d.value
    })),
    withdraw: {
      startText: '末次给药 ' + plan.withdraw.start + ' ＋ 休药期 ' + plan.withdraw.days + ' 天',
      dateText: plan.withdraw.date + ' 可安全出塘',
      days: plan.withdraw.days
    }
  };
}

/** 合规校验 */
function buildComplianceVM(data) {
  return {
    checks: data.checks.map((c) => ({ title: c.title, note: c.note })),
    sources: data.sources.map((s) => ({ k: s.k, v: s.v })),
    passCount: data.checks.length
  };
}

/**
 * 出塘日历 · 2026 年 11 月
 * @param {Number} markDay 今日（高亮）
 */
function buildCalendarVM(markDay = 23) {
  const cells = [];
  let seq = 0;
  const push = (text, cls) => {
    seq += 1;
    cells.push({ id: 'c' + seq, text: String(text), cls });
  };
  // 前置：10 月 26–31
  for (let d = 26; d <= 31; d += 1) push(d, 'd dim');
  // 11 月 1–30
  for (let d = 1; d <= 30; d += 1) push(d, d === markDay ? 'd mark' : 'd');
  // 后置：12 月 1–6
  for (let d = 1; d <= 6; d += 1) push(d, 'd dim');
  return { title: '2026 年 11 月', weekdays: ['一', '二', '三', '四', '五', '六', '日'], cells };
}

/** 用药单 */
function buildReceiptVM(diag, plan) {
  const top = diag.candidates[0];
  return {
    rows: [
      { k: '塘口', v: '东塘 3 号（3 亩 / 2m）' },
      { k: '品种 / 存塘', v: '草鱼 / 约 1800 斤' },
      { k: '诊断', v: top.name + '（' + top.conf + '%）' }
    ],
    meds: [
      { k: '外用', v: '消毒剂 1.2 kg，全池泼洒' },
      { k: '内服', v: '氟苯尼考 18 g/天 × 5 天' },
      { k: '用法', v: '拌饵投喂，每日 1 次' }
    ],
    tail: [
      { k: '首日给药', v: '2026-11-23' },
      { k: '休药期', v: plan.withdraw.days + ' 天' },
      { k: '可安全出塘', v: '2026-12-07', strong: true }
    ]
  };
}

/** 相似病例 */
function buildSimilarVM(data) {
  return {
    total: data.total,
    effective: data.effective,
    rate: data.rate,
    headline: data.total + ' 例中有 ' + data.effective + ' 例有效',
    cases: data.cases.map((c) => ({
      id: c.id,
      tagType: c.tagType,
      tagText: c.tagText,
      meta: c.meta,
      symptom: c.symptom,
      plan: c.plan,
      result: c.result,
      extra: c.extra,
      extraType: c.extraType
    }))
  };
}

module.exports = {
  buildStartVM,
  buildSymptomVM,
  buildEnvVM,
  buildProgressVM,
  buildCandidatesVM,
  buildDetailVM,
  buildProofVM,
  buildPlanVM,
  buildComplianceVM,
  buildCalendarVM,
  buildReceiptVM,
  buildSimilarVM
};
