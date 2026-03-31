---
layout: home

title: VDA 5050 中文指南
titleTemplate: AGV/AMR 通信协议标准

hero:
  name: VDA 5050
  text: 自动化导引车通信标准
  tagline: 德国汽车工业协会 (VDA) 发布的 AGV/AMR 与上位控制系统之间的通信接口规范
  actions:
    - theme: brand
      text: 快速开始
      link: /01-intro
    - theme: alt
      text: 查看文档
      link: /04-transport

features:
  - title: 标准化接口
    details: 供应商中立的通信协议，支持不同厂商的 AGV/AMR 在同一环境中协同工作
    icon: 🔌
  - title: MQTT + JSON
    details: 基于轻量级的 MQTT 消息传输协议，使用 JSON 格式便于解析和扩展
    icon: 📡
  - title: 语义化版本
    details: 采用语义化版本管理 (SemVer)，平滑升级不破坏兼容性
    icon: 📋
  - title: 完整的数据模型
    details: 定义了订单、状态、动作、地图、区域等完整的通信消息格式
    icon: 📦
  - title: 状态机
    details: 详细的状态转换和错误处理机制，确保系统稳定运行
    icon: ⚡
  - title: 开源免费
    details: 遵循 MIT 许可证，官方提供完整的 JSON Schema 验证
    icon: 🌐
---

## 最新更新

<div class="updates">

### 协议基础

- [简介](./01-intro.md) - 项目概述和背景
- [范围](./02-scope.md) - 标准的适用范围
- [术语定义](./03-definitions.md) - 关键术语解释

### 核心协议

- [传输协议](./04-transport.md) - MQTT 配置和主题
- [通信流程](./05-process.md) - 系统交互概览
- [订单协议](./06-order.md) - 任务下发和管理

</div>

## 核心消息

| 消息 | 方向 | 用途 |
|------|------|------|
| `order` | 车队控制 → 机器人 | 下发任务 |
| `state` | 机器人 → 车队控制 | 上报状态 |
| `instantActions` | 车队控制 → 机器人 | 即时动作 |
| `connection` | 机器人 → 车队控制 | 连接状态 |

## 示例：订单消息

```json
{
  "headerId": 1,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.0.0",
  "manufacturer": "RobotCorp",
  "serialNumber": "AGV-001",
  "orderId": "order-1234",
  "orderUpdateId": 0,
  "nodes": [
    { "nodeId": "node-1", "sequenceId": 0, "released": true },
    { "nodeId": "node-2", "sequenceId": 2, "released": false }
  ],
  "edges": [
    { "edgeId": "edge-1", "sequenceId": 1, "released": true }
  ]
}
```

## 官方资源

- [VDA 5050 官方 GitHub](https://github.com/VDA5050/VDA5050)

---

> **当前版本**: VDA 5050 3.0.0