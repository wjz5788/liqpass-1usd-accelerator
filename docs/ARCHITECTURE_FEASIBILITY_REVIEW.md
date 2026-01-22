# LiqPass 多业务模块“单仓承载”架构可行性评审（可执行版）

评审对象：`/Volumes/01_hard/web3/liqpass-1usd-accelerator`（Vite + React Router + Wagmi/RainbowKit）

目标：在同一套前端框架/代码仓库下承载多个业务模块（1USD Accelerator / LiqPass 保险 / 策略区 / 未来新增模块），长期可维护、可扩展、低耦合、可独立发布，并支持“模块可移除”。

---

## 0) 最少信息（<=8条）

信息不全会影响“独立发布”的结论强度，但不影响给出初版方案。你只需要补齐下面 8 条里的关键项即可：

1. 独立发布的定义：是“独立发版但仍同域同应用（按路由灰度）”，还是“独立部署（不同产物/不同 CDN/不同回滚）”？
2. 入口策略：是否必须一个主域名 `app.liqpass.com`，还是允许 `insurance.liqpass.com` 等子域？
3. 团队组织：未来是否多团队并行（每个模块独立 owner）？
4. 合约/链：是否会多链（Base + 其它），以及每个模块是否有独立合约版本周期？
5. 权限边界：是否存在模块级管理员、风控、运营后台等强隔离角色？
6. 数据边界：模块间是否需要共享强一致数据（例如同一订单/保单在多个模块展示）？
7. 性能目标：首屏体积、构建时间、模块加载隔离（“访问 A 不加载 B”）是否硬性指标？
8. 后端形态：是否已有 BFF/网关，还是前端直接打多个后端服务？

默认假设（基于当前代码）：单团队；同域名；Demo 快速迭代；模块间共享钱包登录；后端暂弱/Mock 较多；未来可能要“独立部署”。

---

## 1) 结论：单仓多模块 vs 多仓+统一入口

### 结论

推荐：`单仓多模块（Monorepo 形态） + 统一 Shell + 模块注册表 + 严格边界治理`。

风险评级：中。

### 理由（结合你当前仓库现实）

- 你已经在单仓内形成了“域”结构：`src/domains/{accelerator,insurance,arena,stocks}` + 统一聚合路由 `src/app/router.tsx`，这是单仓多模块的天然落点。
- Vite 已配置多入口：`vite.config.ts` 的 `rollupOptions.input` 目前有 `index.html` 和 `meme-board.html`，说明你已在做“多入口/可独立运行”的雏形。
- 模块共性较强：钱包/链配置/日志埋点/权限守卫/设计系统复用高；拆多仓会引入私有包发布、版本同步、跨仓 CI/CD 复杂度。

### 主要风险（为什么不是“低”）

- “独立发布”如果指独立部署：在单 Vite SPA 里很难做到真正独立部署/回滚，需要演进到“多 app 构建产物”或微前端。
- 当前已有几处潜在耦合点：
  - 全局单例：`src/services/http.ts` 导出 `httpClient`；`src/services/accelerator.ts` 导出 `acceleratorAPI`。
  - 链配置锁死：`src/wallet/wagmi.ts` 只启用 `base8453`（`src/wallet/chains.ts`）。
  - 路由守卫依赖字符串：`src/app/router.tsx` 通过 path 字符串判断 `/accelerator/admin` 等。

### 何时选“多仓+统一入口”

当你满足以下任意 2 条，建议考虑“多仓或单仓多 app（仍可同仓）”更强隔离方案：

- 多团队强并行，且发布节奏显著不同（例如 Accelerator 周更、Insurance 月更且强监管）。
- 模块需要不同技术栈/渲染模式（SSR/edge/不同路由框架）。
- 需要独立回滚/熔断/隔离事故（保险/风控模块尤其常见）。

---

## 2) 模块边界（Domain Boundary）

原则：每个模块在“数据、页面、路由、服务、合约、索引”上自给自足；跨模块只能通过共享基础设施层、或显式的跨域接口（BFF/事件/只读缓存）。

