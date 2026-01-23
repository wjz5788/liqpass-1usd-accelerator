# LiqPass

LiqPass 是一个 AI 量化交易风险管理平台，为量化交易者提供比赛参与、策略管理和交易保险等功能。

## 快速开始

### 前端启动

1. **安装依赖**
```bash
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env
```
根据实际情况修改 `.env` 文件中的配置项。

3. **启动开发服务器**
```bash
npm run dev
```
访问 http://localhost:3000

### 后端启动

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
根据实际情况修改 `.env` 文件中的配置项，包括数据库连接、API密钥等。

4. **启动开发服务器**
```bash
npm run dev
```

### 合约本地/测试网部署与验证

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

4. **本地部署**
```bash
forge script script/LiqPassBinaryMarket.s.sol:DeployLiqPassBinaryMarket --fork-url http://localhost:8545 --broadcast --verify -vvvv
```

5. **测试网部署**
```bash
forge script script/LiqPassBinaryMarket.s.sol:DeployLiqPassBinaryMarket --rpc-url <测试网RPC URL> --broadcast --verify -vvvv
```

6. **生成ABI**
```bash
forge inspect LiqPassBinaryMarket abi --json > abi/LiqPassBinaryMarket.json
```

## 部署文档

详细的部署指南请查看 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。