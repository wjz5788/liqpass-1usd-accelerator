# 智能合约开发手册

## 文档信息
- **版本**: 1.0.0
- **最后更新**: 2024-01-23
- **作者**: LiqPass 开发团队

## 摘要
本手册提供了 LiqPass 智能合约开发的详细指南，包括环境搭建、开发流程、代码规范和最佳实践。

## 1. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Solidity | 0.8.x | 智能合约语言 |
| Foundry | latest | 智能合约开发工具 |
| Forge | latest | 测试框架 |
| Cast | latest | 区块链交互工具 |
| Anvil | latest | 本地区块链节点 |
| Ethers.js | latest | JavaScript 库（用于测试） |

## 2. 环境搭建

### 2.1 前提条件
- Git
- Rust (用于安装 Foundry)

### 2.2 安装步骤
1. **安装 Foundry**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **克隆仓库**
   ```bash
   git clone https://github.com/liqpass/liqpass-1usd-accelerator.git
   cd liqpass-1usd-accelerator
   ```

3. **进入合约目录**
   ```bash
   cd contracts
   ```

4. **安装依赖**
   ```bash
   forge install
   ```

5. **编译合约**
   ```bash
   forge build
   ```

## 3. 项目结构

```
contracts/
├── abi/                # 合约 ABI 文件
├── cache/              # 编译缓存
├── lib/                # 依赖库
│   └── openzeppelin-contracts/ # OpenZeppelin 合约库
├── src/                # 合约源码
├── script/             # 部署脚本
├── test/               # 测试代码
├── foundry.toml        # Foundry 配置
└── .env.example        # 环境变量示例
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
  - scope：可选，指定影响的合约或模块
  - description：简明描述提交内容

### 4.3 代码审查
- 所有代码必须通过代码审查才能合并到主分支
- 审查要点：
  - 代码质量和可读性
  - 功能正确性
  - 安全性
  - 测试覆盖率
  - Gas 效率

## 5. 代码规范

### 5.1 Solidity 规范
- 使用 Solidity 0.8.x 版本
- 启用严格模式：`pragma solidity ^0.8.19;`
- 遵循 [Solidity 风格指南](https://docs.soliditylang.org/en/latest/style-guide.html)

### 5.2 合约设计原则
- **单一职责**：每个合约只负责一个功能
- **模块化**：将复杂功能拆分为多个模块
- **可升级性**：考虑使用代理模式实现可升级合约
- **安全性**：遵循最佳安全实践

### 5.3 命名规范
- 合约名称：PascalCase，如 `LiqPassBinaryMarket`
- 函数名称：camelCase，如 `createMarket()`
- 状态变量：camelCase，如 `marketCount`
- 常量：UPPER_CASE_WITH_UNDERSCORES，如 `MAX_MARKETS`
- 事件：PascalCase，如 `MarketCreated`
- 枚举：PascalCase，如 `MarketStatus`

### 5.4 注释规范
- 使用 NatSpec 注释为合约、函数和事件添加文档
- 示例：
  ```solidity
  /// @title LiqPass 二元市场合约
  /// @author LiqPass 开发团队
  /// @notice 用于创建和管理二元市场
  contract LiqPassBinaryMarket {
    /// @notice 创建新市场
    /// @param params 市场参数
    /// @return marketId 新创建的市场 ID
    function createMarket(MarketParams calldata params) external returns (uint256 marketId) {
      // 函数实现
    }
    
    /// @notice 市场创建事件
    /// @param marketId 市场 ID
    /// @param creator 市场创建者
    /// @param params 市场参数
    event MarketCreated(uint256 indexed marketId, address indexed creator, MarketParams params);
  }
  ```

## 6. 测试

### 6.1 测试类型
- **单元测试**：测试单个合约功能
- **集成测试**：测试合约间的交互
- **模糊测试**：测试合约在各种输入下的行为
- **形式化验证**：使用数学方法验证合约正确性

### 6.2 测试框架
- 使用 Foundry 的 Forge 进行测试
- 测试文件放在 `test/` 目录下
- 测试文件名格式：`ContractName.t.sol`

### 6.3 测试示例
```solidity
import "forge-std/Test.sol";
import "../src/LiqPassBinaryMarket.sol";

