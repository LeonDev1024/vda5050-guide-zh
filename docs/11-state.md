# 11. 状态

`state` 主题是移动机器人向车队控制报告其当前状态的 MQTT 主题。

## 11.1 概述

状态消息包含移动机器人的完整当前信息，使车队控制能够：
- 跟踪机器人位置和进度
- 监控动作执行状态
- 检测错误和异常
- 进行交通管理决策

> ![图 1：状态消息结构图](./assets/state_overview.png)
> **图 1**：状态消息概述

## 11.2 状态消息结构

```json
{
  "headerId": 1,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.0.0",
  "manufacturer": "ManufacturerA",
  "serialNumber": "ROBOT-001",
  "orderId": "order-123",
  "orderUpdateId": 0,
  "lastNodeId": "node-5",
  "lastNodeSequenceId": 4,
  "nodeStates": [...],
  "edgeStates": [...],
  "driving": true,
  "paused": false,
  "errors": [...],
  "information": [...],
  "loads": [...],
  "maps": [...],
  "zoneSets": [...],
  ...
}
```

### 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `headerId` | uint32 | 消息头部ID，每个主题独立递增 |
| `timestamp` | string | 时间戳 (ISO 8601, UTC) |
| `version` | string | 协议版本 |
| `manufacturer` | string | 制造商 |
| `serialNumber` | string | 序列号 |

### 订单相关字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `orderId` | string | 当前或最近完成的订单ID，空字符串表示无 |
| `orderUpdateId` | uint32 | 订单更新ID，"0" 表示无 |
| `lastNodeId` | string | 最后到达的节点ID，空字符串表示无 |
| `lastNodeSequenceId` | uint32 | 最后到达节点的序列号 |

## 11.3 节点和边的遍历

### nodeStates

当前订单中需要遍历的节点状态列表：

```json
{
  "nodeId": "node-6",
  "sequenceId": 5,
  "nodeState": "TRAVERSING"
}
```

节点状态：
| 状态 | 说明 |
|------|------|
| `WAITING` | 等待到达该节点 |
| `REACHED` | 已到达该节点 |
| `TRAVERSING` | 正在遍历该节点 |

### edgeStates

当前订单中需要遍历的边状态列表：

```json
{
  "edgeId": "edge-5",
  "sequenceId": 4,
  "edgeState": "TRAVERSING"
}
```

边状态：
| 状态 | 说明 |
|------|------|
| `TRAVERSING` | 正在遍历该边 |

### 节点/边遍历流程

> ![图 2：节点和边的遍历](./assets/traversal_flow.png)
> **图 2**：节点和边遍历流程

1. 机器人到达节点，节点状态从 WAITING → REACHED
2. 如果节点有动作，触发动作执行
3. 触发下一个边的遍历
4. 边的边状态变为 TRAVERSING
5. 边的遍历完成后，触发下一个节点

## 11.4 基线请求

移动机器人可以请求车队控制发布更多节点和边。请求通过在状态消息中包含 `baseRequest` 实现：

```json
{
  "baseRequest": {
    "requestId": "req-001",
    "type": "EXPAND_BASE"
  }
}
```

### 请求类型

| 类型 | 说明 |
|------|------|
| `EXPAND_BASE` | 请求扩展基线 |
| `RELEASE_NODES` | 请求释放特定节点 |

### 基线请求响应

车队控制通过发送订单更新响应基线请求，包含更多已发布的节点和边。

## 11.5 信息消息

信息消息用于传递非关键状态信息：

```json
{
  "information": [
    {
      "infoType": "LOCALIZATION",
      "infoLevel": "INFO",
      "description": "Localization quality good"
    }
  ]
}
```

### 信息类型

| 类型 | 说明 |
|------|------|
| `LOCALIZATION` | 定位相关信息 |
| `BATTERY` | 电池相关信息 |
| `SAFETY` | 安全相关信息 |
| `COMMUNICATION` | 通信相关信息 |
| `DEVICE` | 设备相关信息 |

