# 14. 消息规格

本章详细说明 VDA 5050 协议中使用的所有消息格式。

## 14.1 表格符号与格式说明

### 必填与可选字段

- **粗体字段**：必填字段
- *斜体字段*：可选字段

### 允许的字符和字段长度

- 字符串字段的最大长度在各字段说明中定义
- 允许的字符：数字、字母、下划线、连字符等（见各字段规范）

### JSON 数据类型

| 类型 | 说明 |
|------|------|
| `string` | 字符串 |
| `uint32` | 32位无符号整数 |
| `int32` | 32位有符号整数 |
| `float64` | 64位浮点数 |
| `boolean` | 布尔值 |
| `array` | 数组 |
| `object` | JSON 对象 |
| `enum` | 枚举值 |

## 14.2 协议头部

每个消息都包含相同的协议头部：

| 字段 | 类型 | 说明 |
|------|------|------|
| `headerId` | uint32 | 消息头部ID，每个主题独立递增 |
| `timestamp` | string | 时间戳 (ISO 8601, UTC) |
| `version` | string | 协议版本 [Major].[Minor].[Patch] |
| `manufacturer` | string | 移动机器人制造商 |
| `serialNumber` | string | 移动机器人序列号 |

> 时间戳格式：`YYYY-MM-DDTHH:mm:ss.fffZ`（如：`2017-04-15T11:40:03.123Z`）

## 14.3 Order 消息

### 消息结构

```json
{
  "header": {...},
  "orderId": "string",
  "orderUpdateId": 0,
  "nodes": [...],
  "edges": [...]
}
```

### 节点结构

```json
{
  "nodeId": "string",
  "sequenceId": 0,
  "released": true,
  "nodeDescriptor": "string",
  "actions": [...]
}
```

### 边结构

```json
{
  "edgeId": "string",
  "sequenceId": 1,
  "released": true,
  "edgeDescriptor": "string",
  "actions": [...],
  "fromNodeId": "string",
  "toNodeId": "string"
}
```

## 14.4 InstantAction 消息

即时动作消息用于发送需要立即执行的动作：

```json
{
  "header": {...},
  "instantActions": [
    {
      "actionType": "string",
      "actionId": "string",
      "blockingType": "NONE|SINGLE|SOFT|HARD",
      "actionParameters": [...],
      "retriable": false
    }
  ]
}
```

## 14.5 Response 消息

车队控制对移动机器人请求的响应：

```json
{
  "header": {...},
  "responses": [
    {
      "requestId": "string",
      "requestType": "string",
      "grantType": "GRANTED|QUEUED|REVOKED|REJECTED",
      "leaseExpiry": "string"
    }
  ]
}
```

响应类型：
| 类型 | 说明 |
|------|------|
| `GRANTED` | 请求已批准 |
| `QUEUED` | 请求已加入队列，等待处理 |
| `REVOKED` | 撤销之前授予的请求 |
| `REJECTED` | 拒绝请求 |

## 14.6 ZoneSet 消息

区域集消息：

```json
{
  "header": {...},
  "zoneSet": {
    "mapId": "string",
    "zoneSetId": "string",
    "zoneSetDescriptor": "string",
    "zones": [...]
  }
}
```

## 14.7 Connection 消息

连接状态消息：

```json
{
  "header": {...},
  "connectionState": "ONLINE|OFFLINE|HIBERNATING|CONNECTION_BROKEN"
}
```

## 14.8 State 消息

状态消息包含完整的状态信息，详细结构见[第 11 章](./11-state.md)。

## 14.9 Visualization 消息

可视化消息结构见[第 12 章](./12-visualization.md)。

## 14.10 Factsheet 消息

Factsheet 消息结构见[第 13 章](./13-factsheet.md)。

## 14.11 错误代码

标准错误代码：

| 错误代码 | 说明 |
|----------|------|
| `E001` | 电池电量低 |
| `E002` | 电池故障 |
| `E003` | 电机故障 |
| `E004` | 传感器故障 |
| `E005` | 通信错误 |
| `E006` | 定位失败 |
| `E007` | 导航错误 |
| `E008` | 安全区域入侵 |
| `E009` | 动作执行失败 |
| `E010` | 系统错误 |

## 14.12 枚举值汇总

### 连接状态
`ONLINE`, `OFFLINE`, `HIBERNATING`, `CONNECTION_BROKEN`

### 运行模式
`AUTOMATIC`, `MANUAL`, `SERVICE`

### 动作状态
`WAITING`, `RUNNING`, `FINISHED`, `FAILED`, `RETRIABLE`

### 阻塞类型
`NONE`, `SINGLE`, `SOFT`, `HARD`

### 区域类型
`BLOCKED`, `LINE_GUIDED`, `RELEASE`, `COORDINATED_REPLANNING`, `SPEED_LIMIT`, `ACTION`, `PRIORITY`, `PENALTY`, `DIRECTED`, `BIDIRECTED`

### 响应类型
`GRANTED`, `QUEUED`, `REVOKED`, `REJECTED`