# 多阶段构建：优化镜像大小
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装生产依赖（跳过 devDependencies）
RUN npm ci --only=production && \
    npm cache clean --force

# 运行时阶段
FROM node:18-alpine AS runtime

# 设置工作目录
WORKDIR /app

# 设置 NODE_ENV 为生产环境
ENV NODE_ENV=production

# 创建非 root 用户（安全最佳实践）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 从构建阶段复制 node_modules
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# 复制应用文件
COPY --chown=nodejs:nodejs server.js ./

# 切换到非 root 用户
USER nodejs

# Railway 会自动设置 PORT 环境变量
# 应用会通过 process.env.PORT 读取
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "server.js"]
