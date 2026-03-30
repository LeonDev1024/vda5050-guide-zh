# 4. 传输协议

通信通过无线网络进行，需要考虑连接失败和消息丢失的影响。

消息协议采用 **MQTT (Message Queuing Telemetry Transport)** 结合 **JSON** 格式。

> MQTT 3.1.1 是最低兼容版本。

MQTT 允许将消息分发到称为"主题"(Topic)的子通道。MQTT 网络中的参与者订阅这些主题，接收与其相关的信息。

JSON 格式允许协议未来扩展额外的参数，并支持基于 Schema 的验证。

## 4.1 连接处理、安全与 QoS

### Last Will 消息

MQTT 协议提供设置"最后遗言"(Last Will)消息的选项。如果客户端意外断开连接，Last Will 消息将由 Broker 分发给其他订阅的客户端。该功能的使用在[第 6.5 节](./10-connection.md#65-连接)中有详细描述。

### 断开连接处理

如果移动机器人与 Broker 断开连接，它应保留所有订单信息并执行到最后一个已发布节点为止的订单。

### QoS 级别

为减少通信开销，对以下主题使用 **MQTT QoS 级别 0 (Best Effort)**：

- `order`
- `instantActions`
- `state`
- `factsheet`
- `zoneSet`
- `responses`
- `visualization`

对主题 `connection` 使用 **QoS 级别 1 (At Least Once)**。

### 安全

协议安全需要由 Broker 配置来考虑，但本规范不涉及此方面。

## 4.2 主题级别

由于云提供商的强制主题结构，MQTT 主题结构没有严格定义。对于基于云的 MQTT Broker，主题结构可能需要单独调整，但应大致遵循建议的结构。

以下章节中定义的主题名称是**强制性的**。

对于本地 Broker，建议的 MQTT 主题级别结构如下：

```
interfaceName/majorVersion/manufacturer/serialNumber/topic
```

### 示例

```
vda5050/v3/KIT/0001/order
```

### 主题级别参数说明

| 主题级别 | 数据类型 | 说明 |
|----------|----------|------|
| `interfaceName` | string | 使用的接口名称 |
| `majorVersion` | string | VDA 5050 建议的主版本号，前缀为 "v" |
| `manufacturer` | string | 移动机器人制造商 |
| `serialNumber` | string | 移动机器人唯一序列号，可使用字符：A-Z, a-z, 0-9, _, ., :, - |
| `topic` | string | 主题名称（如 order, state），见[第 4.4 节](#44-通信主题) |

> **注意**：由于 `/` 字符用于定义主题层次结构，上述任何字段中都不应使用该字符。通配符字符 `+` 和 `#` 以及 Broker 内部主题保留的字符 `$` 也不应使用。

## 4.3 通信主题

协议使用以下主题在车队控制和移动机器人之间交换信息：

| 主题名称 | 发布者 | 订阅者 | 用途 | 实现 | Schema |
|----------|--------|--------|------|------|--------|
| `order` | 车队控制 | 移动机器人 | 订单通信 | 必选 | order.schema |
| `instantActions` | 车队控制 | 移动机器人 | 即时动作通信 | 必选 | instantActions.schema |
| `state` | 移动机器人 | 车队控制 | 移动机器人状态通信 | 必选 | state.schema |
| `visualization` | 移动机器人 | 可视化系统 | 高频位置和规划路径通信 | 可选 | visualization.schema |
| `connection` | Broker / 移动机器人 | 车队控制 | 指示移动机器人连接丢失。不应被车队控制用于检查移动机器人健康状态，仅用于 MQTT 协议级别的连接检查 | 必选 | connection.schema |
| `factsheet` | 移动机器人 | 车队控制 | 参数或供应商特定信息，帮助车队控制设置移动机器人 | 必选 | factsheet.schema |
| `zoneSet` | 车队控制 | 移动机器人 | 区域集从车队控制传输到移动机器人 | 可选 | zoneSet.schema |
| `responses` | 车队控制 | 移动机器人 | 车队控制对移动机器人状态中请求的响应 | 可选 | responses.schema |

> **表 1**：车队控制和移动机器人之间的通信主题