### Accelerator / 1USD（含 MemeBoard、Market demo）

- Domain 数据：
  - 业务实体：MemeToken / Market / LMSR（当前在 `src/domain/{meme,market,lmsr}.ts`，建议归属到 Accelerator 模块或提为共享“金融定价引擎包”，见第 3 节）。
  - 业务状态：项目列表/筛选/投票/市场持仓/抽奖等（当前部分在 `src/store/projectsStore.ts`）。
- 页面：`src/domains/accelerator/pages/*`（已存在）。
- 路由：`src/domains/accelerator/routes.ts`（已存在，路径前缀 `/accelerator/*`，良好）。
- 服务：建议模块私有 `domains/accelerator/services/*`（当前 `src/services/accelerator.ts` 是全局，属于“应当独立”的域服务）。
- 合约：
  - 交互：建议 `domains/accelerator/contracts/*`（当前合约 demo 在 `contracts/LiqPassBinaryMarket.sol`，前端相关组件在 `src/components/features/MarketDemo/*`）。
  - 地址/ABI：严格模块内管理，禁止被其他模块直接 import。
- 索引：
  - 搜索索引（当前 `src/search/searchIndex.ts`）如果包含 accelerator 专属内容，应该拆成 `domains/accelerator/search/*` 并由 Shell 聚合。

应该独立：定价/概率算法、项目筛选/排序、市场交易/结算模型、合约 ABI/地址、accelerator API。

可以共享：钱包/链配置、通用 UI、通用表格/分页、通用缓存（React Query QueryClient）、日志/埋点 SDK。

### Insurance（保险）

- Domain 数据：保单、保费报价、理赔状态机、风控/限制规则、订单支付状态。
- 页面：`src/domains/insurance/pages/InsurancePage.tsx`（已存在，后续应拆成 Purchase/Policy/Claim 子页面）。
- 路由：`src/domains/insurance/routes.ts`（已存在；建议升级到 `/insurance/*` 子路由体系）。
- 服务：独立 `domains/insurance/services/*`，包含报价/保单/理赔 API。
- 合约：如果保险最终链上结算，ABI/地址归属保险模块。
- 索引：保险条款/产品/FAQ 搜索索引归模块。

应该独立：定价（保费/费率）、风控（eligibility/限额）、理赔状态机、保险合约/结算逻辑。

可以共享：钱包/权限守卫、表单基础组件、通用 toast/错误边界、埋点。

### Arena（比赛区）

- Domain 数据：比赛、赛制、参赛者、排名快照、奖励规则。
- 页面：`src/domains/arena/pages/ArenaPage.tsx`（已存在）。
- 路由：`src/domains/arena/routes.ts`（已存在，`/arena`）。
- 服务：`domains/arena/services/*`（比赛列表、排名、报名等）。
- 合约：如奖励链上发放，归模块。
- 索引：比赛索引（按赛季/标签/策略类型）。

应该独立：比赛规则计算、排名聚合逻辑、奖励分发逻辑。

可以共享：图表组件封装、时间/数字格式化、通用列表页骨架。

### Strategies / Stocks（策略区）

当前命名上存在分歧：路由是 `/strategies`，但域目录是 `src/domains/stocks/`。建议确定模块命名（策略域建议统一为 `strategies`）。

- Domain 数据：策略、回测结果、风控参数、持仓/收益曲线、模拟器状态。
- 页面：`src/domains/stocks/pages/{StrategiesPage,StrategySimulatorPage,ProjectResearchPage}.tsx`（已存在）。
- 路由：`src/domains/stocks/routes.ts`（已存在）。
- 服务：策略市场/回测/模拟 API。
- 合约：如策略镜像交易链上执行，归模块。
- 索引：策略索引（标签、资产、风险等级）。

应该独立：回测模型、模拟器/参数校验、策略授权/复制交易逻辑。

可以共享：通用数据可视化组件、通用权限（例如“只有连接钱包可用”）。

---

## 3) 共享策略（允许共享 vs 禁止共享）

### ✅ 可以共享（基础设施层，长期稳定、跨模块一致）

