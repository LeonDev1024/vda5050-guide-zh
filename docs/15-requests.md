# 15. 请求/响应机制

VDA 5050 定义了移动机器人向车队控制发送请求，车队控制响应的机制。

## 15.1 请求类型

### 15.1.1 区域释放请求

当移动机器人需要进入 `RELEASE` 类型区域时，需要向车队控制发送释放请求。

```json
{
  "zoneRequest": {
    "requestId": "req-001",
    "zoneId": "release-zone-1",
    "requestStatus": "REQUESTED"
  }
}
```

### 15.1.2 走廊使用请求

当订单中的走廊设置了 `releaseRequired: true` 时，机器人在使用走廊前需要请求批准。

```json
{
  "edgeRequest": {
    "requestId": "req-002",
    "edgeId": "edge-001",
    "sequenceId": 3,
    "requestStatus": "REQUESTED"
  }
}
```

### 15.1.3 基线扩展请求

机器人可以请求车队控制扩展基线，释放更多节点和边。

```json
{
  "baseRequest": {
    "requestId": "req-003",
    "type": "EXPAND_BASE"
  }
}
```

### 15.1.4 协调重规划请求

在 `COORDINATED_REPLANNING` 区域内，机器人需要请求车队控制批准才能重规划路径。

```json
{
  "replanningRequest": {
    "requestId": "req-004",
    "requestStatus": "REQUESTED",
    "reason": "obstacle_avoidance"
  }
}
```

## 15.2 响应消息

车队控制通过 `responses` 主题向移动机器人发送响应。

```json
{
  "headerId": 100,
  "timestamp": "2024-01-15T14:32:00.000Z",
  "version": "3.0.0",
  "manufacturer": "FleetController",
  "serialNumber": "FC-001",
  "responses": [
    {
      "requestId": "req-001",
      "requestType": "RELEASE_ZONE_ACCESS",
      "grantType": "GRANTED",
      "leaseExpiry": "2024-01-15T15:32:00.000Z"
    }
  ]
}
```

### 响应类型

| 类型 | 说明 |
|------|------|
| `GRANTED` | 请求已批准 |
| `QUEUED` | 请求已加入队列等待处理 |
| `REVOKED` | 撤销之前授予的请求 |
| `REJECTED` | 拒绝请求 |

## 15.3 请求处理流程

> ![请求处理流程图](./assets/request_state_transitions.png)

### 区域释放请求流程

1. 机器人进入 `RELEASE` 区域
2. 发送 `zoneRequest`，状态为 `REQUESTED`
3. 车队控制评估请求
4. 车队控制发送响应：
   - `GRANTED`：机器人可以进入
   - `QUEUED`：等待队列
   - `REJECTED`：拒绝请求
5. 机器人收到响应后更新状态

### 走廊请求流程

1. 订单中边包含 `releaseRequired: true` 的走廊
2. 机器人需要偏离预定义轨迹时
3. 发送 `edgeRequest`，状态为 `REQUESTED`
4. 车队控制批准（仅限基线中的边）
5. 机器人收到 `GRANTED` 响应后可以使用走廊
6. 不再需要时，机器人从状态中移除请求

## 15.4 授权过期与撤销

### 过期处理

响应消息中包含 `leaseExpiry` 时间戳。当授权过期时：

- **RELEASE 区域**：`releaseLossBehavior` 定义行为
  - `STOP`：停止并报告错误
  - `EVACUATE`：执行疏散行为
  - `CONTINUE`：继续路径

- **走廊**：
  - 返回预定义轨迹
  - 或停在当前位置等待干预

### 撤销处理

车队控制可以随时撤销已授予的请求：

1. 发送 `grantType: REVOKED` 的响应
2. 机器人收到后执行相应的回退行为

## 15.5 请求超时

机器人应设置请求超时：

- 如果在合理时间内未收到响应，报告错误
- 可以重试请求或执行回退行为

## 15.6 多个请求

机器人可以同时发送多个请求：

- 每个请求使用唯一的 `requestId`
- 请求之间相互独立
- 车队控制按需处理和响应