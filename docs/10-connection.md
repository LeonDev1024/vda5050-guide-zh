# 10. 连接

连接管理确保车队控制系统和移动机器人之间的可靠通信。

## 10.1 连接状态

移动机器人通过 `connection` 主题报告其连接状态：

| 状态 | 说明 |
|------|------|
| `ONLINE` | 移动机器人与 Broker 的连接处于活动状态 |
| `OFFLINE` | 移动机器人与 Broker 以协调方式离线 |
| `HIBERNATING` | 移动机器人进入低功耗状态，停止发送状态消息，但仍保持与 MQTT Broker 的连接 |
| `CONNECTION_BROKEN` | 移动机器人与 Broker 的连接意外终止 |

## 10.2 连接消息格式

```json
{
  "headerId": 1,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.0.0",
  "manufacturer": "ManufacturerA",
  "serialNumber": "ROBOT-001",
  "connectionState": "ONLINE"
}
```

## 10.3 Last Will 消息

MQTT 协议支持设置 Last Will（最后遗言）消息。当移动机器人意外断开连接时，Broker 会自动发布 Last Will 消息。

### 配置建议

- 在移动机器人连接时配置 Last Will
- 主题设置为 `connection`
- 消息内容包含 `connectionState: CONNECTION_BROKEN`
- QoS 设置为 1

## 10.4 断开连接处理

当移动机器人与 Broker 断开连接时：

1. **保留订单信息**：机器人保留所有订单信息
2. **继续执行**：执行到最后一个已发布节点为止
3. **恢复连接后**：等待新的指令

## 10.5 休眠模式

`HIBERNATING` 状态用于省电或减少通信：
- 机器人进入低功耗模式
- 停止发送状态消息
- 保持与 MQTT Broker 的连接
- 可以通过指令或配置的唤醒机制恢复到 `ONLINE` 状态

## 10.6 连接健康检查

车队控制可以通过以下方式检查连接状态：
- 监控 `connection` 主题消息
- 设置 MQTT 心跳
- 定期检查 Last Will 消息

> 注意：`connection` 主题不应被车队控制用于检查移动机器人的健康状态，仅用于 MQTT 协议级别的连接检查。