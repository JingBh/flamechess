const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const axios = require("axios");

let _sessions = {};

app.get("/", function (req, res) {
    res.type("text/plain").send("Hello, world!");
});

app.post("/update_board", function (req, res) {
    console.log(req.body);
    if (req.body.id && req.body.chesspos) {
        console.log(`Board ${req.body.id} updated.`);
        io.to("board_" + req.body.id).emit("update_chesspos", req.body.chesspos);
    }
    res.send();
});

io.on("connection", function (socket) {
    console.log("A user connected.");

    socket.on("login", function(clientId, data) {
        console.info(`Client ${clientId} is trying to login with ${data.userId} at ${data.backend}.`);

        if (data.backend && data.gameId && data.userId) {
            // Query board info.
            axios.get(`${data.backend}/user/getBoard`, {
                params: {
                    "id": data.userId,
                    "game": data.gameId
                }
            }).then(function(response) {
                if (response.data.success) {
                    let loginResult = response.data.data;
                    _sessions[clientId] = loginResult;
                    _sessions[clientId].backend = data.backend;
                    socket.join("board_" + loginResult.board.id);
                    socket.emit("login_result", loginResult);
                } else if (response.data.message) {
                    socket.emit("login_fail", "登录失败：" + response.data.message);
                } else {
                    console.error(response.data);
                    socket.emit("login_fail", "登录失败，服务器发生错误。");
                }

            }).catch(function(error) {
                console.error(error);
                socket.emit("login_fail", "登录失败，服务器发生错误。");
            });

        } else socket.emit("login_fail", "登录失败，参数不合法。");

    });

    socket.on("update_board", function(clientId, data) {
        if (_sessions[clientId]) {
            let session = _sessions[clientId];
            console.log(`Client ${clientId} is trying to update board ${session.board.id}`);

            data.socket = false;
            axios.patch(`${session.backend}/boards/${session.board.id}`, data)
                .catch(function(error) {
                    console.error(error);
                })
                .finally(function() {
                    if (data.chesspos) session.board.chesspos = data.chesspos;
                    if (data.clock) session.board.clock = data.clock;
                    _sessions[clientId].board = session.board;
                    io.to("board_" + session.board.id).emit("update_chesspos", session.board.chesspos);
                });
        }
    });
});

http.listen(11512, function () {
    console.log('Listening on 0.0.0.0:11512');
});
