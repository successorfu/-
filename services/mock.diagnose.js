/**
 * Model 层 · 诊断域数据
 * ------------------------------------------------------------
 * 与 mock.js 同层，按业务域拆分，避免单文件膨胀。
 */

/** 可拍部位 */
const PARTS = [
  { key: 'body', icon: '🐟', name: '体表', desc: '充血/溃烂/白点', shot: true },
  { key: 'gill', icon: '🫁', name: '鳃丝', desc: '烂鳃/白鳃/寄生虫', shot: false },
  { key: 'anus', icon: '🕳️', name: '肛门/腹部', desc: '红肿/腹水', shot: false },
  { key: 'fin', icon: '🪶', name: '鳍', desc: '蛀鳍/白尾', shot: false }
];

/** 症状字典（分组） */
const SYMPTOM_GROUPS = [
  {
    key: 'body',
    title: '🐟 体表',
    items: [
      { text: '鳃盖充血', on: true },
      { text: '体表溃烂', on: false },
      { text: '白点', on: false },
      { text: '棉絮状附着', on: false },
      { text: '鳞片脱落', on: false }
    ]
  },
  {
    key: 'gill',
    title: '🫁 鳃',
    items: [
      { text: '鳃丝腐烂', on: true },
      { text: '附泥', on: true },
      { text: '白鳃', on: false },
      { text: '鳃丝肿胀', on: false }
    ]
  },
  {
    key: 'behave',
    title: '🏃 行为',
    items: [
      { text: '浮头', on: true },
      { text: '不吃食', on: true },
      { text: '独游', on: false },
      { text: '狂游打转', on: false }
    ]
  },
  {
    key: 'die',
    title: '📉 死亡情况',
    items: [
      { text: '每天 20–50 条', on: true },
      { text: '零星几条', on: false },
      { text: '大量急性死亡', on: false }
    ]
  }
];

/** 环境录入字段 */
const ENV_FIELDS = [
  { key: 'temp', label: '水温', value: '26.4 ℃' },
  { key: 'ph', label: 'pH', value: '8.2' },
  { key: 'nh3', label: '氨氮', value: '0.6 mg/L' },
  { key: 'do', label: '溶解氧', value: '', placeholder: '未填（可跳过）' }
];

/** 最近三天操作（干扰项） */
const ENV_EVENTS = ['换水', '施肥', '杀虫', '消毒', '并塘', '暴雨', '降温'];

/** 补证据选项 */
const PROOFS = [
  {
    key: 'water',
    title: '测 pH 与氨氮',
    cost: '3 分钟',
    costType: 'success',
    desc: '用试纸或便携仪器，把读数填进来即可',
    from: 62,
    to: 80,
    note: '氨氮超过 0.5mg/L 时，烂鳃大概率是水质诱发的，处理方式完全不同——所以才要测。'
  },
  {
    key: 'micro',
    title: '拍鳃丝压片镜检',
    cost: '15 分钟 · 需显微镜',
    costType: 'gray',
    desc: '能把寄生虫性烂鳃从 34% 直接定死或排除',
    from: 62,
    to: 91,
    note: ''
  }
];

/** 诊断进度（P20） */
const DIAG_STEPS = [
  { title: '照片质检', desc: '3 张合格 · 检出 4 处异常', state: 'done' },
  { title: '病灶识别', desc: '鳃丝腐烂、鳃盖充血', state: 'done' },
  { title: '环境因素排查', desc: '氨氮 0.6 偏高，可能是诱因', state: 'done' },
  { title: '比对历史病例', desc: '进行中…', state: 'doing' },
  { title: '生成方案', desc: '', state: 'todo' }
];

/** 相似病例 */
const SIMILAR = {
  total: 12,
  effective: 9,
  rate: 75,
  cases: [
    {
      id: 'C-2026-0417',
      tagType: 'success',
      tagText: '有效',
      meta: '草鱼 · 3.2 亩 · 水温 26℃ · pH 8.1 · 氨氮 0.55',
      symptom: '症状：鳃丝腐烂、附泥、浮头、日死亡 28 条',
      plan: '方案：外用消毒 1 次 ＋ 内服 5 天',
      result: '结果：D3 降至 12 条，D7 降至 3 条',
      extra: '相似度 94% · 归因置信度 高',
      extraType: 'ok'
    },
    {
      id: 'C-2026-0389',
      tagType: 'error',
      tagText: '无效',
      meta: '草鱼 · 2.8 亩 · 水温 25℃ · pH 7.8 · 氨氮 0.9',
      symptom: '',
      plan: '方案同上，但氨氮始终没降下来',
      result: 'D3 死亡数反而上升，后转调水才控制住',
      extra: '相似度 88% · 注意：该例氨氮高于本例',
      extraType: 'bad'
    }
  ]
};

/** 合规校验项 */
const CHECKS = [
  { title: '禁用清单', note: '与 2026 版禁用名录比对，未命中' },
  { title: '休药期', note: '氟苯尼考 × 草鱼 = 14 天，已计入出塘日历' },
  { title: '配伍禁忌', note: '方案内 2 种药无禁忌组合' }
];

/** 数据来源版本 */
const SOURCES = [
  { k: '禁用清单', v: '农业农村部 2026 版' },
  { k: '生效日期', v: '2026-01-01' },
  { k: '休药期表', v: '兽药典 2025 版' },
  { k: '最后更新', v: '2026-11-02' }
];

module.exports = { PARTS, SYMPTOM_GROUPS, ENV_FIELDS, ENV_EVENTS, PROOFS, DIAG_STEPS, SIMILAR, CHECKS, SOURCES };