- 钱包登录/连接：`src/wallet/*`（RainbowKit/Wagmi + 同步到 store：`src/wallet/useSyncWalletToStore.ts`）。
- 链配置与 RPC：集中为 `src/config/chains.ts`（当前在 `src/wallet/chains.ts`，建议迁移/重命名，避免“钱包层拥有链配置”的隐性耦合）。
- 网络/环境配置：`src/config/env.ts`（已存在）。
- 通用 API Client：`src/services/http.ts` 应升级为“可注入 client factory”，但实现可以共享。
- UI 组件库：`src/components/common/*`、`src/components/layout/*`（只允许无业务语义）。
- 统一路由类型与壳：`src/app/*`（Router、guards、ErrorBoundary）。
- 日志/监控/埋点：建议新增 `src/infra/observability/*`（Sentry、OpenTelemetry、埋点 SDK）。
- 权限与角色：`src/app/guards/*`（已存在）。
- 只读公共类型：`src/shared/types/*`（比如 ChainId、Role、Address 类型）。

共享原因：这些能力需要全站一致，否则会出现“一个模块能连钱包，另一个不能 / 链切换不一致 / 监控无法聚合”的平台级灾难。

### ❌ 禁止共享（业务核心、强变动、高风险耦合源）

- 业务状态（Zustand store）跨模块共享：
  - 例如 `projectsStore` 不应被 Insurance/Arena 读取/写入。
  - 正确方式：模块内 store + 事件/Query cache（只读）+ BFF 聚合。
- 定价/风控/结算逻辑共享：
  - Insurance 保费、风控，Accelerator 的概率/定价算法都属于核心；共享会导致“一个模块改动影响另一模块盈亏”。
- 后端数据库表/强业务 API 直接共享：
  - 不要让 A 模块直接调用 B 模块的业务 API；通过网关/BFF 做领域隔离。
- 合约 ABI/地址共享：
  - 合约版本变更频繁且回滚成本高；必须模块独立版本化。
- “业务 UI 组件”共享：
  - 禁止把 `ProjectCard` 这种业务语义组件挪到共享层，否则共享层会变成上帝组件。

### ⚠️ 条件共享（需要明确 owner 与稳定接口）

- 金融/定价引擎（例如 `lmsr`）：如果多个模块都需要，可抽为 `packages/quant-core`（纯函数、无 React、无网络依赖）。否则归 Accelerator。
- 搜索索引：Shell 负责聚合，各模块提供自己的索引片段（manifest 形式）。
- 路由与导航：Shell 使用模块 manifest 输出菜单，模块不直接改 Shell 导航组件。

---

## 4) 推荐架构方案（目录结构 + 入口 + 依赖关系）

你当前是单一 Vite 工程（`src/*`）+ 少量多入口 HTML。要满足“可独立移除 + 可独立发布”，推荐分两阶段落地：

### 方案 A（现在就能做，最小改动）：单 SPA + 模块 manifest + 严格边界

关键点：每个模块只暴露一个入口文件 `domains/<module>/index.ts`（或 `manifest.ts`），Shell 只依赖 manifest。

推荐前端目录（保留你已有结构，做增量规范化）：

```text
src/
  app/
    router.tsx                 # 只做“注册表聚合”，不写业务判断
    routes/types.ts
    guards/
  infra/
    http/
      client.ts                # http client factory（替代单例）
    web3/
      chains.ts                # 统一链配置（从 wallet/chains.ts 迁移）
    observability/
      logger.ts
      analytics.ts
  shared/
    types/
    utils/
  components/
    common/
    layout/
  domains/
    accelerator/
      index.ts                 # 该模块唯一对外入口（routes/nav/init/contracts)
      routes.ts
      pages/
      components/
      services/
      store/
      contracts/
      search/
    insurance/
      index.ts
      routes.ts
      ...
    arena/
      index.ts
      routes.ts
      ...
    strategies/                # 建议从 stocks 重命名
      index.ts
      routes.ts
      ...
```

模块入口（示例）：

