import {Chess, Side} from "../chessterm/classes";
import {loadChesspos} from "../chessterm/loadChesspos";

/*
const lines = [
  ["1-1", "2-1", "3-1"],  // 第一行横线
  ["1-3", "2-3", "3-3"],  // 第三行横线
  ["1-1", "1-2", "1-3"],  // 左侧竖线
  ["3-1", "3-2", "3-3"],  // 右侧竖线
  ["2-1", "1-2"],  // 左上斜线
  ["1-2", "2-3"],  // 坐下斜线
  ["2-1", "3-2"],  // 右上斜线
  ["3-2", "2-3"],  // 右下斜线
]
*/

module.exports = (chesspos: string, oldChesspos: string, winCallback) => {
  const length = 5
  let status = loadChesspos(chesspos, length)

  let chessXCount = 0, chessOCount = 0

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

      } else if (thisStatus === Chess.X) {
        chessXCount ++
      } else if (thisStatus === Chess.O) {
        chessOCount ++
      }
    }
  }

  if (chessXCount <= 1) {
    winCallback("蓝方获胜，游戏结束。")
  } else if (chessOCount <= 1) {
    winCallback("黄方获胜，游戏结束。")
  }

  return chesspos
}
