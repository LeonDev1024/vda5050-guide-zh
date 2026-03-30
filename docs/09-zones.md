# 9. 区域

区域是地图上的逻辑分区，用于定义速度限制、访问权限、行为约束等。

## 9.1 区域概述

区域用于定义移动机器人工作空间特定区域的规则。通过这种方式，区域允许移动机器人在节点之间自由导航，同时使车队控制能够管理交通。区域可用于本地拒绝移动机器人访问某些区域或将访问与条件关联（区域类型：'BLOCKED' 和 'RELEASE'）。还可以在区域内强制执行特定行为（区域类型：'LINE_GUIDED'、'SPEED_LIMIT'、'COORDINATED_REPLANNING' 和 'ACTION'），或通过激励或惩罚某些区域（区域类型：'PRIORITY' 和 'PENALTY'）或给出预定义的行驶方向（区域类型：'DIRECTED'、'BIDIRECTED'）来影响行驶行为。

一些移动机器人根本无法处理区域，而其他移动机器人可能只能处理某些区域类型（如 'BLOCKED'）。因此，所有移动机器人应通过在 factsheet 的 `supportedZones` 数组中添加相应的区域名称来向车队控制报告它们能够理解的区域。

区域集只能由车队控制更改和分发，以保持系统一致性。

## 9.2 区域类型

VDA 5050 定义了两类区域：基于轮廓的区域和基于运动中心的区域。

### 基于轮廓的区域 (Contour-based Zones)

对于基于轮廓的区域，移动机器人（包括其负载）的轮廓决定区域的进入和退出。轮廓的任何部分进入区域即为进入区域。一旦移动机器人的轮廓不再保持在区域内，即为离开区域。

> ![图 1：基于轮廓进入区域](./assets/contour_entry.png)
> **图 1**：基于轮廓进入区域（左）和负载移动机器人离开区域（右）

| 区域类型 | 参数 | 类型 | 说明 |
|----------|------|------|------|
| `BLOCKED` | - | - | 移动机器人不应进入此区域。如果移动机器人已进入或发现自己处于其中，应停止并抛出 'BLOCKED_ZONE_VIOLATION' 错误，级别设为 CRITICAL。 |
| `LINE_GUIDED` | - | - | 此区域不允许自由导航，移动机器人应遵循边上的预定义轨迹。移动机器人只能通过车队控制以节点-边图的形式明确指定路线才能进入此区域。 |
| `RELEASE` | releaseLossBehavior | string | 移动机器人只有在获得车队控制授权后才能进入此区域。<br>枚举值：<br>- 'STOP'：停止并报告 'RELEASE_LOST' 错误<br>- 'EVACUATE'：执行疏散行为离开区域<br>- 'CONTINUE'：继续路径 |
| `COORDINATED_REPLANNING` | - | - | 此区域内不允许自主重规划。移动机器人只有在获得车队控制许可的情况下才能调整路径。 |
| `SPEED_LIMIT` | maximumSpeed | float64 | 移动机器人在此区域内的速度不应超过定义的最大速度。进入区域时应已达到速度限制。 |
| `ACTION` | entryActions<br>duringActions<br>exitActions | array | 移动机器人在进入、穿越或离开区域时应执行预定义动作。factsheet 定义了可以何时执行哪些动作。 |

### 基于运动中心的区域 (Kinematic center-based Zones)

在基于运动中心的区域中，移动机器人的运动中心决定其进入和离开区域。'PRIORITY' 和 'PENALTY' 区域仅影响移动机器人的路径规划。'DIRECTED' 区域定义区域内的首选行驶方向。'BIDIRECTED' 定义行驶方向及其相反方向。

> ![图 2：基于运动中心进入区域](./assets/kinematic_center_entry.png)
> **图 2**：基于运动中心进入区域（左）和负载移动机器人离开区域（右）

| 区域类型 | 参数 | 类型 | 说明 |
|----------|------|------|------|
| `PRIORITY` | priorityFactor | float64 | [0.0...1.0] 相对因子，确定区域相对于无区域的workspace的偏好。0.0 表示无偏好，1.0 是最大偏好。 |
| `PENALTY` | penaltyFactor | float64 | [0.0...1.0] 相对因子，确定区域相对于无区域的惩罚。0.0 表示无惩罚，1.0 是最大惩罚，导致移动机器人只有找不到其他可行路线时才走此路径。 |
| `DIRECTED` | direction<br>directedLimitation | float64<br>string | 首选行驶方向（弧度）。<br>限制枚举：<br>- 'SOFT'：可以偏离但应避免<br>- 'RESTRICTED'：可以偏离以避障，但不应逆行<br>- 'STRICT'：尽可能精确保持方向 |
| `BIDIRECTED` | direction<br>bidirectedLimitation | float64<br>string | 双向行驶方向。<br>限制枚举：<br>- 'SOFT'：可以偏离但应避免<br>- 'RESTRICTED'：除避障外不应在其他方向行驶 |

## 9.3 区域集传输

区域集通过 `zoneSet` 主题从车队控制传输到移动机器人。

### 区域集结构

```json
{
  "zoneSetId": "zoneset-001",
  "mapId": "map-001",
  "zoneSetDescriptor": "Factory Zone Set",
  "zones": [...]
}
```

### 区域结构

```json
{
  "zoneId": "zone-001",
  "zoneType": "SPEED_LIMIT",
  "zoneDescriptor": "Speed Limit Zone",
  "vertices": [
    {"x": 0, "y": 0},
    {"x": 10, "y": 0},
    {"x": 10, "y": 5},
    {"x": 0, "y": 5}
  ],
  "maximumSpeed": 0.5
}
```

## 9.4 交互区域通信

交互区域需要人机交互，如按钮按下、确认等。

### 交互流程

1. 移动机器人进入交互区域
2. 机器人发送状态消息指示需要交互
3. 车队控制发送响应或指令
4. 机器人执行相应动作

## 9.5 区域间的交互

多个区域可能重叠或相邻，需要处理区域间的冲突：

### 冲突解决规则

- **阻塞优先级**：BLOCKED 区域优先于其他所有区域
- **速度限制**：取最小值
- **优先级 vs 惩罚**：PRIORITY 区域覆盖 PENALTY 区域
- **释放 vs 阻塞**：RELEASE 区域在获得授权前等效于 BLOCKED
- **方向限制**：STRICT > RESTRICTED > SOFT

## 9.6 区域内的错误处理

当机器人在区域内遇到错误时：
1. 机器人进入错误状态
2. 报告错误详情
3. 等待车队控制指示
4. 根据指令继续或停止

### 常见区域错误

| 错误类型 | 级别 | 说明 |
|----------|------|------|
| `BLOCKED_ZONE_VIOLATION` | CRITICAL | 进入或处于 BLOCKED 区域 |
| `RELEASE_LOST` | CRITICAL | RELEASE 区域授权丢失或过期 |

## 9.7 区域顶点定义

区域通过多边形定义，顶点按逆时针方向排列：

- 至少需要 3 个顶点
- 多边形自动闭合
- 只能使用简单多边形（无交叉）

```
vertices: [
  {x: 0, y: 0},
  {x: 10, y: 0},
  {x: 10, y: 5},
  {x: 0, y: 5}
]
```

## 9.8 区域与订单的交互

对于已发布且属于订单但由于区域而受限的节点（如位于 'BLOCKED' 或 'RELEASE' 区域内的节点），机器人应根据区域行事（如不进入或等待 'GRANTED' 状态的请求）。