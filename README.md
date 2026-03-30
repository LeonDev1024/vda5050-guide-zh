# VDA 5050 中文指南

本项目旨在提供 VDA 5050 标准的中文翻译和解读，帮助中文读者更好地理解和应用该标准。

## 关于 VDA 5050

VDA 5050 是德国汽车工业协会 (Verband der Automobilindustrie, VDA) 发布的一项标准，定义了自动化引导车 (AGV)、自主移动机器人 (AMR) 与上位控制系统（ Fleet Control）之间进行通信的接口和协议。

### 主要特点

- **基于 MQTT**：使用 MQTT 3.1.1+ 作为传输协议
- **JSON 格式**：消息 payload 采用 JSON 格式
- **供应商中立**：标准化的接口定义，支持不同厂商的 AGV/AMR
- **版本管理**：采用语义化版本 (Semantic Versioning)

## 文档结构

```
docs/
├── 01-intro.md           # 简介与概述
├── 02-scope.md           # 范围与目标
├── 03-definitions.md    # 术语定义
├── 04-transport.md      # 传输协议 (MQTT)
├── 05-process.md        # 通信流程
├── 06-order.md          # 订单协议
├── 07-actions.md        # 动作定义
├── 08-maps.md           # 地图
├── 09-zones.md          # 区域
├── 10-connection.md     # 连接
├── 11-state.md          # 状态
├── 12-visualization.md  # 可视化
├── 13-factsheet.md      # 信息单
├── 14-messages.md       # 消息规格
├── glossary.md          # 术语表
├── faq.md               # 常见问题
└── examples/            # 示例
```

## 本地预览

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev
```

## 在线部署

### 方式一：GitHub Pages（推荐）

1. 在 GitHub 仓库设置中启用 GitHub Pages
2. Source 选择 "GitHub Actions"
3. 推送代码后自动部署

或手动配置：

1. 构建文档：
   ```bash
   npm run docs:build
   ```
2. 将 `docs/.vitepress/dist` 目录内容推送到 `gh-pages` 分支
3. 在仓库设置中启用 Pages，Source 选择 `gh-pages` 分支

### 方式二：Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入仓库
3. Vercel 会自动检测 VitePress 并配置部署

### 方式三：Netlify

1. 将代码推送到 GitHub
2. 在 [Netlify](https://netlify.com) 导入仓库
3. Build command: `npm run docs:build`
4. Publish directory: `docs/.vitepress/dist`

## 当前进度

| 章节 | 状态 |
|------|------|
| 01-intro.md 简介 | ✅ 完成 |
| 02-scope.md 范围 | ✅ 完成 |
| 03-definitions.md 术语定义 | ✅ 完成 |
| 04-transport.md 传输协议 | ✅ 完成 |
| 05-process.md 通信流程 | ✅ 完成 |
| 06-order.md 订单协议 | ✅ 完成 |
| 07-actions.md 动作定义 | ✅ 完成 |
| 08-maps.md 地图 | ✅ 完成 |
| 09-zones.md 区域 | ✅ 完成 |
| 10-connection.md 连接 | ✅ 完成 |
| 11-state.md 状态 | ✅ 完成 |
| 12-visualization.md 可视化 | ✅ 完成 |
| 13-factsheet.md 信息单 | ✅ 完成 |
| 14-messages.md 消息规格 | ✅ 完成 |
| glossary.md 术语表 | ✅ 完成 |
| faq.md 常见问题 | ✅ 完成 |
| examples/ 示例 | 待补充 |

## 官方资源

- [VDA 5050 官方 GitHub](https://github.com/VDA5050/VDA5050)
- [VDA 5050 规范文档 (英文)](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md)

## 许可证

MIT License - 详见 [LICENSE](./LICENSE)