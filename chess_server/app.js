const fs = require("fs")
const pathlib = require("path")
const child_process = require("child_process")

const express = require("express")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const http = require("http").createServer(app)
const io = require("socket.io")(http)

const axios = require("axios")

let _sessions = {}
let _bots = {}

app.get("/", (req, res) => {
  res.type("text/plain").send("Hello, world!")
})

app.post("/update_board", (req, res) => {
  console.log(req.body)

  if (req.body.id && req.body.chesspos) {
    console.log(`Board ${req.body.id} updated.`)
    io.to("board_" + req.body.id).emit("update_chesspos", req.body.chesspos)
  }

  res.send()
})

io.on("connection", (socket) => {
  console.log("A user connected.")

  socket.on("login", (data) => {

    console.info(`Client ${socket.id} is trying to login with ${data.userId} at ${data.backend}.`)

    if (data.backend && data.gameId && data.userId) {
      // Query board info.

      axios.get(`${data.backend}/user/getBoard`, {
        params: {
          "id": data.userId,
          "game": data.gameId
        }
      }).then((response) => {

        if (response.data.success) {

          let loginResult = response.data.data

          _sessions[socket.id] = loginResult
          _sessions[socket.id].backend = data.backend

          socket.join("board_" + loginResult.board.id)
          socket.emit("login_result", loginResult)

        } else if (response.data.message) {

          socket.emit("login_fail", "登录失败：" + response.data.message)
        } else {

          console.error(response.data)

          socket.emit("login_fail", "登录失败，服务器发生错误。")
        }

      }).catch(function(error) {

        console.error(error)

        socket.emit("login_fail", "登录失败，服务器发生错误。")
      })

    } else socket.emit("login_fail", "登录失败，参数不合法。")

  })

  socket.on("update_board", (data) => {
    if (_sessions[socket.id]) {
      let session = _sessions[socket.id]

      console.log(`Client ${socket.id} is trying to update board ${session.board.id}`)

      data.socket = "false"

      axios.patch(`${session.backend}/boards/${session.board.id}`, data)
        .catch(function(error) {
          console.error(error)
        })
        .finally(function() {

          if (data.chesspos) session.board.chesspos = data.chesspos
          if (data.clock) session.board.clock = data.clock

          _sessions[socket.id].board = session.board

          io.to("board_" + session.board.id).emit("update_chesspos", session.board.chesspos)
        })
    }
  })

  socket.on("chat", (message) => {
    if (_sessions[socket.id]) {
      let session = _sessions[socket.id]

      console.log(`Client ${socket.id} said ${message}.`)

      let time = new Date().getTime()

      io.to("board_" + session.board.id).emit("chat", {
        id: "用户 " + socket.id.substring(0, 5),
        message: message,
        time: time
      })
    }
  })

  socket.on("start_bot", () => {
    if (_sessions[socket.id]) {
      let session = _sessions[socket.id]
      let board = session.board.id

      console.log(`Client ${socket.id} is trying to start a bot for ${session.game.id}.`)

      if (_bots[board]) _bots[board].kill()

      let command, cwd, args, env

      switch (session.game.id) {

        case 1002:
        case 1003:
          // luqi.py
          let path = fs.realpathSync(__dirname + "/../bots/luqi/src/main.py")
          command = "python3"
          args = [ path ]
          cwd = pathlib.dirname(path)
          env = {
            "CHESS_TYPE": session.game.id === 1002 ? "zhuobie" : "luqi",
            "CHESS_CODE": session.user.id
          }
          break
      }

      _bots[board] = child_process.spawn(command, args, {
        cwd: cwd || pathlib.dirname(__dirname + "/../bots"),
        env: env || {},
        stdio: ["ignore", "ignore", process.stderr],
        timeout: 600,
        windowsHide: true
      })
    }
  })

  socket.on("disconnect", () => {
    if (_sessions[socket.id]) {
      let board = _sessions[socket.id].board.id
      if (_bots[board]) _bots[board].kill()
      _sessions[socket.id] = undefined
    }
  })
})

http.listen(11512, () => {
  console.log('Listening on 0.0.0.0:11512')
})
