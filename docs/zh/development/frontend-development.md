# 前端开发手册

## 文档信息
- **版本**: 1.0.0
- **最后更新**: 2024-01-23
- **作者**: LiqPass 开发团队

## 摘要
本手册提供了 LiqPass 前端开发的详细指南，包括环境搭建、开发流程、代码规范和最佳实践。

## 1. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | 前端框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Tailwind CSS | 3.x | UI 框架 |
| Wagmi + Viem | latest | 区块链交互 |
| RainbowKit | latest | 钱包连接 |
| Zustand | latest | 状态管理 |
| React Router DOM | 6.x | 路由管理 |
| Vitest + Testing Library | latest | 测试 |

## 2. 环境搭建

### 2.1 前提条件
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### 2.2 安装步骤
1. **克隆仓库**
   ```bash
   git clone https://github.com/liqpass/liqpass-1usd-accelerator.git
   cd liqpass-1usd-accelerator
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   根据实际情况修改 `.env` 文件中的配置项。

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000

## 3. 项目结构

```
src/
├── app/                # 应用核心代码
│   ├── guards/         # 路由守卫
│   ├── pages/          # 应用级页面
│   ├── routes/         # 路由配置
│   └── modules.ts      # 模块注册
├── components/         # 通用组件
│   ├── common/         # 基础组件
│   ├── features/       # 功能组件
│   ├── layout/         # 布局组件
│   └── Layout.tsx      # 主布局
├── config/             # 配置文件
├── domain/             # 领域模型
├── domains/            # 功能域
│   ├── accelerator/    # 加速器功能
│   ├── arena/          # 竞技场功能
│   ├── insurance/      # 保险功能
│   └── stocks/         # 股票功能
├── entries/            # 入口文件
├── hooks/              # 自定义 Hooks
├── pages/              # 页面组件
├── services/           # 服务层
│   ├── mock/           # 模拟数据
│   └── utils/          # 工具函数
├── store/              # 状态管理
└── types/              # 类型定义
```

## 4. 开发流程

### 4.1 分支策略
- **main**：主分支，用于发布稳定版本
- **develop**：开发分支，用于集成各功能分支
- **feature/xxx**：功能分支，用于开发新功能
- **bugfix/xxx**：bug 修复分支

### 4.2 代码提交规范
- 采用 Conventional Commits 规范
- 提交信息格式：`type(scope?): description`
  - type：feat, fix, docs, style, refactor, test, chore
  - scope：可选，指定影响的模块
  - description：简明描述提交内容

### 4.3 代码审查
- 所有代码必须通过代码审查才能合并到主分支
- 审查要点：
  - 代码质量和可读性
  - 功能正确性
  - 性能影响
  - 安全性
  - 测试覆盖率

## 5. 代码规范

### 5.1 TypeScript 规范
- 使用严格模式 `strict: true`
- 避免使用 `any` 类型，使用 `unknown` 代替
- 为所有函数和组件添加类型注解
- 使用接口定义复杂类型

### 5.2 React 组件规范
- 使用函数式组件和 Hooks
- 组件命名：PascalCase，如 `UserProfile.tsx`
- 文件命名：与组件名称一致
- 优先使用组合而非继承
- 组件职责单一

### 5.3 CSS 规范
- 使用 Tailwind CSS 进行样式设计
- 避免使用内联样式
- 对于复杂组件，使用 CSS Modules 或 styled-components
- 遵循 Tailwind CSS 最佳实践

### 5.4 命名规范
- 变量和函数：camelCase
- 组件和接口：PascalCase
- 常量：UPPER_CASE_WITH_UNDERSCORES
- 文件和目录：kebab-case

## 6. 状态管理

### 6.1 Zustand 使用指南
- 每个功能域创建独立的 store
- 遵循最小化状态原则
- 使用 selector 优化性能
- 示例：
  ```typescript
  import { create } from 'zustand';

  interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
  }

  export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }));
  ```

### 6.2 状态管理最佳实践
- 全局状态：用户信息、钱包状态、应用配置
- 局部状态：组件内部状态
- 避免过度使用全局状态
- 使用 React Context 管理组件树内的状态

## 7. 区块链交互

### 7.1 Wagmi + Viem 配置
- 在 `src/wallet/wagmi.ts` 中配置链和连接器
- 使用 RainbowKit 提供钱包连接 UI

### 7.2 智能合约交互
- 使用 `useContract` 钩子获取合约实例
- 使用 `useReadContract` 和 `useWriteContract` 进行合约读写
- 示例：
  ```typescript
  import { useContract, useReadContract } from 'wagmi';
  import { abi } from './contractAbi';

  const contractAddress = '0x1234...';

  const MyComponent = () => {
    const contract = useContract({
      address: contractAddress,
      abi,
    });

    const { data: balance } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'balanceOf',
      args: ['0x5678...'],
    });

    // ...
  };
  ```

## 8. 路由管理

### 8.1 React Router 配置
- 在 `src/app/routes/types.ts` 中定义路由类型
- 在各功能域的 `routes.ts` 中定义路由
- 使用路由守卫保护敏感路由

### 8.2 路由守卫
- `RequireWallet`：要求用户连接钱包
- `RequireRole`：要求特定角色

## 9. 测试

### 9.1 测试类型
- **单元测试**：测试单个组件或函数
- **集成测试**：测试组件间的交互
- **E2E 测试**：测试完整的用户流程

### 9.2 测试工具
- Vitest：单元测试和集成测试
- Playwright：E2E 测试

### 9.3 测试覆盖率要求
- 核心功能：≥ 80%
- 普通功能：≥ 60%
- 辅助功能：≥ 40%

## 10. 性能优化

### 10.1 组件优化
- 使用 `React.memo` 优化函数组件
- 使用 `useMemo` 和 `useCallback` 优化计算和回调
- 避免在渲染过程中创建新对象

### 10.2 图片优化
- 使用适当的图片格式（WebP、AVIF）
- 实现图片懒加载
- 使用响应式图片

### 10.3 代码分割
- 使用动态 `import()` 实现组件懒加载
- 配置 Vite 进行代码分割

### 10.4 区块链交互优化
- 批量处理链上调用
- 使用缓存减少重复请求
- 优化 gas 费用

## 11. 安全性

### 11.1 输入验证
- 对所有用户输入进行验证
- 使用 Zod 或 Yup 进行表单验证

### 11.2 防止 XSS 攻击
- 使用 React 的 JSX 转义
- 避免使用 `dangerouslySetInnerHTML`

### 11.3 防止 CSRF 攻击
- 使用 SameSite Cookie 属性
- 实现 CSRF Token 验证

### 11.4 区块链安全
- 验证合约地址
- 验证合约调用参数
- 提示用户确认交易详情

## 12. 部署

### 12.1 构建步骤
```bash
npm run build
```

### 12.2 部署选项
- Vercel
- Netlify
- AWS S3 + CloudFront
- 自建服务器

## 13. 常见问题

### 13.1 依赖冲突
**问题**：安装依赖时出现版本冲突
**解决方案**：
```bash
rm -rf node_modules package-lock.json
npm install
```

### 13.2 开发服务器启动失败
**问题**：端口被占用
**解决方案**：
```bash
# 修改 vite.config.ts 中的端口配置
server: {
  port: 3001,
}
```

### 13.3 区块链连接问题
**问题**：无法连接到区块链节点
**解决方案**：
- 检查网络连接
- 确认 RPC URL 配置正确
- 尝试切换网络

## 14. 最佳实践

1. **组件设计**
   - 保持组件小巧且专注
   - 使用 props 传递数据和回调
   - 实现良好的错误处理

2. **代码组织**
   - 按功能域组织代码
   - 遵循单一职责原则
   - 保持代码可读性

3. **文档**
   - 为公共组件和函数添加 JSDoc 注释
   - 编写清晰的提交信息
   - 更新相关文档

4. **测试**
   - 编写可测试的代码
   - 优先测试核心功能
   - 定期运行测试

5. **协作**
   - 遵循团队约定
   - 及时沟通问题
   - 尊重代码审查意见

## 15. 资源

- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs/)
- [Wagmi 文档](https://wagmi.sh/)
- [Viem 文档](https://viem.sh/)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Router 文档](https://reactrouter.com/en/main)

## 更新日志
| 日期 | 版本 | 更新内容 | 作者 |
|------|------|----------|------|
| 2024-01-23 | 1.0.0 | 初始版本 | LiqPass 开发团队 |