# LiqPass 部署文档

本文档详细介绍了 LiqPass 平台的部署流程，包括前端、后端和智能合约的部署步骤。

## 目录

- [环境要求](#环境要求)
- [前端部署](#前端部署)
  - [本地开发](#本地开发)
  - [生产部署](#生产部署)
  - [Docker 部署](#docker-部署)
- [后端部署](#后端部署)
  - [本地开发](#本地开发-1)
  - [生产部署](#生产部署-1)
  - [环境变量配置](#环境变量配置)
- [智能合约部署](#智能合约部署)
  - [本地部署](#本地部署-2)
  - [测试网部署](#测试网部署)
  - [主网部署](#主网部署)
  - [合约验证](#合约验证)
- [监控与维护](#监控与维护)

## 环境要求

- **Node.js**: 18+（推荐使用 LTS 版本）
- **npm**: 9+ 或 **yarn**: 1.22+ 或 **pnpm**: 8+
- **Git**: 2.30+
- **数据库**: PostgreSQL 14+（用于后端）
- **区块链节点**: 本地节点或远程 RPC 服务（用于合约部署和交互）
- **Foundry**: 用于智能合约编译和部署

## 前端部署

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/liqpass.git
   cd liqpass
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

### 生产部署

#### Vercel 部署

1. 登录 Vercel 账号
2. 导入 GitHub 仓库
3. 配置构建命令和输出目录：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
4. 配置环境变量
5. 点击 "Deploy" 按钮

#### 本地服务器部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **使用静态文件服务器**
   ```bash
   # 全局安装 serve
   npm install -g serve
   
   # 启动服务器
   serve -s dist
   ```

### Docker 部署

1. **创建 Dockerfile**（如果不存在）
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **创建 nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name localhost;
       
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **构建 Docker 镜像**
   ```bash
   docker build -t liqpass-frontend .
   ```

4. **运行 Docker 容器**
   ```bash
   docker run -p 80:80 liqpass-frontend
   ```

## 后端部署

### 本地开发

1. **进入后端目录**
   ```bash
   cd apps/liqpass-backend
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

### 生产部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm run start
   ```

### 环境变量配置

后端应用需要以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `PORT` | 服务器端口 | 3001 |
| `DATABASE_URL` | 数据库连接 URL | postgres://user:password@localhost:5432/liqpass |
| `JWT_SECRET` | JWT 签名密钥 | your-secret-key |
| `API_KEY` | 内部 API 密钥 | your-api-key |
| `OKX_API_KEY` | OKX API 密钥 | okx-api-key |
| `OKX_API_SECRET` | OKX API 密钥 | okx-api-secret |
| `OKX_PASSPHRASE` | OKX API 密码 | okx-passphrase |

## 智能合约部署

### 本地部署

1. **进入合约目录**
   ```bash
   cd contracts
   ```

2. **安装依赖**
   ```bash
   forge install
   ```

3. **编译合约**
   ```bash
   forge build
   ```

4. **启动本地节点**
   ```bash
   anvil
   ```

5. **部署合约**
   ```bash
   forge script script/LiqPassBinaryMarket.s.sol:DeployLiqPassBinaryMarket --fork-url http://localhost:8545 --broadcast --verify -vvvv
   ```

### 测试网部署

1. **配置环境变量**
   创建 `.env` 文件并添加以下内容：
   ```env
   RPC_URL=<测试网RPC URL>
   PRIVATE_KEY=<部署者私钥>
   ETHERSCAN_API_KEY=<Etherscan API密钥>
   ```

2. **部署合约**
   ```bash
   forge script script/LiqPassBinaryMarket.s.sol:DeployLiqPassBinaryMarket --rpc-url $RPC_URL --broadcast --verify -vvvv
   ```

### 主网部署

主网部署与测试网部署类似，但需要使用主网 RPC URL 和主网私钥：

```bash
forge script script/LiqPassBinaryMarket.s.sol:DeployLiqPassBinaryMarket --rpc-url $MAINNET_RPC_URL --broadcast --verify -vvvv
```

### 合约验证

部署完成后，合约会自动在 Etherscan 上验证。如果验证失败，可以手动验证：

```bash
forge verify-contract <合约地址> src/LiqPassBinaryMarket.sol:LiqPassBinaryMarket --chain-id <链ID> --etherscan-api-key $ETHERSCAN_API_KEY
```

## 监控与维护

- **前端监控**: 可以集成 Sentry 或 LogRocket 进行错误监控和用户行为分析
- **后端监控**: 可以使用 Prometheus + Grafana 进行服务器性能监控
- **数据库监控**: 可以使用 pgAdmin 或其他 PostgreSQL 监控工具
- **合约监控**: 可以使用 Tenderly 或 Etherscan 进行合约事件监控

## 常见问题

### 前端部署后页面显示空白

1. 检查是否正确配置了环境变量
2. 检查构建命令是否成功执行
3. 检查服务器配置是否正确，确保支持单页应用路由

### 后端连接数据库失败

1. 检查数据库是否正在运行
2. 检查数据库连接 URL 是否正确
3. 检查数据库用户是否有正确的权限

### 合约部署失败

1. 检查私钥是否正确，且有足够的资金
2. 检查 RPC URL 是否可访问
3. 检查合约代码是否有编译错误
4. 检查部署脚本是否正确

## 联系方式

如有任何部署问题，请联系项目维护者。