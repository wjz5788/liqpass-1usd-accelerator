# 后端开发手册

## 文档信息
- **版本**: 1.0.0
- **最后更新**: 2024-01-23
- **作者**: LiqPass 开发团队

## 摘要
本手册提供了 LiqPass 后端开发的详细指南，包括环境搭建、开发流程、代码规范和最佳实践。

## 1. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Fastify | latest | 后端框架 |
| TypeScript | 5.x | 类型安全 |
| PostgreSQL | 15.x | 数据库 |
| Ethers.js | latest | 区块链交互 |
| Node.js | 18.x | 运行环境 |
| npm | 9.x | 包管理 |
| Prisma | latest | ORM（可选） |
| Jest | latest | 测试 |

## 2. 环境搭建

### 2.1 前提条件
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- PostgreSQL >= 15.0.0

### 2.2 安装步骤
1. **克隆仓库**
   ```bash
   git clone https://github.com/liqpass/liqpass-1usd-accelerator.git
   cd liqpass-1usd-accelerator
   ```

2. **进入后端目录**
   ```bash
   cd apps/liqpass-backend
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   根据实际情况修改 `.env` 文件中的配置项，包括：
   - 数据库连接信息
   - 区块链 RPC URL
   - API 密钥
   - 其他服务配置

5. **数据库迁移**
   ```bash
   npm run migrate
   ```

6. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 3. 项目结构

```
apps/liqpass-backend/
├── src/
│   ├── db/               # 数据库相关
│   │   ├── migrations/   # 数据库迁移文件
│   │   ├── pool.ts       # 数据库连接池
│   │   └── *Repo.ts      # 数据访问层
│   ├── domain/           # 领域模型
│   ├── routes/           # API 路由
│   ├── security/         # 安全相关
│   ├── services/         # 业务服务
│   ├── utils/            # 工具函数
│   ├── env.ts            # 环境变量配置
│   └── index.ts          # 应用入口
├── test/                 # 测试代码
├── .env.example          # 环境变量示例
├── package.json          # 项目配置
└── tsconfig.json         # TypeScript 配置
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
- 为所有函数和方法添加类型注解
- 使用接口定义复杂类型

### 5.2 Fastify 路由规范
- 路由文件按功能模块组织
- 使用 RESTful API 设计规范
- 为路由添加适当的验证和钩子
- 示例：
  ```typescript
  import { FastifyInstance } from 'fastify';
  
  export async function insuranceRoutes(fastify: FastifyInstance) {
    fastify.post('/quote', {
      schema: {
        body: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            duration: { type: 'number' }
          },
          required: ['amount', 'duration']
        }
      }
    }, async (request, reply) => {
      // 处理报价请求
    });
  }
  ```

### 5.3 数据库操作规范
- 使用参数化查询防止 SQL 注入
- 避免在循环中执行数据库操作
- 使用事务处理复杂操作
- 示例：
  ```typescript
  export async function createPurchaseOrder(data: PurchaseOrderData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'INSERT INTO purchase_orders (user_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
        [data.userId, data.amount, 'pending']
      );
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  ```

### 5.4 命名规范
- 变量和函数：camelCase
- 类和接口：PascalCase
- 常量：UPPER_CASE_WITH_UNDERSCORES
- 文件和目录：kebab-case

## 6. API 设计

### 6.1 设计原则
- **RESTful**：遵循 REST 架构风格
- **版本控制**：使用 URL 路径进行版本控制（如 `/api/v1/insurance/quote`）
- **一致性**：保持 API 设计的一致性
- **可读性**：使用清晰、描述性的 URL
- **安全性**：实现适当的认证和授权机制

### 6.2 认证机制
- 使用 JWT 进行身份认证
- 为敏感 API 添加 API 密钥验证
- 实现适当的权限控制

### 6.3 错误处理
- 使用统一的错误格式
- 示例：
  ```json
  {
    "error": {
      "code": 400,
      "message": "Invalid request parameters",
      "details": [
        { "field": "amount", "message": "Amount must be greater than 0" }
      ]
    }
  }
  ```

## 7. 区块链交互

### 7.1 Ethers.js 配置
- 在 `services/*Client.ts` 中配置区块链连接
- 使用提供者（Provider）进行只读操作
- 使用签名者（Signer）进行写操作

