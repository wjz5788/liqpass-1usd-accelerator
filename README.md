# LiqPass 前端项目

## 项目简介

LiqPass 是一个 AI 量化交易风险管理平台的前端应用，为量化交易者提供比赛参与、策略管理和交易保险等功能。

## 🚀 功能特性

### 核心功能模块
- **首页** - 总入口页面，展示平台核心功能和特色
- **比赛区** - 量化比赛展示、参与和排名
- **策略区** - 量化策略管理、分享和使用
- **保险区** - 交易保险购买、保单管理和理赔
- **MemeBoard** - 1美元首页，奖池轮播和代币展示

### 技术特性
- ⚡ **快速开发** - 基于 Vite 构建工具
- 🎨 **现代化 UI** - 使用 TailwindCSS 设计系统
- 🔒 **类型安全** - 完整的 TypeScript 支持
- 📱 **响应式设计** - 支持桌面和移动端
- 🧭 **路由导航** - React Router 实现单页应用

## 🛠️ 技术栈

- **前端框架**: React 18.2.0
- **开发语言**: TypeScript
- **构建工具**: Vite 4.5.14
- **样式框架**: TailwindCSS
- **路由管理**: React Router DOM 6.8.1
- **图标库**: Lucide React
- **图表库**: Recharts 3.3.0
- **Web3 集成**: Ethers 6.15.0

## 📁 项目结构

```
liqpass-frontend/
├── src/
│   ├── components/          # 共享组件
│   │   ├── Layout.tsx      # 布局组件
│   │   └── Navbar.tsx      # 导航栏组件
│   ├── pages/              # 页面组件
│   │   ├── HomePage.tsx    # 首页
│   │   ├── ArenaPage.tsx   # 比赛区
│   │   ├── StrategiesPage.tsx # 策略区
│   │   ├── InsurancePage.tsx  # 保险区
│   │   └── accelerator/
│   │       └── MemeBoardPage.tsx # MemeBoard页面
│   ├── App.tsx             # 路由配置
│   ├── main.tsx            # 应用入口
│   ├── meme-board-main.tsx # MemeBoard独立入口
│   └── index.css           # 全局样式
├── meme-board.html         # MemeBoard HTML入口
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # TailwindCSS 配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📋 页面功能说明

### 页面功能说明

### 首页 (/)
- Hero Banner 展示平台特色
- 三大功能入口卡片
- 为什么选择 LiqPass 说明

### 比赛区 (/arena)
- 比赛列表展示
- 比赛类型筛选（进行中、已结束、即将开始）
- 比赛详情和参与入口

### 策略区 (/strategies)
- 策略分类展示（官方推荐、用户自建、我的策略）
- 策略卡片展示（年化收益、最大回撤等指标）
- 新建策略引导

### 保险区 (/insurance)
- 保险产品展示
- 四步购买流程
- 保单管理和理赔记录

### MemeBoard (/accelerator/meme-board)
- **奖池轮播系统**: 三种奖池类型自动轮播（质押/阶段/神秘大奖）
- **代币展示**: 网格和列表两种视图模式
- **进度追踪**: 实时显示筹集进度和参与者数量
- **响应式设计**: 现代化UI特效和动画过渡

## 🎨 设计规范

### 颜色系统
- **主色调**: 蓝色系 (#3B82F6)
- **背景色**: 浅灰色 (#F9FAFB)
- **文字色**: 深灰色 (#374151)

### 字体
- **主要字体**: Inter
- **字体大小**: 响应式设计

### 组件样式
- 使用 TailwindCSS 原子类
- 响应式断点设计
- 统一的间距和圆角

## 🔧 开发指南

### 添加新页面
1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在导航栏组件中添加导航链接

### 样式开发
- 使用 TailwindCSS 类名
- 优先使用设计系统中的颜色和间距
- 保持响应式设计

### 状态管理
- 当前使用 React 内置状态管理
- 可根据需要集成 Redux 或 Zustand

## 📝 提交规范

### Commit Message 格式
```
feat: 添加新功能
fix: 修复问题
docs: 文档更新
style: 样式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具或依赖更新
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目负责人: [您的姓名]
- 邮箱: [您的邮箱]
- 项目文档: [文档链接]

---

**LiqPass - AI量化时代 · 交易风险OS**