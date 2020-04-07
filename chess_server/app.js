const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const axios = require("axios");

let _sessions = {};

app.get("/", function (req, res) {
    res.type("text/plain").send("Hello, world!");
});

io.on("connection", function (socket) {
    console.log("[INFO] A user connected.");

    socket.on("login", function(clientId, data) {
        console.info(`"Client ${clientId} is trying to login with ${data.userId} at ${data.backend}."`);

        if (data.backend && data.gameId && data.userId) {
            let boardId = String(data.gameId) + String(data.userId);

            // Query game info.
            axios.get(`${data.backend}/games/${data.gameId}`)
                .then(function(response) {
                    if (response.data && typeof response.data == "object" &&
                        response.data.row && response.data.column) {
                        let gameInfo = response.data;

                        // Query board info.
                        axios.get(`${data.backend}/boards/${boardId}?json=true`)
                            .then(function(response) {
                                if (response.data && typeof response.data == "object" &&
                                    response.data.success === true && response.data.data) {

                                    // Return result to client.
                                    let loginResult = {
                                        board: response.data.data,
                                        game: gameInfo
                                    };
                                    _sessions[clientId] = loginResult;
                                    socket.emit("login_result", loginResult);
                                } else socket.emit("login_fail", "登录失败，指定的棋盘码不存在或服务器发生错误。");
                            }).catch(function() {
                                socket.emit("login_fail", "登录失败，服务器发生错误。");
                            });
                    } else socket.emit("login_fail", "登录失败，指定的 gameId 不存在或服务器发生错误。");
                }).catch(function() {
                    socket.emit("login_fail", "登录失败，服务器发生错误。");
                });
        } else socket.emit("login_fail", "登录失败，参数不合法。");
    });
});

http.listen(11512, function () {
    console.log('Listening on 0.0.0.0:11512');
});