```ts
// src/domains/insurance/index.ts
import type { AppRouteObject } from '@/app/routes/types'

export type DomainModule = {
  id: 'insurance'
  basePath: '/insurance'
  routes: AppRouteObject[]
  navItems?: Array<{ path: string; label: string }>
  init?: () => void | Promise<void>
}

export const insuranceModule: DomainModule = {
  id: 'insurance',
  basePath: '/insurance',
  routes: (await import('./routes')).insuranceRoutes,
  navItems: [{ path: '/insurance', label: '保险区' }],
}
```

Shell 注册表（可移除性关键）：

```ts
// src/app/modules.ts
import { acceleratorModule } from '@/domains/accelerator'
import { insuranceModule } from '@/domains/insurance'
import { arenaModule } from '@/domains/arena'

export const enabledModules = [
  acceleratorModule,
  insuranceModule,
  arenaModule,
] as const
```

删除模块时只需要：

1) 删除 `src/domains/<module>`
2) 从 `src/app/modules.ts` 移除该模块

### 方案 B（满足“可独立部署/回滚”）：单仓多 app（Monorepo），共享 packages

当你明确“独立发布=独立部署”时，建议直接上 monorepo（仍然是单仓）：

```text
apps/
  shell/                       # 主入口（登录/导航/路由/iframe/microfrontend 挂载点）
  accelerator/                 # 可单独部署
  insurance/
  arena/
  strategies/
packages/
  ui/                          # 纯 UI，无业务
  infra-http/                  # http client + auth header
  infra-web3/                  # wagmi/rainbowkit 封装
  shared-types/
  quant-core/                  # lmsr/market 等纯函数（如确实多模块复用）
contracts/
  accelerator/
  insurance/
  shared/
```

这个方案天然满足“模块可移除”和“独立部署”，代价是工程化与 CI/CD 成本上升。

### 依赖关系（硬规则）

- `domains/*` 只能依赖：`infra/*`、`shared/*`、`components/common`、自己域内代码。
- `domains/A` 禁止 import `domains/B`。
- `components/features/*` 如果只被单域使用，必须下沉到对应域；如果多域使用，必须变成“无业务语义”的 `components/common` 或被拆为 `packages/ui`。

边界强制建议：

- ESLint 边界：`eslint-plugin-boundaries`（JS Boundaries）文档与规则：
  - https://www.jsboundaries.dev/docs/overview/
  - https://www.jsboundaries.dev/docs/rules/
  - https://www.npmjs.com/package/eslint-plugin-boundaries
- 规模变大后用 Nx 的 `@nx/enforce-module-boundaries`：
  - https://nx.dev/docs/features/enforce-module-boundaries
  - https://nx.dev/nx-api/eslint-plugin/documents/enforce-module-boundaries

---

## 5) 最容易把项目搞崩的 10 个坑 + 规避手段

1. 全局状态污染（God Store）
   - 现状信号：`src/store/*` 逐渐承载业务状态（例如 `src/store/projectsStore.ts` 与 accelerator 强耦合）。
   - 规避：业务 store 下沉到 `domains/<module>/store`；全局 store 只保留 platform state（wallet/session/ui）。

2. 依赖倒灌（domain 相互 import）
   - 现状风险：目前未发现明显 `domains/*` 互相 import，但 `components/features` 容易变成“跨域捷径”。
   - 规避：强制“跨域只能通过 shared/infra 或 manifest 接口”；用 ESLint boundary rule 卡死。

3. 共享组件变成上帝组件
   - 现状风险：`src/components/features/*` 语义不清，很容易承载业务逻辑。
   - 规避：共享层只能提供“语义无关”的 primitives；业务组件必须留在 domain。

4. 路由字符串散落，守卫/跳转脆弱
   - 现状信号：`src/app/router.tsx` 对 `/accelerator/admin` 做硬编码判断；多处 `navigate('/accelerator')`。
   - 规避：每个模块导出 `paths.ts` 或 `routeIds`；守卫基于 route meta（如 `requiredRole`）而不是 path 字符串。

