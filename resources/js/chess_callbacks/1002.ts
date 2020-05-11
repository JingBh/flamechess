import {Chess, chessBinds} from "../chessterm/classes";

function loadChesspos(chesspos: string, length: number) {
  let result: {[position: string]:  Chess} = {}

  for (let row = 0; row * length < chesspos.length; row ++) {
    for (let col = 0; col < length; col ++) {

      result[`${col}-${row}`] = chessBinds[chesspos[row * length + col] || null] || Chess.None
    }
  }

  return result
}

module.exports = (chesspos: string) => {
  const length = 5
  let status = loadChesspos(chesspos, length)

  for (let i in status) {
    let col: number, row: number
    [col, row] = i.split("-").map(Number)

    let thisStatus: Chess = status[i]

    if (thisStatus === Chess.X || thisStatus === Chess.O) {
      let otherChess
      if (thisStatus === Chess.X) {
        otherChess = Chess.O
      } else if (thisStatus === Chess.O) otherChess = Chess.X

      let surrounds = {
        down: status[`${col}-${row + 1}`],
        up: status[`${col}-${row - 1}`],
        right: status[`${col + 1}-${row}`],
        left: status[`${col - 1}-${row}`],
      }

      let sameRow = surrounds.left === otherChess || surrounds.right === otherChess
      let sameCol = surrounds.up === otherChess || surrounds.down === otherChess

      if (sameRow && sameCol) {
        let replaceIndex: number = row * length + col
        chesspos = chesspos.substring(0, replaceIndex) + "0" + chesspos.substring(replaceIndex + 1)
        console.log(row, col, replaceIndex, chesspos)
      }
    }
  }

  return chesspos
}
