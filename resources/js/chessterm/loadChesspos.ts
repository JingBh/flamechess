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
