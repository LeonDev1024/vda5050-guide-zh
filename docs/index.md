# VDA 5050 中文指南

欢迎来到 VDA 5050 中文指南！本项目旨在为中文读者提供 VDA 5050 标准的完整翻译和解读。

## 什么是 VDA 5050？

VDA 5050 是德国汽车工业协会（VDA）发布的标准，定义了自动化导引车（AGV）和自主移动机器人（AMR）与上位控制系统之间的通信接口。

> ![VDA 5050 架构图](./assets/csagv.png)

## 快速开始

### 1. 基本概念

- **车队控制 (Fleet Control)**：负责协调和管理多个移动机器人的中央系统
- **移动机器人 (Mobile Robot)**：AGV 或 AMR，负责执行任务
- **MQTT**：消息传输协议
- **JSON**：消息数据格式

### 2. 核心消息

| 消息 | 方向 | 用途 |
|------|------|------|
| `order` | 车队控制 → 机器人 | 下发任务 |
| `state` | 机器人 → 车队控制 | 上报状态 |
| `instantActions` | 车队控制 → 机器人 | 即时动作 |
| `connection` | 机器人 → 车队控制 | 连接状态 |

### 3. 示例：第一个订单

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
    {
      "nodeId": "node-1",
      "sequenceId": 0,
      "released": true
    },
    {
      "nodeId": "node-2",
      "sequenceId": 2,
      "released": false
    }
  ],
  "edges": [
    {
      "edgeId": "edge-1",
      "sequenceId": 1,
      "released": true,
      "fromNodeId": "node-1",
      "toNodeId": "node-2"
    }
  ]
}
```

## 文档导航

<div class="grid-cards">

### 协议基础

- [简介](./docs/01-intro.md) - 项目概述和背景
- [范围](./docs/02-scope.md) - 标准的适用范围
- [术语定义](./docs/03-definitions.md) - 关键术语解释
- [传输协议](./docs/04-transport.md) - MQTT 配置和主题

### 核心功能

- [通信流程](./docs/05-process.md) - 系统交互概览
- [订单协议](./docs/06-order.md) - 任务下发和管理
- [动作定义](./docs/07-actions.md) - 机器人动作

### 数据模型

- [地图](./docs/08-maps.md) - 环境地图
- [区域](./docs/09-zones.md) - 速度和访问控制
- [连接](./docs/10-connection.md) - 连接管理
- [状态](./docs/11-state.md) - 机器人状态上报

### 高级特性

- [可视化](./docs/12-visualization.md) - 实时监控
- [信息单](./docs/13-factsheet.md) - 设备信息
- [消息规格](./docs/14-messages.md) - 完整字段参考

### 参考

- [术语表](./docs/glossary.md) - 中英对照
- [常见问题](./docs/faq.md) - FAQ

</div>

## 技术架构

> ![信息流图](./assets/information_flow_VDA5050.png)

## 官方资源

- [VDA 5050 官方 GitHub](https://github.com/VDA5050/VDA5050)
- [规范文档 (英文)](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md)
- [JSON Schema](https://github.com/VDA5050/VDA5050/tree/main/json_schemas)

## 版本

当前版本：**3.0.0**

采用语义化版本管理：
- 主版本：破坏性变更
- 次版本：新增功能
- 补丁：问题修复