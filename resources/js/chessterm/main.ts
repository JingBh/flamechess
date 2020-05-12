import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import {eraseScreen, cursorLeft, cursorTo} from "ansi-escapes";
import {parse} from "qs";

const capitalize = require("lodash/capitalize");
const io = require("socket.io-client");

import {drawBoard, setAllPosition} from "./drawBoard";
import {Side, Params, loginResult} from "./classes";
import {listenSendMessage, recievedMessage, timing} from "../chesstalk/main";

export const SERVER = document.querySelector("meta[name='data-server']").getAttribute("content");

export const BACKEND = document.querySelector("meta[name='data-backend']").getAttribute("content");

function clearScreen(term: Terminal) {
  term.write(eraseScreen + cursorTo(1, 1));
}

const term = new Terminal({});
const socket = io(SERVER);
console.log(socket);

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById("terminal"));
fitAddon.fit();
window.addEventListener("resize", function() {
  fitAddon.fit();
});

const paramsRaw = parse(location.search.substring(1));
let params: Params = {
  callbacks: {
  rules: require("../chess_callbacks/main")
  }
};

socket.on("connect", function() {
  clearScreen(term);
  term.write("Logging in, please wait...");
  let userId = paramsRaw.id;
  let gameId = paramsRaw.game;
  if (!userId) {
    clearScreen(term);
    term.write("\x1b[1;31mError: 请先登录。\x1b[0;37m");
    return;
  } else {
    socket.emit("login", {
      backend: BACKEND,
      userId: userId,
      gameId: gameId
    });
  }
});

socket.on("login_result", function(data: loginResult) {
  console.info(data);
  params.board = data.board;
  params.game = data.game;

  let side = capitalize(paramsRaw.side);
  params.side = side in Side ? side : Side.None;

  term.write(eraseScreen + cursorLeft);
  drawBoard(term, params);
});

socket.on("login_fail", function(msg?: string) {
  clearScreen(term);
  term.write(`\x1b[1;31mError: ${msg || "登录失败。"}\x1b[0;37m`);
  term.write(cursorTo(1, 2));
  term.write("请检查 id 和 game 参数是否正确。");
});

socket.on("update_chesspos", function(chesspos?: string) {
  console.log(chesspos);
  if (chesspos) setAllPosition(term, chesspos);
});

params.callbacks.update_board = function(chesspos?: string) {
  socket.emit("update_board", {
    chesspos: chesspos
  });
};

socket.on("chat", recievedMessage)

listenSendMessage((message) => {
  socket.emit("chat", message)
})

timing()
