# 12. 可视化

可视化功能用于将移动机器人的位置和路径信息传输到可视化系统（如监控大屏、调试工具等）。

## 12.1 可视化主题

移动机器人通过 `visualization` 主题发送高频位置和路径信息。

> 可视化功能是**可选的**。

## 12.2 可视化消息内容

```json
{
  "headerId": 1,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.0.0",
  "manufacturer": "ManufacturerA",
  "serialNumber": "ROBOT-001",
  "position": {
    "x": 10.5,
    "y": 20.3,
    "theta": 1.57
  },
  "velocity": {
    "vx": 0.5,
    "vy": 0,
    "omega": 0
  },
  "plannedPath": {...},
  "intermediatePath": [...]
}
```

## 12.3 位置信息

位置信息包括：
- **x, y**: 二维坐标
- **theta**: 朝向角（弧度）
- **mapId**: 所在地图

## 12.4 路径可视化

### plannedPath

机器人当前订单的规划路径，以 NURBS 曲线表示：

```json
{
  "plannedPath": {
    "type": "NURBS",
    "controlPoints": [...],
    "degree": 3
  }
}
```

### intermediatePath

机器人传感器感知到的近端路径点：

```json
{
  "intermediatePath": [
    {
      "x": 10.5,
      "y": 20.3,
      "orientation": 1.57
    }
  ]
}
```

## 12.5 使用场景

- 实时监控大屏
- 调试和诊断工具
- 路径规划和仿真系统
- 运营分析工具