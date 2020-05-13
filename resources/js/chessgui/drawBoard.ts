import $ = require("jquery");
import {Chess, chessBinds, Params, Side} from "../chessterm/classes"
import {Available, getAvailable} from "../chessterm/boardrects"
import {generateChesspos} from "../chessterm/loadChesspos";

let eles: {[col: number]: {[row: number]: JQuery<HTMLElement>}} = {}
let boardStatus: {[row: number]: {[col: number]: Chess}} = {}
let available: Available = []
let pickedUp: boolean = false
let pickedUpOn: number
let pickedUpEle: JQuery<HTMLElement>|HTMLElement
let pickedUpStatus: Chess
let callbacks: {[event: string]: (data) => any} = {}
let ruleCallback
let lastChesspos: string
let side: Side

function isAvailable(col: number, row: number): boolean {
  for (let item of available) {
    if (item[0] === col && item[1] === row) return true
  }

  return false
}

function parseLength(length): number {
  if (typeof length == "object" && length[1]
    && length[0] && typeof length[0] == "number") {

    if (length[1] === "%") {

      const height = window.innerHeight * length[0] * 0.01
      const width = window.innerWidth * length[0] * 0.01

      return Math.min(height, width)

    } else return length[0]

  } else return length
}

function initRectPaper(rectpaper: string) {
  $("#rectpaper").remove()
  let ele = $('<img id="rectpaper" src="" />')

  const cut = rectpaper.split("#")
  let placeX = 0, placeY = 0, width, height, url

  if (cut.length == 5) {
    placeX = Number(cut.slice(-4, -3)[0])
    placeY = Number(cut.slice(-3, -2)[0])
    width = Number(cut.slice(-2, -1)[0])
    height = Number(cut.slice(-1)[0])

    url = cut.slice(0, -4).join("#")
  } else url = cut.join("#")

  ele.attr("src", url)
     .attr("data-place-x", placeX)
     .attr("data-place-y", placeY)
     .attr("data-width", width)
     .attr("data-height", height)

  $("#container").append(ele)
  $("#table").addClass("td-no-border")
}

export function fit() {
  const boardEle = $("#board")
  const rectpaperEle = $("#rectpaper")

  const trCount = boardEle.children("tr").length
  const tdCount = $(boardEle.children("tr")[0]).children("td").length

  let resultLengthEach

  const minEach = parseLength([25, "px"])
  const maxEach = parseLength([100, "px"])
  const maxAll = parseLength([85, "%"])

  const maxAsMinEach = Math.max(minEach * tdCount, minEach * trCount)
  if (maxAsMinEach > maxAll) {
    resultLengthEach = minEach
  } else {
    resultLengthEach = maxAll / Math.max(trCount, tdCount)
    if (resultLengthEach > maxEach) resultLengthEach = maxEach
  }

  let resultLengthRound = Math.round(resultLengthEach)

  boardEle.find("td").each((i, ele) => {
    $(ele).css("height", resultLengthRound + "px")
          .css("width", resultLengthRound + "px")
  })

  if (rectpaperEle.length > 0) {
    const boardOffset = boardEle.offset()

    const rectpaperPlaceX: number =
      Number(rectpaperEle.attr("data-place-x")) || 0

    const rectpaperPlaceY: number =
      Number(rectpaperEle.attr("data-place-y")) || 0

    const rectpaperWidth: number =
      Number(rectpaperEle.attr("data-width")) ||
      tdCount - rectpaperPlaceX - 1

    const rectpaperHeight: number =
      Number(rectpaperEle.attr("data-height")) ||
      trCount - rectpaperPlaceY - 1

    rectpaperEle
      .css("left", (boardOffset.left + (rectpaperPlaceX + 1) * resultLengthEach) + "px")
      .css("top", (boardOffset.top + (rectpaperPlaceY + 1) * resultLengthEach) + "px")
      .css("width", (rectpaperWidth * resultLengthEach) + "px")
      .css("height", (rectpaperHeight * resultLengthEach) + "px")
  }
}

