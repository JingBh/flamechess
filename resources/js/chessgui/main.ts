import $ = require("jquery")
import {parse} from "qs"

const capitalize = require("lodash/capitalize")
const io = require("socket.io-client")
require("bootstrap/js/src/index")

import {drawBoard, fit} from "./drawBoard"
import {loginResult, Params, Side} from "../chessterm/classes"

export const SERVER = document.querySelector("meta[name='data-server']").getAttribute("content")
export const BACKEND = document.querySelector("meta[name='data-backend']").getAttribute("content")

const socket = io(SERVER)
console.log(socket)

const paramsRaw = parse(location.search.substring(1))
let params: Params = {callbacks: {}}

socket.on("connect", () => {
  console.log("Logging in, please wait...")
  let userId = paramsRaw.id
  let gameId = paramsRaw.game
  if (!userId) {
    console.error("请先登录。")
    return
  } else socket.emit("login", {
    backend: BACKEND,
    userId: userId,
    gameId: gameId
  })
})

socket.on("login_result", (data: loginResult) => {
  console.info(data)
  params.board = data.board
  params.game = data.game

  let side = capitalize(paramsRaw.side)
  params.side = side in Side ? side : Side.None

  $("#loading").hide()
  drawBoard(params)
})

socket.on("login_fail", (msg?: string) => {
  console.error(`${msg || "登录失败。"}`)
  console.log("请检查 id 和 game 参数是否正确。")
})

socket.on("update_chesspos", (chesspos?: string) => {
  console.log(chesspos)
  // if (chesspos) setAllPosition(chesspos)
})

params.callbacks.update_board = (chesspos?: string) => {
  socket.emit("update_board", {
    chesspos: chesspos
  })
}

$(window).on("resize", () => fit())