5. 链/RPC 切换混乱
   - 现状信号：`src/wallet/wagmi.ts` 仅启用 Base；`src/wallet/chains.ts` 从 `config.web3Provider` 读取 RPC。
   - 规避：把链注册表提升为 `infra/web3/chains.ts`，所有模块只读；合约地址按 chainId 显式映射。

6. 单例服务（httpClient/xxxAPI）导致测试与隔离困难
   - 现状信号：`src/services/http.ts` 导出 `httpClient` 单例；`src/services/accelerator.ts` 导出 `acceleratorAPI`。
   - 规避：改为 `createHttpClient(config)`；域服务在模块 init 时注入 client；测试可替换。

7. Mock 数据渗透生产逻辑
   - 现状信号：`src/store/projectsStore.ts` 默认 `useMock = true`；`src/services/mock/*` 被多处使用。
   - 规避：Mock 只允许在 `__mocks__` 或 `dev-only` 入口；通过 feature flag/ENV 控制，不允许默认 true。

8. “页面=业务逻辑容器”导致复用与测试困难
   - 现状信号：不少页面文件体积大（例如 Dashboard 页面包含大量 UI/逻辑混杂）。
   - 规避：页面只做 composition；业务逻辑进 `hooks/services/store`，UI 进 `components`。

9. 命名与模块归属不一致导致协作崩
   - 现状信号：`stocks` 域承载 `strategies` 路由；`src/domain/*` 实际是 accelerator 领域模型。
   - 规避：建立模块命名与 owner 表；重命名/迁移必须通过 manifest 与边界测试。

10. 构建产物与代码分割不受控（“访问 A 却加载 B”）
   - 现状信号：已用 `React.lazy`，但如果共享层引入了其它模块的重依赖，仍会被打进公共 chunk。
   - 规避：按路由懒加载 + chunk 可视化；必要时配置 `manualChunks`（参考 Vite build 文档：https://vite.dev/guide/build 以及 Rollup chunk splitting）。

---

## 6) 演进路线（Demo -> 3个月 -> 规模化）

### 现在（Demo 阶段，最省事）

- 保持单 Vite 工程。
- 立刻引入“模块 manifest + 注册表”（方案 A），目标是“可移除”。
- 下沉强业务状态与服务：
  - `src/store/projectsStore.ts` -> `src/domains/accelerator/store/projectsStore.ts`
  - `src/services/accelerator.ts` -> `src/domains/accelerator/services/acceleratorApi.ts`
- 明确 `src/domain/*` 的归属：
  - 若仅 accelerator 用：迁移到 `src/domains/accelerator/domain/*`
  - 若多模块用：抽成 `src/shared/quant/*`（纯函数，无 React）

### 3 个月后（产品化）

- 边界治理自动化：
  - 采用 `eslint-plugin-boundaries` 或引入 Nx 并使用 `@nx/enforce-module-boundaries`（见第 4 节链接）。
- 发布策略升级：
  - 如果“独立发布=独立部署”：上 monorepo 多 app（方案 B）。
  - 否则仍可单 app，但要实现模块级 feature flag 与灰度。
- 统一 Observability：每个模块必须埋点/日志带 `moduleId`，便于事故定位。

### 规模变大后（多部署 / 微前端）

触发条件（建议满足 3 个再上微前端）：

- 多团队并行且互相阻塞明显。
- 需要独立回滚/熔断某模块。
- 主应用构建时间过长（比如 >5min），或单 bundle 过大。

可选路线：

- 多 app + 统一 Shell（优先）：工程上最稳，隔离强，DX 好。
- single-spa：
  - 官方文档：https://single-spa.js.org/docs/getting-started-overview
  - 配置与 `registerApplication/start()`：https://single-spa.js.org/docs/configuration
- Module Federation：
  - Webpack 官方概念文档：https://webpack.js.org/concepts/module-federation/
  - 插件配置文档：https://webpack.js.org/plugins/module-federation-plugin/
  - Vite 场景通常依赖额外插件（需要评估版本/类型共享/React 单例问题）。

微前端/多部署选型矩阵（落地视角）：

