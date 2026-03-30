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

## 在线预览地址
https://leondev1024.github.io/vda5050-guide-zh/



## 官方资源

- [VDA 5050 官方 GitHub](https://github.com/VDA5050/VDA5050)
- [VDA 5050 规范文档 (英文)](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md)

## 许可证

MIT License - 详见 [LICENSE](./LICENSE)