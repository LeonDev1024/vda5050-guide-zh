# 13. 信息单 (Factsheet)

`factsheet` 主题用于移动机器人向车队控制提供参数和供应商特定信息，以协助车队控制对移动机器人进行设置。

> 信息单是**必选**的。

## 13.1 Factsheet 内容

Factsheet 包含移动机器人的硬件和功能信息：

```json
{
  "headerId": 1,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.0.0",
  "manufacturer": "ManufacturerA",
  "serialNumber": "ROBOT-001",
  "factsheet": {
    "manufacturer": "ManufacturerA",
    "serialNumber": "ROBOT-001",
    "robotType": "AGV",
    "robotModel": "Model-X",
    "serialNumber": "SN-12345",
    "description": "Standard warehouse AGV",
    ...
  }
}
```

## 13.2 主要信息类别

### 13.2.1 基本信息

| 字段 | 说明 |
|------|------|
| `manufacturer` | 制造商 |
| `serialNumber` | 序列号 |
| `robotType` | 机器人类型 (AGV/AMR) |
| `robotModel` | 型号 |

### 13.2.2 物理规格

| 字段 | 说明 |
|------|------|
| `dimensions.length` | 长度 (米) |
| `dimensions.width` | 宽度 (米) |
| `dimensions.height` | 高度 (米) |
| `weight` | 重量 (千克) |
| `maxLoad` | 最大负载 (千克) |

### 13.2.3 运动能力

| 字段 | 说明 |
|------|------|
| `maxSpeed` | 最大速度 (米/秒) |
| `maxAcceleration` | 最大加速度 (米/秒²) |
| `maxDeceleration` | 最大减速度 (米/秒²) |
| `minTurningRadius` | 最小转弯半径 (米) |

### 13.2.4 电池与能源

| 字段 | 说明 |
|------|------|
| `batteryType` | 电池类型 |
| `batteryCapacity` | 电池容量 (Wh) |
| `chargingTypes` | 支持的充电方式 |
| `chargingTime` | 充电时间 (小时) |

### 13.2.5 导航方式

| 字段 | 说明 |
|------|------|
| `navigationType` | 导航类型 (SLAM/循线/混合) |
| `localizationTypes` | 定位方式 |
| `mapFormats` | 支持的地图格式 |

### 13.2.6 动作能力

| 字段 | 说明 |
|------|------|
| `supportedActions` | 支持的动作列表 |
| `actionParameters` | 各动作的默认参数 |
| `loadHandlingTypes` | 载具处理类型 |

### 13.2.7 通信能力

| 字段 | 说明 |
|------|------|
| `mqttVersion` | MQTT 版本 |
| `protocolVersion` | VDA 5050 协议版本 |
| `qosSupport` | 支持的 QoS 级别 |

## 13.3 发送时机

- 首次连接时
- 配置变更后
- 响应车队控制请求时

## 13.4 更新机制

车队控制可以请求重新发送 factsheet：
- 系统启动时
- 定期更新
- 异常状态后