function setEleStatus(ele: JQuery<HTMLElement>|HTMLElement, status: Chess) {
  ele = $(ele)
  if (!ele) return

  ele.empty()

  const col = Number(ele.attr("data-col")),
        row = Number(ele.attr("data-row"))

  if (!boardStatus[row]) boardStatus[row] = {}

  if (boardStatus[row][col]) {

    if (boardStatus[row][col] !== Chess.Unavailable) {
      boardStatus[row][col] = status

      let imageEle = $('<img class="data-chess" src="" />')
      let color

      switch (status) {
        case Chess.X:
          color = "yellow"
          break
        case Chess.O:
          color = "blue"
          break
        default:
          return
      }

      let imageUrl = `/images/flamechess/${color}_zu.png`
      imageEle.attr("src", imageUrl)

      if (side === Side.Both ||
        (status === Chess.X && side === Side.X) ||
        (status === Chess.O && side === Side.O)) {
        ele.addClass("pickable")
      } else ele.removeClass("pickable")

      ele.append(imageEle)
    }
  }
}

export function setAllPosition(chesspos: string) {
  if (!chesspos) return

  if (ruleCallback) chesspos = ruleCallback(chesspos, lastChesspos);

  lastChesspos = chesspos

  $("#board .data-position").each((i, ele) => {
    let status: Chess = chessBinds[chesspos[i] || null] || Chess.None
    setEleStatus(ele, status)
  })
}

export function uploadAllPosition() {
  if (callbacks.update_board) {

    let chesspos = generateChesspos(boardStatus)

    if (ruleCallback) chesspos = ruleCallback(chesspos, lastChesspos)

    callbacks.update_board(chesspos)

    lastChesspos = chesspos
  }
}

function getEleFromEventTarget(target: HTMLElement): JQuery<HTMLElement>|null {
  let ele = $(target)
  if (ele && ele.parents("#board").length > 0
    && (!ele.hasClass("data-unavailable"))) {
      if (ele.hasClass("data-available")) {
        return ele
      } else {
        ele = ele.parents(".data-available")
        if (ele.length > 0) return ele
      }
  }
}

function putDownHandler(event: JQuery.ClickEvent) {
  if (pickedUp) {

    if (pickedUpOn && pickedUpOn + 50 > new Date().getTime()) return

    let ele = getEleFromEventTarget(event.target)

    if (ele && ele.length > 0) {
      const newCol = Number(ele.attr("data-col"))
      const newRow = Number(ele.attr("data-row"))
      const eleStatus: Chess = (boardStatus[newRow] || {})[newCol] || Chess.None

      if (eleStatus === Chess.None) {

        if (pickedUpEle) setEleStatus(pickedUpEle, Chess.None)
        setEleStatus(ele, pickedUpStatus)

        uploadAllPosition()
      } else if (!ele.is(pickedUpEle)) return

    } else {

      setEleStatus(pickedUpEle, Chess.None)
      uploadAllPosition()
    }

    $("#pickedUpFollow, .data-chess-pre").remove()
    $(".picked-up").removeClass("picked-up")
    pickedUp = false
  }
}

function mouseMoveHandler(event: JQuery.MouseMoveEvent) {
  if (pickedUp) {
    let ele = $("#pickedUpFollow")

    if (ele.length <= 0) {
      ele = $('<img src="" id="pickedUpFollow" />')

      let originalEle = $(".picked-up img.data-chess")
      if (originalEle.length <= 0) return

      ele.attr("src", originalEle.attr("src"))
      ele.css("width", originalEle.width())
      ele.css("height", originalEle.height())

      $("body").append(ele)
    }

    ele.css("left", event.clientX - ele.width() / 2)
    ele.css("top", event.clientY - ele.height() / 2)

    let target = getEleFromEventTarget(event.target)
    if (target && target.length > 0
      && (!target.hasClass("picked-up"))
      && target.find(".data-chess").length <= 0) {

      let preEle = target.find(".data-chess-pre")

      if (preEle.length <= 0) {
        $(".data-chess-pre").remove()

        preEle = $('<img class="data-chess-pre" src="" />')
        preEle.attr("src", ele.attr("src"))
        preEle.css("width", ele.width())
        preEle.css("height", ele.height())

        target.append(preEle)
      }
    } else $(".data-chess-pre").remove()
  }
}

