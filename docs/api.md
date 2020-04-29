# ChessTerm API

除了[直接在网页上使用](https://chessterm.tech/) ，您也可以通过 API 与 ChessTerm 通信，方便编程自动化使用。

ChessTerm 有**三种** API，分别为 **[Legacy](#1)**、**[RESTful](#2)** 和 **[Socket.io](#3)**。前两种较为相似，均为基于 HTTP 的简单通信；后一种可以实现实时双向通信。点击链接可以快速跳转到相应说明。

## <a id="1"></a> 1. Legacy API

此方式所有 API 访问方式均为 `HTTP GET` 方法，方便浏览器调用，但此方式较 [RESTful](#2) 模式较为复杂，[RESTful](#2) 模式的语法更容易理解。

### 获取/修改棋盘信息

**URL**: `https://chessterm.tech/boards`  
**Query Params**:

|      参数      |      示例值     | 必填 (默认值) | 说明                                                                                                                                         |
|:--------------:|:---------------:|:-------------:|----------------------------------------------------------------------------------------------------------------------------------------------|
|    **`id`**    |   `100010170`   |       是      | 棋盘 ID（即 `Game ID` + 棋盘码）                                                                                                             |
| **`chesspos`** | `zZ0Zz0zzzZ00Z` |       否      | **更新棋盘时可用**，更新后的 `chesspos`                                                                                                      |
|    **`cut`**   |       `14`      |       否      | **查询棋盘时可用**，若传入，则按此大小切割输出结果（见下方[示例](#1-1-3)）                                                                   |
|   **`json`**   |      `true`     |  否 (`false`) | **查询棋盘时可用**，是否以 `application/json` 格式输出，若为否则输出 `text/plain`；若 `cut` 或 `history` 不为空则强制输出 `application/json` |

**Note**: 提供 `chesspos` 或 `clock` 参数时为更新棋盘模式，否则为查询棋盘模式。更新棋盘模式不显示结果，若需要查看结果需要再执行查询模式。

**Examples**:

<details>
  <summary>展开示例</summary>
  
#### 仅传入 `id`
```
# 请求内容
GET https://chessterm.tech/boards?id=100010170

# 返回内容
Content-Type: text/plain

0000000000000000z0Z0000000000000000000000000z0z0z0Z000000000z00Z0000000000Z000000000000000000000000000Z0000000000000000000000000000z000000000000000000000000000z000000000000000000000000000000000000
```

#### <a id="1-1-2"></a> 以 JSON 格式输出
```
# 请求内容
GET https://chessterm.tech/boards?id=100010170&json=true

# 返回内容
Content-Type: application/json

{
  "success": true,
  "message": null,
  "data": {
    "id": 100010170,
    "chesspos": "0000000000000000z0Z0000000000000000000000000z0z0z0Z000000000z00Z0000000000Z000000000000000000000000000Z0000000000000000000000000000z000000000000000000000000000z000000000000000000000000000000000000",
    "clock": null
  }
}
```

#### <a id="1-1-3"></a> 切割结果
```
# 请求内容
GET https://chessterm.tech/boards?id=100010170&cut=14

# 返回内容
Content-Type: application/json

{
  "success": true,
  "message": null,
  "data": {
    "id": 100010170,
      "chesspos": [
        "00000000000000",
        "00z0Z000000000",
        "00000000000000",
        "00z0z0z0Z00000",
        "0000z00Z000000",
        "0000Z000000000",
        "00000000000000",
        "0000Z000000000",
        "00000000000000",
        "00000z00000000",
        "00000000000000",
        "00000z00000000",
        "00000000000000",
        "00000000000000"
      ],
    "clock": null
  }
}
```

#### 更新棋盘内容
```
# 请求内容
GET https://chessterm.tech/boards?id=100010170&chesspos=0000000000000000z0Z0000000000000000000000000z0z0z0Z000000000z00Z0000000000Z000000000000000000000000000Z0000000000000000000000000000z000000000000000000000000000z000000000000000000000000000000000000

# 返回内容
Content-Type: application/json

{
  "success": true,
  "message": null
}
```

</details>

## <a id="2"></a> 2. RESTful API

### 获取棋盘信息

**URL**: `https://chessterm.tech/boards/{id}`  
**Method**: `HTTP GET`  
**URL Params**:

|   参数   |    示例值   | 说明                             |
|:--------:|:-----------:|----------------------------------|
| **`id`** | `100010170` | 棋盘 ID（即 `Game ID` + 棋盘码） |

**Query Params**:

|    参数    | 示例值 | 必填 (默认值) | 说明                                                                                                                     |
|:----------:|:------:|:-------------:|--------------------------------------------------------------------------------------------------------------------------|
|  **`cut`** |  `14`  |       否      | 若传入，则按此大小切割输出结果（见前面的[示例](#1-1-3)）                                                                 |
| **`json`** | `true` |  否 (`false`) | 是否以 `application/json` 格式输出，若为否则输出 `text/plain`；若 `cut` 或 `history` 不为空则强制输出 `application/json` |

**Examples**:

<details>
  <summary>展开示例</summary>
  
#### 仅传入 `id`
```
# 请求内容
GET https://chessterm.tech/boards/100010170

# 返回内容
Content-Type: text/plain

0000000000000000z0Z0000000000000000000000000z0z0z0Z000000000z00Z0000000000Z000000000000000000000000000Z0000000000000000000000000000z000000000000000000000000000z000000000000000000000000000000000000
```

其它参数用法与 [Legacy API](#1-1-2) 同理。

</details>

### 修改棋盘内容

**URL**: `https://chessterm.tech/boards/{id}`  
**Method**: `HTTP PUT` 或 `HTTP PATCH`  
**URL Params**:

|   参数   |    示例值   | 说明                             |
|:--------:|:-----------:|----------------------------------|
| **`id`** | `100010170` | 棋盘 ID（即 `Game ID` + 棋盘码） |

**Query Params**:

|      参数      |      示例值     | 说明                |
|:--------------:|:---------------:|---------------------|
| **`chesspos`** | `zZ0Zz0zzzZ00Z` | 更新后的 `chesspos` |

**Examples**:

<details>
  <summary>展开示例</summary>
  
#### 仅传入 `id`
```
# 请求内容
PUT https://chessterm.tech/boards/100010170
Content-Type: application/x-www-form-urlencoded

chesspos=0000000000000000z0Z0000000000000000000000000z0z0z0Z000000000z00Z0000000000Z000000000000000000000000000Z0000000000000000000000000000z000000000000000000000000000z000000000000000000000000000000000000

# 返回内容
Content-Type: application/json

{
  "success": true,
  "message": null
}
```

</details>

## <a id="3"></a> 3. Socket.io API

此种 API 目前仅支持使用 JavaScript 语言的 [Socket.io](https://socket.io/) 库，详细使用方法参见 [Socket.io 官方文档](https://socket.io/docs/) 。

**URL**: `https://chessterm.tech:8512`

### 使用示例：
```javascript
const io = require("socket.io-client")
const socket = io("https://chessterm.tech:8512")  // 服务器地址

socket.on("connect", () => {
  socket.emit("login", socket.id, {
    backend: "https://chessterm.tech",  // 网站地址，虽然值固定，但必须传入
    userId: "10170",  // 棋盘码
    gameId: "1000"  // Game ID
  })
})

socket.on("login_result", (data) => {
  // 登录成功时触发
  console.log(data)
  // data 含有 user, game 和 board 三个元素，
  // 建议自行尝试调用一次来查看具体有哪些参数
})

socket.on("login_fail", (msg) => {
  // 登录失败时触发
  // msg 为失败原因
})

socket.on("update_chesspos", (chesspos) => {
  // 其它客户端更新棋盘时触发
  // chesspos 为更新后的棋盘状态
})

// 自己要更新棋盘时执行此方法
socket.emit("update_board", socket.id, {
    chesspos: chesspos  // 更新后的棋盘状态
})
```

#### Python 实现

可以参考[这个网页](https://python-socketio.readthedocs.io/en/latest/client.html)，但兼容性未经验证。
