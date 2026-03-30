# 16. 调试与故障排除

本节提供 VDA 5050 实现中的常见问题和解决方案。

## 16.1 常见问题与解决方案

### 问题 1：机器人不接收订单

**症状**：机器人没有响应订单消息

**可能原因**：
1. MQTT 主题配置错误
2. JSON 格式错误
3. 必填字段缺失

**排查步骤**：
1. 检查 MQTT 主题是否正确（`vda5050/v3/{manufacturer}/{serialNumber}/order`）
2. 验证 JSON 格式（使用 JSON Schema）
3. 确认必填字段：`headerId`, `timestamp`, `version`, `manufacturer`, `serialNumber`, `orderId`, `nodes`
4. 检查 `orderUpdateId` 是否正确

**解决方案**：
```json
// 确保基本结构正确
{
  "headerId": 1,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "version": "3.0.0",
  "manufacturer": "RobotCorp",
  "serialNumber": "AGV-001",
  "orderId": "order-001",
  "orderUpdateId": 0,
  "nodes": [...],
  "edges": [...]
}
```

### 问题 2：状态消息丢失

**症状**：车队控制看不到机器人的状态更新

**可能原因**：
1. 订阅主题错误
2. QoS 配置问题
3. 网络连接不稳定

**排查步骤**：
1. 确认订阅了正确的主题
2. 检查 MQTT 连接状态
3. 监控 `connection` 主题

**解决方案**：
- 使用 MQTT 调试工具（如 MQTT Explorer）监控消息
- 实现消息重传机制
- 增加心跳检测

### 问题 3：动作执行失败

**症状**：机器人无法完成动作，状态停留在 RUNNING

**可能原因**：
1. 参数不正确
2. 设备故障
3. 动作被阻塞

**排查步骤**：
1. 检查动作参数是否符合 factsheet 中定义
2. 查看错误消息
3. 检查阻塞类型

**解决方案**：
- 使用 `retry` 动作重试
- 使用 `skipRetry` 跳过失败动作
- 检查 `actionStates` 中的详细状态

### 问题 4：区域请求被拒绝

**症状**：RELEASE 区域请求始终被拒绝

**可能原因**：
1. 区域不在机器人基线中
2. 车队控制策略限制
3. 区域被其他机器人占用

**解决方案**：
- 确保请求的区域在订单的基线中
- 与车队控制协调区域使用
- 实现回退行为（STOP/CONTINUE/EVACUATE）

### 问题 5：连接频繁断开

**症状**：机器人经常与 Broker 断开连接

**可能原因**：
1. 网络不稳定
2. 机器人休眠
3. Broker 配置问题

**解决方案**：
- 配置 Last Will 消息
- 调整 MQTT KeepAlive 参数
- 检查机器人连接状态（`connection` 主题）

## 16.2 调试工具

### MQTT 调试

```bash
# 使用 mosquitto 订阅所有主题
mosquitto_sub -t "vda5050/v3/+/+/+" -v

# 使用 MQTT Explorer
# 下载: https://mqtt-explorer.com/
```

### JSON 验证

使用 JSON Schema 验证消息：
```bash
# 安装 ajv
npm install -g ajv

# 验证订单
ajv -s order.schema.json -d your-order.json
```

### 日志分析

关键日志点：
1. 订单接收和解析
2. 状态更新发送
3. 动作状态转换
4. 错误和警告
5. 连接状态变化

## 16.3 错误代码详解

| 错误类型 | 级别 | 说明 | 解决方案 |
|----------|------|------|----------|
| `VALIDATION_FAILURE` | WARNING | 订单格式错误 | 检查 JSON 格式 |
| `UNSUPPORTED_PARAMETER` | CRITICAL | 不支持的参数 | 升级固件或使用支持的参数 |
| `LOCALIZATION_ERROR` | FATAL | 定位丢失 | 重新初始化位置 |
| `OUTSIDE_OF_CORRIDOR` | CRITICAL | 超出走廊 | 停止并等待新订单 |
| `BLOCKED_ZONE_VIOLATION` | CRITICAL | 阻塞区域违规 | 退出阻塞区域 |
| `RELEASE_LOST` | CRITICAL | 区域授权丢失 | 执行回退行为 |

## 16.4 性能优化

### 消息频率

- **状态消息**：建议 1-10 Hz
- **可视化消息**：可选，10-30 Hz
- **订单更新**：按需，避免过于频繁

### 带宽优化

1. 仅发送必要的字段
2. 使用增量状态更新
3. 压缩大消息（如果支持）

### 错误恢复

1. 实现自动重连机制
2. 缓存未确认的消息
3. 状态持久化（断点恢复）

## 16.5 测试清单

### 功能测试

- [ ] 订单发送和接收
- [ ] 订单更新（扩展基线）
- [ ] 订单取消
- [ ] 即时动作
- [ ] 状态上报
- [ ] 连接管理
- [ ] 区域处理
- [ ] 错误报告

### 边界条件测试

- [ ] 空订单（无视界）
- [ ] 连续订单更新
- [ ] 并发多个订单
- [ ] 网络断开恢复
- [ ] 机器人重启

### 性能测试

- [ ] 高频状态消息
- [ ] 大订单（多节点）
- [ ] 长时间运行稳定性
- [ ] 多机器人同时运行