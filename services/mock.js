/**
 * Model 层 · 假数据源
 * ------------------------------------------------------------
 * 这一层只负责"数据长什么样"，不关心页面。
 * 接真后端时，把这里换成 request 即可，上层（service/vm/view）不用动。
 */

const PONDS = [
  {
    id: 'P-001',
    name: '东塘 3 号',
    fish: '草鱼',
    area: 3.0,
    depth: 2.0,
    stockTail: 4500,
    avgWeight: '4 两/尾',
    stockWeight: 1800,
    county: '江西 · 南昌县',
    status: 'rest', // rest = 休药期
    statusText: '休药期',
    withdrawDays: 14,
    water: { temp: 26.4, ph: 8.2, nh3: 0.6, do: 5.8 }
  },
  {
    id: 'P-002',
    name: '西塘 1 号',
    fish: '鲫鱼',
    area: 2.0,
    depth: 1.5,
    stockTail: 3000,
    avgWeight: '3 两/尾',
    stockWeight: 900,
    county: '江西 · 南昌县',
    status: 'normal',
    statusText: '正常',
    withdrawDays: 0,
    water: { temp: 26.1, ph: 7.8, nh3: 0.2, do: 6.1 }
  },
  {
    id: 'P-003',
    name: '新开挖塘',
    fish: '—',
    area: 2.5,
    depth: 1.8,
    stockTail: 0,
    avgWeight: '—',
    stockWeight: 0,
    county: '江西 · 南昌县',
    status: 'empty',
    statusText: '空塘',
    withdrawDays: 0,
    water: null
  }
];

const TODOS = [
  {
    id: 'T-001',
    icon: '⏰',
    title: '回访打卡 · 第 3 天',
    sub: '昨天用药，今天问一句死鱼数',
    tagType: 'error',
    tagText: '待填',
    to: 'followup'
  },
  {
    id: 'T-002',
    icon: '💊',
    title: '内服第 2/5 天',
    sub: '氟苯尼考 · 每日 1 次 · 拌饵',
    tagType: 'warning',
    tagText: '进行中',
    to: 'plan'
  }
];

const RECENT_CASES = [
  {
    id: 'C-2026-0417',
    icon: '🐟',
    name: '细菌性烂鳃病',
    sub: '3 天前 · 已验证有效',
    tagType: 'success',
    tagText: '已见效',
    status: 'verified'
  }
];

const ALL_CASES = [
  { id: 'C-2026-0431', icon: '🐟', name: '细菌性烂鳃病', sub: '11-23 · 东塘 3 号', tagType: 'warning', tagText: '待回访', status: 'pending' },
  { id: 'C-2026-0417', icon: '🐟', name: '细菌性烂鳃病', sub: '11-20 · 东塘 3 号', tagType: 'success', tagText: '已验证', status: 'verified' },
  { id: 'C-2026-0398', icon: '💧', name: '水质突变应激', sub: '11-02 · 西塘 1 号', tagType: 'success', tagText: '已验证', status: 'verified' },
  { id: 'C-2026-0376', icon: '🐛', name: '锚头鳋', sub: '10-18 · 东塘 3 号', tagType: 'success', tagText: '已验证', status: 'verified' },
  { id: 'C-2026-0342', icon: '🫁', name: '鳃霉病', sub: '10-05 · 西塘 1 号', tagType: 'error', tagText: '无效', status: 'failed' },
  { id: 'C-2026-0311', icon: '❓', name: '证据不足', sub: '09-28 · 东塘 3 号', tagType: 'gray', tagText: '失访', status: 'lost' }
];

/** 首页聚合数据：一次取齐，避免页面里多次 await */
const HOME = {
  county: '江西 · 南昌县',
  pond: PONDS[0],
  notice: '未来 48 小时降温 6℃，注意应激与缺氧，建议减料 30%。',
  todos: TODOS,
  recentCases: RECENT_CASES,
  metric: { label: '天可出塘', value: 14 }
};

/** 诊断结果（候选病 + 证据） */
const DIAGNOSIS = {
  lesions: [{ label: '鳃丝腐烂 · 92%', left: 35, top: 42, width: 19, height: 19 }],
  imageCount: 3,
  candidates: [
    { icon: '🦠', name: '细菌性烂鳃病', sub: '鳃丝腐烂 · 附泥 · 鳃盖充血', conf: 82, level: 'brand', badges: [{ type: 1, text: '国标' }, { type: 2, text: '图谱' }] },
    { icon: '🪱', name: '寄生虫性烂鳃', sub: '需镜检确认，暂无法排除', conf: 34, level: 'warn', badges: [] },
    { icon: '🍄', name: '水培病', sub: '无棉絮状菌丝，已基本排除', conf: 8, level: 'muted', badges: [] }
  ],
  reasons: [
    { ok: true, text: '鳃丝末端腐烂、附泥，鳃盖内表皮充血——符合细菌性烂鳃的典型表现。' },
    { ok: false, text: '不像水霉：没有棉絮状菌丝，水温 26℃ 也不利于水霉暴发。' },
    { ok: false, text: '不像寄生虫：体表未见锚头鳋，但鳃丝压片没拍，所以只降到 34% 而非排除。' }
  ],
  evidence: [{ type: 1, text: '国标·诊断规范' }, { type: 2, text: '教材·鱼病学' }, { type: 4, text: '同类病例 12 例' }]
};

/** 方案 + 合规 */
const PLAN = {
  drugs: [
    { level: 'g', name: '氟苯尼考', verdict: '可用', note: '休药期 14 天 ｜ 草鱼 ｜ 按体重 10mg/kg', tag: '绿', tagType: 'success' },
    { level: 'y', name: '甲砜霉素', verdict: '谨慎', note: '与氟苯尼考同类，不可叠加使用', tag: '黄', tagType: 'warning' },
    { level: 'r', name: '氯霉素类', verdict: '禁用', note: '已列入农业农村部禁用清单（2026 版）', tag: '红', tagType: 'error' }
  ],
  doses: [
    { name: '水体体积', formula: '3 亩 × 2m', value: '4000 m³' },
    { name: '外用消毒', formula: '0.3 mg/L', value: '1.2 kg' },
    { name: '内服（5 天）', formula: '10 mg/kg 体重', value: '90 g' },
    { name: '每日拌饵', formula: '按 3% 投饵率', value: '18 g' }
  ],
  withdraw: { start: '11-23', days: 14, date: '12 月 7 日' }
};

/** 回访 */
const FOLLOWUP = {
  deadBefore: 30,
  deadNow: 8,
  options: [
    { key: 1, title: '明显减少了', sub: '比用药前少一半以上' },
    { key: 2, title: '差不多', sub: '没明显变化' },
    { key: 3, title: '更多了', sub: '死鱼数还在涨' }
  ],
  timeline: [30, 20, 12, 9, 8]
};

/** 药品库 */
const DRUGS = [
  { name: '氟苯尼考', tagType: 'success', tagText: '可用', sub: '酰胺醇类抗生素 · 国标兽药' },
  { name: '氯霉素', tagType: 'error', tagText: '已禁用', sub: '列入农业农村部禁用清单（2026 版）' },
  { name: '甲砜霉素', tagType: 'warning', tagText: '谨慎', sub: '与氟苯尼考同类，切勿叠加使用' }
];

module.exports = { PONDS, HOME, ALL_CASES, DIAGNOSIS, PLAN, FOLLOWUP, DRUGS };