function pickup(col?: number, row?: number, status?: Chess) {
  if (pickedUp) return

  if (typeof col !== "number") col = -1
  if (typeof row !== "number") row = -1

  let currentStatus = status || (boardStatus[row] || {})[col] || null
  if (!currentStatus) return

  let currentEle = (eles[col] || {})[row] || null
  if (currentEle) {
    currentEle = $(currentEle)
    currentEle.addClass("picked-up")

    pickedUpEle = currentEle
  }

  pickedUpOn = new Date().getTime()
  pickedUpStatus = currentStatus
  pickedUp = true
}

export function drawBoard(params: Params) {
  const boardEle = $("#board")
  boardEle.empty()

  side = params.side

  callbacks = params.callbacks
  if ((callbacks.rules || {})[Number(params.game.id)])
    ruleCallback = callbacks.rules[Number(params.game.id)]

  // Parse boardrects
  const boardrects = params.game.boardrects
  if (boardrects) available = getAvailable(boardrects, params.game.column, params.game.row)
  const hasBoardrects = (available || []).length > 0
  console.log(available)

  for (let row = -1; row < params.game.row; row ++) {

    const rowEle = $('<tr></tr>')

    for (let col = -1; col <= params.game.column; col ++) {

      const colEle = $('<td></td>')

      if (row === -1 && col !== -1 && col !== params.game.column)
        colEle.text(String.fromCharCode(65 + col))

      if (col === -1 && row !== -1)
        colEle.text(row + 1)

      if (row !== -1 && col !== -1 && col !== params.game.column) {
        colEle.addClass("data-available data-position")
              .attr("data-row", row)
              .attr("data-col", col)

        if (!eles[col]) eles[col] = {}
        if (!boardStatus[row]) boardStatus[row] = {}

        if (hasBoardrects) {
          if (isAvailable(col, row)) {
            boardStatus[row][col] = Chess.None
          } else {
            boardStatus[row][col] = Chess.Unavailable
            colEle.removeClass("data-available")
                  .addClass("data-unavailable")
          }
        } else {
          available.push([col, row]);
          boardStatus[row][col] = Chess.None
        }

        eles[col][row] = colEle

        colEle.on("click", (event) => {
          const ele = $(event.currentTarget)

          const col = Number(ele.attr("data-col"))
          const row = Number(ele.attr("data-row"))
          const status: Chess = (boardStatus[row] || {})[col] || Chess.None

          if (ele.hasClass("pickable")) pickup(col, row, status)

        }).on("contextmenu", (event: JQuery.ContextMenuEvent) => {
          event.preventDefault()

          /*
          const ele = $(event.currentTarget)

          const col = Number(ele.attr("data-col"))
          const row = Number(ele.attr("data-row"))
          const status: Chess = (boardStatus[row] || {})[col] || Chess.None

          TODO: Custom ContextMenu
          */
        })
      }

      rowEle.append(colEle)
    }

    boardEle.append(rowEle)
  }

  if (params.game.rectpaper) initRectPaper(params.game.rectpaper)

  fit()

  setAllPosition(params.board.chesspos)

  $(window)
    .off("mousemove", mouseMoveHandler)
    .on("mousemove", mouseMoveHandler)
    .off("click", putDownHandler)
    .on("click", putDownHandler)
}
