import $ = require("jquery")

import {Chess, Params, chessBinds} from "../chessterm/classes"
import {Available, getAvailable} from "../chessterm/boardrects"

let eles: {[col: number]: {[row: number]: Iterable<HTMLElement>}} = {}
let boardStatus: {[col: number]: {[row: number]: Chess}} = {}
let available: Available = []

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
  console.log(boardEle)
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

  resultLengthEach = Math.round(resultLengthEach)

  boardEle.find("td").each((i, ele) => {
    $(ele).css("height", resultLengthEach + "px")
          .css("width", resultLengthEach + "px")
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

export function drawBoard(params: Params) {
  const boardEle = $("#board")

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
        colEle.addClass("data-available")
              .attr("data-row", row)
              .attr("data-col", col)

        if (!eles[col]) eles[col] = {}
        if (!boardStatus[col]) boardStatus[col] = {}

        if (hasBoardrects) {
          if (isAvailable(col, row)) {
            boardStatus[col][row] = Chess.None
          } else {
            boardStatus[col][row] = Chess.Unavailable
            colEle.removeClass("data-available")
                  .addClass("data-unavailable")
          }
        } else {
          available.push([col, row]);
          boardStatus[col][row] = Chess.None
        }

        eles[col][row] = colEle
      }

      rowEle.append(colEle)
    }

    boardEle.append(rowEle)
  }

  if (params.game.rectpaper) initRectPaper(params.game.rectpaper)

  fit()
}
