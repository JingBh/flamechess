import {Chess} from "../chessterm/classes";
import {loadChesspos} from "../chessterm/loadChesspos";

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
