import {Chess, chessBinds} from "./classes";

export function loadChesspos(chesspos: string, length: number) {
  let result: {[position: string]: Chess} = {}

  for (let row = 0; row * length < chesspos.length; row ++) {
    for (let col = 0; col < length; col ++) {

      result[`${col}-${row}`] = chessBinds[chesspos[row * length + col] || null] || Chess.None
    }
  }

  return result
}

export function generateChesspos(boardStatus) {
  let chesspos = ""

  for (let y in boardStatus) {
    for (let x in boardStatus[y]) {

      let status: Chess = boardStatus[y][x]
      if (status == Chess.Unavailable) status = Chess.None
      for (let key in chessBinds) {
        if (chessBinds[key] == status) chesspos += key
      }
    }
  }

  return chesspos
}
