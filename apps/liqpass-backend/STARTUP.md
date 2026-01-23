# LiqPass 后端启动指南

## 当前状态

✅ 后端代码已完成并编译成功  
❌ PostgreSQL 数据库未运行  
❌ 需要启动数据库后才能运行后端服务

## 启动步骤

### 1. 启动 PostgreSQL 数据库

根据你的 PostgreSQL 安装方式选择：

#### 方式 A: 使用 Homebrew 安装的 PostgreSQL
```bash
# 启动 PostgreSQL
brew services start postgresql@14

# 或者使用 pg_ctl
pg_ctl -D /usr/local/var/postgres start
```

#### 方式 B: 使用 Docker 运行 PostgreSQL
```bash
docker run -d \
  --name liqpass-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=liqpass \
  -p 5432:5432 \
  postgres:14
```

#### 方式 C: 使用 Docker Compose
在项目根目录创建 `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: liqpass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

然后运行:
```bash
docker-compose up -d
```

### 2. 验证数据库连接

```bash
# 使用 psql 连接（如果已安装）
psql postgres://postgres:postgres@localhost:5432/liqpass

# 或者使用 Docker
docker exec -it liqpass-postgres psql -U postgres -d liqpass
```

### 3. 运行数据库迁移

```bash
cd apps/liqpass-backend
npm run migrate
```

预期输出:
```
✓ Migrations table ready
✓ Applied migration: 001_add_purchase_orders_fields.sql
✓ Applied migration: 002_create_insurance_claims.sql
...
```

### 4. 启动后端服务

```bash
npm run dev
```

预期输出:
```
Server listening at http://0.0.0.0:3001
```

### 5. 测试 API

```bash
# 测试健康检查（如果有）
curl http://localhost:3001/health

# 或者直接测试创建订单
curl -X POST http://localhost:3001/api/insurance/create-order \
  -H "Content-Type: application/json" \
  -d '{"bindId": "1"}'
```

## 快速启动脚本

如果使用 Docker，可以创建一键启动脚本:

```bash
#!/bin/bash
# start-dev.sh

# 启动数据库
docker-compose up -d postgres

# 等待数据库就绪
echo "Waiting for database..."
sleep 3

# 运行迁移
cd apps/liqpass-backend
npm run migrate

# 启动后端
npm run dev
```

## 故障排查

### 问题 1: 端口 5432 已被占用
```bash
# 查找占用端口的进程
lsof -i:5432

# 停止其他 PostgreSQL 实例
brew services stop postgresql
```

### 问题 2: 数据库连接失败
检查 `.env` 文件中的 `DATABASE_URL` 是否正确:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/liqpass
```

### 问题 3: 迁移失败
```bash
# 手动创建数据库
createdb liqpass

# 或使用 psql
psql -U postgres -c "CREATE DATABASE liqpass;"
```

## 下一步

数据库和后端启动成功后，运行完整测试:
```bash
./scripts/test-insurance-flow.sh
```