| 方案 | 隔离强度 | 独立部署/回滚 | 共享 Wallet/Auth | 复杂度 | 推荐场景 |
| --- | --- | --- | --- | --- | --- |
| 单仓多 app（Monorepo） | 中-高 | 高 | 中（共享 packages） | 中 | 你目前最稳的“独立发布”路径 |
| Module Federation（Vite 插件） | 中 | 高 | 高（shared 单例） | 高 | 需要运行时共享组件/代码且多团队独立发布 |
| single-spa（import maps） | 高 | 高 | 中（靠 root-config 注入） | 高 | 多框架/历史包袱/强隔离需求 |
| Next.js Multi-Zones | 中 | 高 | 中 | 中-高 | 若未来转 Next.js 并需要同域多 app |
| iframe | 很高 | 高 | 低-中（通信成本高） | 中 | 合规/安全/强隔离优先但可牺牲体验 |

参考链接（可直接作为后续 POC 的起点）：

- Vite Module Federation（官方）：https://github.com/module-federation/vite
- Vite federation 备选插件：https://github.com/originjs/vite-plugin-federation
- Rspack Module Federation：https://rspack.rs/guide/features/module-federation
- single-spa Vite 生态文档：https://single-spa.js.org/docs/ecosystem-vite/
- Next.js Multi-Zones：https://nextjs.org/docs/pages/guides/multi-zones
- Turborepo micro-frontends guide：https://turborepo.com/docs/guides/microfrontends
- Vercel micro-frontends config：https://vercel.com/docs/microfrontends/configuration

---

## 7) 验收清单（完成这些就说明“合并到一个框架”是安全的）

### A. 结构与边界

- 每个模块存在唯一对外入口：`src/domains/<module>/index.ts`（或 manifest）。
- Shell 仅依赖 manifest，不直接 import 模块内部 pages/components/store。
- 任何 `domains/A` 不能 import `domains/B`（CI 必须硬失败）。
- 共享层只允许“无业务语义”：
  - `components/common` 不接受 `mode="insurance"` 这类业务分支。

### B. 可移除性（硬 Gate）

- 删除 `src/domains/insurance` 后：
  - 只改 `src/app/modules.ts` 即可编译/运行。
  - `npm run build` 通过。
- 同理，对 accelerator/arena/strategies 各做一次“可移除”演练（不要求每次都提交，但必须做过）。

### C. 路由与加载隔离

- 所有模块路由必须有统一前缀（例如 `/accelerator/*`、`/insurance/*`）。
- 访问 `/accelerator/*` 不应加载 insurance 的业务 chunk（Network 面板验证）。
- 路由守卫不依赖 path 字符串匹配（改为 route meta）。

### D. 状态与服务隔离

- 平台级 store 只包含：wallet/session/ui（例如 `src/store/walletStore.ts`、`src/store/uiStore.ts`）。
- 业务 store 必须在模块内（例如 `domains/accelerator/store/*`）。
- 域服务必须在模块内（例如 `domains/insurance/services/*`），且不通过全局单例泄漏。

### E. 配置与链治理

- `chainId/RPC/合约地址` 均集中管理，并按模块归属。
- 合约地址必须是 `Record<chainId, address>`，禁止散落字符串。

### F. 工程化

- Lint + Typecheck + Test 至少具备基础门禁（你已具备 `npm run lint/typecheck/test`）。
- 引入边界检测工具（eslint boundaries / Nx rule）并纳入 CI。
- 可选：安装 `ripgrep` 作为本地/CI 依赖（你当前环境 `rg` 不存在）。

---

## 附：与当前仓库的关键差距（你可以立刻开工的 5 件事）

1. 新增 `src/app/modules.ts`，把模块显式注册（为“可移除性”铺路）。
2. 把 `src/store/projectsStore.ts` 下沉到 `src/domains/accelerator/store/`（这是典型业务 store）。
3. 把 `src/services/accelerator.ts` 下沉到 `src/domains/accelerator/services/`，并开始移除“单例服务”。
4. 统一命名：`stocks` -> `strategies`（或反过来），并把路由与目录对齐。
5. 给 router 增加 route meta（role、walletRequired、moduleId），替换 `if (route.path === '...')`。
