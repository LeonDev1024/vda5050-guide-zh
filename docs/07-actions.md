# 7. 动作

动作是移动机器人在执行订单过程中需要执行的具体操作，如取货、放货、充电、开关门等。

## 7.1 动作概述

如果移动机器人支持除行驶外的其他动作，这些动作通过附加在节点或边上的 `actions` 数组来指示，或通过 `instantActions` 主题发送，或通过动作区域配置。

在边上执行的动作只能在移动机器人在边上时运行。在节点上触发的动作可以运行任意长时间，并且应该是自我终止的（如持续5秒的音频信号或取货动作在取货完成后结束）或成对制定（如 "activateWarningLights" 和 "deactivateWarningLights"）。

## 7.2 即时动作 (Instant Actions)

即时动作是车队控制发送给移动机器人要求立即执行的动作。与订单中的动作不同，即时动作不依赖于订单的执行进度。

即时动作通过 `instantActions` 主题发送。

### 即时动作的特点

- 立即执行，不等待订单完成
- 可以带有参数
- 可能需要一定时间完成
- 可以被拒绝或失败
- 阻塞类型始终为 'NONE'

### 即时动作示例

- 暂停移动机器人而不更改当前订单
- 暂停后恢复订单
- 激活信号（视觉、音频等）

### 无效即时动作

当移动机器人收到无法执行的 `instantAction` 时，应报告 'INVALID_INSTANT_ACTION' 错误，级别为 'WARNING'，并将 `instantAction` 的 `actionId` 作为 `errorReference`。

## 7.3 动作阻塞类型

动作具有不同的阻塞类型，定义了动作执行时允许的其他行为：

| 阻塞类型 | 自动驾驶 | 并行执行 |
|----------|----------|----------|
| `NONE` | 允许 | 允许 |
| `SINGLE` | 允许 | 不允许 |
| `SOFT` | 不允许 | 允许 |
| `HARD` | 不允许 | 不允许 |

### 动作执行顺序

多个动作的顺序定义了移动机器人执行它们的顺序。动作的并行执行由各自的 `blockingType` 控制。

> ![图 1：处理多个动作](./assets/handling_multiple_actions.png)
> **图 1**：处理多个动作

当移动机器人到达要执行新动作的点时（即到达节点、边或动作区域），动作按动作数组的相同顺序入队。该队列按图 1 所示持续处理。如果队列中任何动作的 `blockingType` 是 'SOFT' 或 'HARD'，移动机器人应停止自动驾驶。如果动作的 `blockingType` 是 'NONE' 或 'SOFT'，则收集并行执行。如果要执行 `blockingType` 为 'SINGLE' 或 'HARD' 的动作，所有已收集的并行动作应在开始该动作之前 'FINISHED' 或 'FAILED'。如果队列中不再有 `blockingType` 为 'SOFT' 或 'HARD' 的动作，移动机器人可以恢复自动驾驶。'FINISHED' 或 'FAILED' 的动作应从队列中移除。

## 7.4 动作状态

动作在执行过程中会经历多个状态：

| 状态 | 说明 |
|------|------|
| `INITIALIZING` | 动作正在初始化准备 |
| `WAITING` | 等待执行（在订单中定义的位置） |
| `RUNNING` | 正在执行 |
| `PAUSED` | 已暂停（如安全区域被违反） |
| `FINISHED` | 成功完成 |
| `FAILED` | 执行失败 |
| `RETRIABLE` | 可以重试（如果启用重试且之前失败） |

## 7.5 预定义动作

VDA 5050 定义了一组标准化的动作类型。所有移动机器人应支持 `cancelOrder`、`startPause` 和 `stopPause` 这三个动作。

### 7.5.1 动作列表

| 动作类型 | 反向动作 | 说明 | 幂等 | 即时 | 节点 | 边 | 区域 |
|----------|----------|------|------|------|------|-----|------|
| `startPause` | stopPause | 激活暂停模式，停止自动驾驶 | 是 | 是 | 否 | 否 | 否 |
| `stopPause` | startPause | 停用暂停模式，恢复运动和动作 | 是 | 是 | 否 | 否 | 否 |
| `startHibernation` | stopHibernation | 进入休眠模式，停止发送状态消息 | 是 | 是 | 否 | 否 | 否 |
| `stopHibernation` | startHibernation | 退出休眠模式，恢复正常操作 | 是 | 是 | 否 | 否 | 否 |
| `shutdown` | - | 有序关闭移动机器人，断开 MQTT 连接 | 是 | 是 | 否 | 否 | 否 |
| `startCharging` | stopCharging | 激活充电过程 | 是 | 是 | 是 | 否 | 否 |
| `stopCharging` | startCharging | 停止充电过程 | 是 | 是 | 是 | 否 | 否 |
| `initializePosition` | - | 重置移动机器人的位姿 | 是 | 是 | 是 | 否 | 否 |
| `enableMap` | - | 启用之前下载的地图 | 是 | 是 | 是 | 否 | 否 |
| `downloadMap` | - | 触发新地图下载 | 是 | 是 | 否 | 否 | 否 |
| `deleteMap` | - | 删除移动机器人内存中的地图 | 是 | 是 | 否 | 否 | 否 |
| `downloadZoneSet` | - | 触发区域集下载 | 是 | 是 | 否 | 否 | 否 |
| `enableZoneSet` | - | 启用之前下载的区域集 | 是 | 是 | 是 | 否 | 否 |
| `deleteZoneSet` | - | 删除区域集 | 是 | 是 | 否 | 否 | 否 |
| `clearInstantActions` | - | 清除所有已完成的即时动作 | 是 | 是 | 是 | 否 | 否 |
| `clearZoneActions` | - | 清除所有区域动作 | 是 | 是 | 是 | 否 | 否 |
| `stateRequest` | - | 请求移动机器人发送新状态 | 是 | 是 | 否 | 否 | 否 |
| `logReport` | - | 请求生成日志报告 | 是 | 是 | 否 | 否 | 否 |
| `pick` | drop | 请求移动机器人取货 | 否 | 否 | 是 | 是 | 否 |
| `drop` | pick | 请求移动机器人放货 | 否 | 否 | 是 | 是 | 否 |
| `detectObject` | - | 检测物体（负载、充电位等） | 是 | 否 | 是 | 是 | 是 |
| `finePositioning` | - | 精确到达目标位置 | 是 | 否 | 是 | 是 | 是 |
| `waitForTrigger` | - | 等待触发器触发 | 是 | 否 | 是 | 否 | 是 |
| `trigger` | - | 通知移动机器人可以继续 | 是 | 是 | 否 | 否 | 否 |
| `retry` | - | 重试当前处于 RETRIABLE 状态的动作 | 是 | 否 | 否 | 否 | 否 |
| `skipRetry` | - | 跳过重试，将动作设为 FAILED | 是 | 否 | 否 | 否 | 否 |
| `cancelOrder` | - | 尽快停止移动机器人 | 是 | 是 | 否 | 否 | 否 |
| `factsheetRequest` | - | 请求发送 factsheet | 是 | 是 | 否 | 否 | 否 |
| `updateCertificate` | - | 下载并激活新证书集 | 是 | 是 | 否 | 否 | 否 |