### 7.2 智能合约交互
- 使用 ABI 文件定义合约接口
- 示例：
  ```typescript
  import { ethers } from 'ethers';
  import { abi } from '../abi/LiqPassBinaryMarket.json';
  
  export class BlockchainService {
    private contract: ethers.Contract;
    
    constructor(rpcUrl: string, contractAddress: string) {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      this.contract = new ethers.Contract(contractAddress, abi, provider);
    }
    
    async getMarketInfo(marketId: string) {
      return await this.contract.getMarket(marketId);
    }
  }
  ```

### 7.3 事件监听
- 实现区块链事件监听机制
- 处理事件并更新数据库
- 示例：
  ```typescript
  this.contract.on('MarketCreated', async (marketId, creator, params) => {
    // 处理市场创建事件
    await this.marketRepo.createMarket({
      id: marketId,
      creator: creator,
      params: params
    });
  });
  ```

## 8. 测试

### 8.1 测试类型
- **单元测试**：测试单个函数或方法
- **集成测试**：测试模块间的交互
- **API 测试**：测试 API 端点

### 8.2 测试工具
- Jest：单元测试和集成测试
- Supertest：API 测试

### 8.3 测试覆盖率要求
- 核心功能：≥ 80%
- 普通功能：≥ 60%
- 辅助功能：≥ 40%

## 9. 性能优化

### 9.1 数据库优化
- 使用适当的索引
- 优化查询语句
- 避免 N+1 查询问题
- 考虑使用缓存机制

### 9.2 API 优化
- 实现请求限流
- 优化响应数据大小
- 考虑使用压缩

### 9.3 区块链交互优化
- 批量处理链上调用
- 使用缓存减少重复请求
- 优化 gas 费用

## 10. 安全性

### 10.1 输入验证
- 对所有用户输入进行验证
- 使用 Fastify 的 schema 验证功能

### 10.2 防止 SQL 注入
- 使用参数化查询
- 避免拼接 SQL 语句

### 10.3 防止 XSS 攻击
- 对输出数据进行适当的转义

### 10.4 防止 CSRF 攻击
- 实现 CSRF Token 验证
- 使用 SameSite Cookie 属性

### 10.5 敏感数据保护
- 加密存储敏感数据
- 避免在日志中记录敏感信息
- 实现适当的访问控制

## 11. 部署

### 11.1 构建步骤
```bash
npm run build
```

### 11.2 部署选项
- Docker 容器化部署
- 云服务提供商（AWS, GCP, Azure）
- 自建服务器

### 11.3 监控和日志
- 实现适当的日志记录
- 配置监控系统
- 设置告警机制

## 12. 常见问题

### 12.1 数据库连接问题
**问题**：无法连接到数据库
**解决方案**：
- 检查数据库服务是否运行
- 确认数据库连接字符串正确
- 检查防火墙设置

### 12.2 区块链连接问题
**问题**：无法连接到区块链节点
**解决方案**：
- 检查 RPC URL 配置正确
- 确认网络连接正常
- 尝试切换 RPC 节点

### 12.3 依赖冲突
**问题**：安装依赖时出现版本冲突
**解决方案**：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 13. 最佳实践

1. **代码组织**
   - 按功能模块组织代码
   - 遵循单一职责原则
   - 保持代码可读性

2. **API 设计**
   - 保持 API 设计的一致性
   - 使用清晰、描述性的 URL
   - 实现适当的认证和授权机制

3. **数据库设计**
   - 设计合理的数据库 schema
   - 使用适当的索引
   - 实现事务处理

4. **区块链交互**
   - 优化链上调用
   - 实现事件监听机制
   - 处理区块链分叉情况

5. **测试**
   - 编写可测试的代码
   - 优先测试核心功能
   - 定期运行测试

6. **安全性**
   - 实现适当的安全措施
   - 定期进行安全审计
   - 及时更新依赖

## 14. 资源

- [Fastify 文档](https://www.fastify.io/docs/latest/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Ethers.js 文档](https://docs.ethers.org/v6/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [RESTful API 设计指南](https://restfulapi.net/)

## 更新日志
| 日期 | 版本 | 更新内容 | 作者 |
|------|------|----------|------|
| 2024-01-23 | 1.0.0 | 初始版本 | LiqPass 开发团队 |