contract LiqPassBinaryMarketTest is Test {
    LiqPassBinaryMarket market;
    address alice = makeAddr("alice");
    
    function setUp() public {
        market = new LiqPassBinaryMarket();
    }
    
    function testCreateMarket() public {
        LiqPassBinaryMarket.MarketParams memory params = LiqPassBinaryMarket.MarketParams("Test Market", 100, 1 days);
        
        vm.prank(alice);
        uint256 marketId = market.createMarket(params);
        
        assertEq(marketId, 1);
    }
}
```

### 6.4 运行测试
- 运行所有测试：
  ```bash
  forge test
  ```
- 运行特定测试：
  ```bash
  forge test --match-contract LiqPassBinaryMarketTest --match-test testCreateMarket
  ```
- 运行测试并显示 gas 报告：
  ```bash
  forge test --gas-report
  ```

## 7. 部署

### 7.1 本地部署
1. **启动 Anvil 本地节点**
   ```bash
   anvil
   ```

2. **部署合约**
   ```bash
   forge script script/LiqPassBinaryMarket.s.sol:DeployLiqPassBinaryMarket --fork-url http://localhost:8545 --broadcast --verify -vvvv
   ```

### 7.2 测试网部署
1. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   设置 RPC URL 和私钥

2. **部署合约**
   ```bash
   forge script script/LiqPassBinaryMarket.s.sol:DeployLiqPassBinaryMarket --rpc-url <测试网RPC URL> --broadcast --verify -vvvv
   ```

### 7.3 部署脚本示例
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/LiqPassBinaryMarket.sol";

contract DeployLiqPassBinaryMarket is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        LiqPassBinaryMarket market = new LiqPassBinaryMarket();
        
        vm.stopBroadcast();
        
        console.log("LiqPassBinaryMarket deployed at:", address(market));
    }
}
```

## 8. 安全性

### 8.1 安全最佳实践
- 使用最新版本的 Solidity
- 避免使用 `tx.origin`
- 实现适当的访问控制
- 防止重入攻击（使用 ReentrancyGuard）
- 验证所有输入
- 处理溢出和下溢（Solidity 0.8.x 内置检查）
- 避免使用浮点数
- 实现紧急暂停机制

### 8.2 安全工具
- **Slither**：静态分析工具
  ```bash
  pip install slither-analyzer
  slither .
  ```
- **MythX**：智能合约安全分析平台
- **Echidna**：模糊测试工具
  ```bash
  echidna-test . --contract LiqPassBinaryMarket
  ```
- **Manticore**：符号执行工具

### 8.3 审计流程
- 内部审计：开发团队内部审查
- 外部审计：聘请专业审计公司
- 公开审计：社区审计

## 9. Gas 优化

### 9.1 优化策略
- 使用 immutable 变量存储常量
- 避免在循环中调用外部合约
- 使用适当的数据结构
- 优化存储布局（使用 packings）
- 避免不必要的状态更新
- 使用批量操作

### 9.2 Gas 测试
- 使用 Forge 的 gas 报告功能：
  ```bash
  forge test --gas-report
  ```
- 使用 Gas Reporter 库进行更详细的分析

## 10. 常见问题

### 10.1 依赖安装失败
**问题**：forge install 失败
**解决方案**：
```bash
rm -rf lib
forge install
```

### 10.2 编译错误
**问题**：合约编译失败
**解决方案**：
- 检查 Solidity 版本
- 检查依赖版本
- 检查语法错误

### 10.3 测试失败
**问题**：测试用例失败
**解决方案**：
- 运行单个测试用例查看详细输出
- 使用调试器：`forge test --debug testCreateMarket`

## 11. 最佳实践

1. **合约设计**
   - 保持合约小巧且专注
   - 使用模块化设计
   - 实现适当的访问控制
   - 考虑可升级性

2. **测试**
   - 编写全面的测试用例
   - 测试边界情况
   - 使用模糊测试
   - 定期运行测试

3. **安全性**
   - 遵循安全最佳实践
   - 使用安全工具进行检查
   - 定期进行审计
   - 实现紧急暂停机制

4. **Gas 优化**
   - 优化合约的 Gas 使用
   - 定期测试 Gas 消耗
   - 考虑用户的 Gas 成本

5. **文档**
   - 为合约添加详细的 NatSpec 注释
   - 编写部署和使用文档
   - 保持 ABI 文件更新

## 12. 资源

- [Solidity 文档](https://docs.soliditylang.org/)
- [Foundry 文档](https://book.getfoundry.sh/)
- [OpenZeppelin 文档](https://docs.openzeppelin.com/contracts/)
- [Solidity 风格指南](https://docs.soliditylang.org/en/latest/style-guide.html)
- [智能合约安全最佳实践](https://consensys.github.io/smart-contract-best-practices/)

## 更新日志
| 日期 | 版本 | 更新内容 | 作者 |
|------|------|----------|------|
| 2024-01-23 | 1.0.0 | 初始版本 | LiqPass 开发团队 |