### 信息级别

| 级别 | 说明 |
|------|------|
| `INFO` | 一般信息 |
| `WARNING` | 警告信息 |

## 11.6 错误处理

错误信息包含错误详情：

```json
{
  "errors": [
    {
      "errorType": "DEVICE_ERROR",
      "errorLevel": "WARNING",
      "errorMessage": "Battery level low",
      "errorCode": "E001",
      "errorReferences": [...]
    }
  ]
}
```

### 错误级别

| 级别 | 说明 |
|------|------|
| `INFO` | 信息 |
| `WARNING` | 警告 |
| `ERROR` | 错误 |
| `CRITICAL` | 严重错误 |

### 标准错误类型

| 错误类型 | 级别 | 说明 |
|----------|------|------|
| `VALIDATION_FAILURE` | WARNING | 订单验证失败 |
| `UNSUPPORTED_PARAMETER` | CRITICAL | 不支持的参数 |
| `INVALID_ORDER_ACTION` | WARNING | 无效订单动作 |
| `OUTDATED_ORDER_UPDATE` | WARNING | 过时的订单更新 |
| `SAME_ORDER_UPDATE_ID` | WARNING | 相同的订单更新ID |
| `OTHER_ORDER_ACTIVE` | WARNING | 有其他活动订单 |
| `START_NODE_OUT_OF_RANGE` | WARNING | 起始节点超出范围 |
| `NO_ROUTE_TO_TARGET` | WARNING | 无法到达目标 |
| `MOBILE_ROBOT_NOT_AVAILABLE` | WARNING | 机器人不可用 |
| `UNKNOWN_MAP_ID` | WARNING | 未知地图ID |
| `ORDER_UPDATE_FOLLOWING_CANCEL` | WARNING | 取消后的订单更新 |
| `NO_ORDER_TO_CANCEL` | WARNING | 没有可取消的订单 |
| `BLOCKED_ZONE_VIOLATION` | CRITICAL | 阻塞区域违规 |
| `OUTSIDE_OF_CORRIDOR` | CRITICAL | 走廊外 |
| `RELEASE_LOST` | CRITICAL | 释放丢失 |

## 11.7 运行模式

移动机器人可以报告不同的运行模式：

| 模式 | 说明 |
|------|------|
| `AUTOMATIC` | 自动驾驶模式 |
| `MANUAL` | 手动驾驶模式 |
| `SERVICE` | 维护模式 |

## 11.8 空闲状态

当没有订单执行时，移动机器人进入空闲状态：
- `nodeStates` 和 `edgeStates` 为空数组
- `orderId` 保持不变直到收到新订单

### 空闲状态判断条件

1. 机器人不执行任何动作
2. 没有活动订单
3. 没有待处理的视界

## 11.9 动作状态

订单中定义的动作状态通过状态消息报告：

```json
{
  "actionStates": [
    {
      "actionId": "action-001",
      "actionType": "pick",
      "actionStatus": "RUNNING",
      "handle": "robot-arm-1"
    }
  ]
}
```

### 动作状态

| 状态 | 说明 |
|------|------|
| `WAITING` | 等待执行 |
| `INITIALIZING` | 初始化中 |
| `RUNNING` | 正在执行 |
| `PAUSED` | 已暂停 |
| `FINISHED` | 已完成 |
| `FAILED` | 失败 |
| `RETRIABLE` | 可重试 |

### 即时动作状态

```json
{
  "instantActionStates": [
    {
      "actionId": "instant-001",
      "actionType": "startPause",
      "actionStatus": "FINISHED"
    }
  ]
}
```

## 11.10 位置与速度

### 移动机器人位置

```json
{
  "mobileRobotPosition": {
    "x": 10.5,
    "y": 20.3,
    "theta": 1.57,
    "mapId": "map-001",
    "mapDescription": "Factory Floor 1"
  }
}
```

