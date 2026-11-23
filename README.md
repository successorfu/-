# 塘口鱼医 · 微信小程序

## 怎么打开

1. 双击 `打开开发者工具.bat`：自动按脚本所在目录导入（克隆到任何路径都能用）；找不到 CLI 时把开发者工具的 `cli.bat` 拖到它上面即可
2. 或者：微信开发者工具 → 导入项目 → 目录选本文件夹
3. AppID 用「测试号」或游客模式（`project.config.json` 已填 `touristappid`）
4. 编译。**入口页是 `pages/home/home`（MVVM 版首页）**

零注册、零服务器、零 npm 依赖。

---

## 架构（MVVM）

```
View（WXML/WXSS）
  ↑ 只做渲染，不写业务逻辑
  │ setData(vm)
ViewModel（viewmodels/*.vm.js）
  ↑ 纯函数：Model 原始数据 → View 直接可用的结构
  │ Promise
Service（services/api.js）
  ↑ 数据访问唯一出口，页面永远不直接碰 mock
  │ require
Model（services/mock.js）
    假数据源；接后端时只换这一层
```

### 分层规则（重要）

| 层 | 可以做什么 | 禁止做什么 |
|---|---|---|
| View | 绑定、循环、条件渲染、触发事件 | 调 `wx.request`、算业务数据 |
| ViewModel | 数据加工、字段拼装、格式化 | 调 `wx.*`、`setData`、依赖页面 |
| Service | 调接口、统一错误处理、加缓存 | 关心 UI 字段长什么样 |
| Model | 定义数据结构、假数据 | 关心页面 |

这样做的直接好处：**换后端只动 Service，改样式只动 View，改文案只动 ViewModel**，三件事互不牵连。

### 目录

```
小程序/
├── app.js / app.json / app.wxss     全局配置与设计 token
├── project.config.json
├── services/
│   ├── mock.js                      假数据（Model 层）
│   └── api.js                       数据访问出口（Service 层）
├── viewmodels/
│   └── home.vm.js                   首页 ViewModel（纯函数）
├── components/
│   └── p-cell/                      通用单元格（图标+标题+副标题+右侧标签/箭头）
└── pages/
    ├── home/                        ★ MVVM 参考实现
    └── index/                       34 屏全量原型（保留，用于走查）
```

### 页面现状

| 页面 | 状态 | 说明 |
|---|---|---|
| `pages/home/home` | ✅ MVVM 完成 | 数据全部走 api → vm → setData，含骨架屏、下拉刷新 |
| `pages/diagnose/diagnose` | ✅ MVVM 完成 | P10–P44 共 17 屏，`step` 状态机驱动，按需加载（用哪屏取哪屏） |
| `pages/index/index` | ⚠️ 原型态 | 34 屏用 `wx:if` 静态渲染，未接数据层，留作全量走查 |

两个页面互相可达：首页底部「查看 34 屏全量原型」，原型「我的」页有「MVVM 版首页」。

---

## 迁移路线（按这个顺序做）

1. **`p-cell` 已抽出** —— 其余重复块继续抽：`p-tag`、`p-bar`、`p-empty`
2. ✅ **诊断域已完成**：`pages/diagnose`（P10–P44 共 17 屏）+ `viewmodels/diagnose.vm.js`
3. **下一步**：`pages/case`（P50–P80）、`pages/tools`（P90–P95）
4. **接真相机**：`camera` 组件替换 P11 的假取景框
5. **接 TDesign**：`npm i tdesign-miniprogram` + 构建 npm，把自绘组件换成官方组件（只是换标签名，样式已对齐）

---

## 已知占位

- 首页待办点击只弹 Toast（目标页还没拆出来）
- P11 相机是假取景框
- P20 诊断进度是静态的
- P93 热力图是 CSS 色块
- 没有后端，`services/api.js` 返回内存数据
