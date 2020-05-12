import $ = require("jquery");

import {IDisposable, Terminal} from "xterm";
import {cursorTo} from "ansi-escapes";
import ClickEvent = JQuery.ClickEvent;

let positions: Array<string> = []

let termObj: Terminal
let screen: JQuery<HTMLElement>

function moveHandler(event: JQuery.MouseMoveEvent) {
  const eleWidth = screen.width()
  const eleHeight = screen.height()

  const termWidth = termObj.cols
  const termHeight = termObj.rows

  const cursorX = Math.floor(event.clientX / eleWidth * termWidth)
  const cursorY = Math.floor(event.clientY / eleHeight * termHeight)

  if (positions.indexOf(`${cursorX}-${cursorY}`) !== -1)
    termObj.write(cursorTo(cursorX, cursorY))
}

function clickHandler(event: ClickEvent) {
  let keyboardEvent = new KeyboardEvent("keypress", {
    key: event.button === 2 ? "X" : "Space",
    // @ts-ignore
    charCode: event.button === 2 ? 120 : 32
  })

  $(termObj.element).find("textarea")[0].dispatchEvent(keyboardEvent)
}

export function mouseCursor(term: Terminal, newPositions) {
  termObj = term
  screen = $(term.element).find(".xterm-screen")

  if (newPositions) {
    positions = []

    for (let y in newPositions) {
      for (let x in newPositions) {
        positions.push(newPositions[y][x].join("-"))
      }
    }
  }

  screen.on("mousemove", moveHandler)
  screen.on("click", clickHandler)
}