### 速度

```json
{
  "velocity": {
    "x": 0.5,
    "y": 0,
    "omega": 0
  }
}
```

## 11.11 负载状态

```json
{
  "loads": [
    {
      "loadId": "load-001",
      "loadPosition": "LHD1",
      "loadType": "EPAL"
    }
  ]
}
```

> 注意：如果移动机器人无法确定负载状态，此字段应完全省略。如果可以确定负载状态但数组为空，则认为移动机器人未装载。

## 11.12 地图与区域集状态

### 地图状态

```json
{
  "maps": [
    {
      "mapId": "map-001",
      "mapVersion": "1.0",
      "mapStatus": "ENABLED"
    }
  ]
}
```

地图状态值：
- `ENABLED`：可用
- `DISABLED`：不可用

### 区域集状态

```json
{
  "zoneSets": [
    {
      "zoneSetId": "zoneset-001",
      "mapId": "map-001",
      "zoneSetStatus": "ENABLED"
    }
  ]
}
```

## 11.13 能源状态

```json
{
  "batteryState": {
    "batteryCharge": 85,
    "charging": false,
    "reachability": 500
  }
}
```

## 11.14 暂停状态

```json
{
  "paused": true
}
```

- `true`：机器人当前处于暂停状态（通过物理按钮或即时动作）
- `false`：机器人当前未处于暂停状态

## 11.15 请求机制

移动机器人可以通过状态消息向车队控制发送请求。

### 11.15.1 区域释放请求

```json
{
  "zoneRequest": {
    "zoneId": "release-zone-1",
    "requestId": "req-001",
    "requestStatus": "REQUESTED"
  }
}
```

请求状态：
| 状态 | 说明 |
|------|------|
| `REQUESTED` | 已发送请求，等待批准 |
| `GRANTED` | 已获得批准 |
| `REVOKED` | 授权被撤销 |
| `REJECTED` | 请求被拒绝 |

### 11.15.2 走廊请求

```json
{
  "edgeRequest": {
    "edgeId": "edge-001",
    "sequenceId": 3,
    "requestId": "req-002",
    "requestStatus": "REQUESTED"
  }
}
```

### 11.15.3 基线扩展请求

```json
{
  "baseRequest": {
    "requestId": "req-003",
    "type": "EXPAND_BASE"
  }
}
```

## 11.16 运行模式详细说明

| 运行模式 | 车队控制 | 状态消息有效 | 进入时清除订单 | 设置 lastNodeId 为空 | 清除区域请求 | 允许即时动作 | 允许订单 |
|----------|----------|--------------|----------------|---------------------|--------------|--------------|----------|
| `AUTOMATIC` | 是 | 是 | 否 | 否 | 否 | 是 | 是 |
| `SEMIAUTOMATIC` | 是 | 是 | 否 | 否 | 否 | 是 | 是 |
| `INTERVENED` | 否 | 是 | 否 | 否 | 是 | 仅 cancelOrder | 是 |
| `MANUAL` | 否 | 是 | 是 | 是 | 是 | 否 | 否 |
| `STARTUP` | 否 | 否 | 是 | 是 | 是 | 否 | 否 |
| `SERVICE` | 否 | 是 | 是 | 是 | 是 | 否 | 否 |
| `TEACH_IN` | 否 | 是 | 是 | 是 | 是 | 否 | 否 |

### 运行模式说明

- **AUTOMATIC**：车队控制完全控制机器人
- **SEMIAUTOMATIC**：车队控制控制机器人，但速度由HMI控制
- **INTERVENED**：车队控制不控制机器人，但状态正常报告
- **MANUAL**：手动模式，车队控制不能发送订单或动作
- **STARTUP**：启动模式，机器人正在启动
- **SERVICE**：维护模式，授权人员可重新配置机器人
- **TEACH_IN**：示教模式，用于地图绘制等