### 7.5.2 动作详细参数

#### 取放动作

**pick - 取货**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `lhd` | string | 否 | 负载处理设备标识（如 LHD1） |
| `stationType` | string | 否 | 站点类型（floor/rack/passiveConveyor/activeConveyor） |
| `stationName` | string | 否 | 站点名称 |
| `loadType` | string | 否 | 负载类型（如 EPAL/INDU） |
| `loadId` | string | 否 | 负载标识 |
| `height` | float64 | 否 | 负载底部相对于地面的高度 |
| `depth` | float64 | 否 | 深度（叉车用） |
| `side` | string | 否 | 侧面（如 conveyor） |

**drop - 放货**
参数与 pick 相同。

#### 地图操作

**downloadMap**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mapId` | string | 是 | 地图标识 |
| `mapVersion` | string | 是 | 地图版本 |
| `mapDownloadLink` | string | 是 | 地图下载链接 |
| `mapHash` | string | 否 | 地图哈希值（可选） |

**enableMap**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mapId` | string | 是 | 地图标识 |
| `mapVersion` | string | 是 | 地图版本 |

**deleteMap**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mapId` | string | 是 | 地图标识 |
| `mapVersion` | string | 是 | 地图版本 |

#### 区域集操作

**downloadZoneSet**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `zoneSetId` | string | 是 | 区域集标识 |
| `zoneSetDownloadLink` | string | 是 | 区域集下载链接 |
| `zoneSetHash` | string | 否 | 区域集哈希值 |

**enableZoneSet**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `zoneSetId` | string | 是 | 区域集标识 |

**deleteZoneSet**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `zoneSetId` | string | 是 | 区域集标识 |

#### 位置初始化

**initializePosition**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `x` | float64 | 是 | X 坐标 |
| `y` | float64 | 是 | Y 坐标 |
| `theta` | float64 | 是 | 方向角（弧度） |
| `mapId` | string | 是 | 地图标识 |
| `lastNodeId` | string | 是 | 最后一个节点 ID |

#### 充电动作

**startCharging** / **stopCharging**
无额外参数。

#### 暂停/休眠

**startPause** / **stopPause**
无额外参数。

**startHibernation**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `wakeUpTime` | string | 否 | 唤醒时间（ISO 8601） |

**stopHibernation**
无额外参数。

#### 证书更新

**updateCertificate**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `service` | string | 是 | 服务类型（如 'MQTT'） |
| `keyDownloadLink` | string | 是 | 密钥下载链接 |
| `certificateDownloadLink` | string | 是 | 证书下载链接 |
| `certificateAuthorityDownloadLink` | string | 否 | 证书颁发机构下载链接 |

## 7.6 动作参数格式

动作参数以 JSON 对象数组的形式传递：

```json
{
  "actionType": "pick",
  "actionId": "action-001",
  "blockingType": "HARD",
  "actionParameters": [
    {
      "key": "deviceId",
      "value": "device-01"
    },
    {
      "key": "loadId",
      "value": "load-001"
    }
  ]
}
```

参数支持的数据类型：
- `string`
- `integer`
- `float`
- `boolean`
- `object`
- `array`

## 7.7 动作执行与节点/边的触发

### 节点动作触发

到达节点时，该节点上定义的所有动作被添加到执行队列。动作可以：
- 自我终止（如音频信号持续5秒）
- 成对执行（如 activateWarningLights / deactivateWarningLights）

### 边动作触发

在边上执行的动作只能在移动机器人在边上时运行。动作从进入边开始执行，到离开边结束。

### 动作状态转换

> 动作状态转换图示

1. **INITIALIZING** → **RUNNING**：初始化完成后开始执行
2. **RUNNING** → **PAUSED**：因安全区域违反等暂停
3. **RUNNING** → **FINISHED**：成功完成
4. **RUNNING** → **FAILED**：执行失败
5. **RUNNING** → **RETRIABLE**：可重试的失败
6. **PAUSED** → **RUNNING**：恢复执行
7. **PAUSED** → **FAILED**：无法恢复
8. **RETRIABLE** → **RUNNING**：通过 retry 动作重试
9. **RETRIABLE** → **FAILED**：通过 skipRetry 跳过