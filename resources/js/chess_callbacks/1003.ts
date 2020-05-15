import {Chess} from "../chessterm/classes";
import {loadChesspos} from "../chessterm/loadChesspos";

const lines: Array<Array<string>> = [
  // Format: x-y
  ["1-1", "2-1", "3-1"],  // 第二行横线
  ["1-3", "2-3", "3-3"],  // 第四行横线
  ["0-4", "2-4", "4-4"],  // 第五行横线
  ["2-0", "2-1", "2-2", "2-3", "2-4"],  // 竖线
  ["1-1", "2-2", "3-3", "4-4"],  // 左上->右下斜线
  ["3-1", "2-2", "1-3", "0-4"],  // 右上->左下斜线
  ["2-0", "1-1"],  // 左上角斜线
  ["2-0", "3-1"],  // 右上角斜线
]

module.exports = (chesspos: string, lastChesspos: string, winCallback) => {
  if (chesspos && lastChesspos && chesspos != lastChesspos) {

    const length = 5
    let status = loadChesspos(chesspos, length)
    let lastStatus = loadChesspos(lastChesspos, length)

    let lastPosition: string, nowPosition: string

    let deerCount: number = 0
    let unmoveAble: boolean = true

    for (let i in lastStatus) {
      if (lastStatus[i] === Chess.X) lastPosition = i
    }

    for (let i in status) {
      if (status[i] === Chess.X) {
        nowPosition = i
        deerCount ++
        if (deerCount > 1) return lastChesspos
      }
    }

    if (lastPosition && nowPosition) for (let line of lines) {

      let lastPositionIndex: number = line.indexOf(lastPosition)
      let nowPositionIndex: number = line.indexOf(nowPosition)

      if (lastPositionIndex !== -1 && nowPositionIndex !== -1) {

        let moveDistance = nowPositionIndex - lastPositionIndex
        let moveDirection = moveDistance < 0 ? -1 : 1

        if (Math.abs(moveDistance) === 2) {
          let wolfIndex = lastPositionIndex + moveDirection

          if (line[wolfIndex] && status[line[wolfIndex]] === Chess.O) {

            let col: number, row: number
            [col, row] = line[wolfIndex].split("-").map(Number)
            let replaceIndex: number = row * length + col

            chesspos = chesspos.substring(0, replaceIndex) + "0" + chesspos.substring(replaceIndex + 1)
            status[line[wolfIndex]] = Chess.None
            console.log(row, col, replaceIndex, chesspos)
          }
        }
      }

      if (nowPositionIndex !== -1) {
        let moveAbleBackward = line[nowPositionIndex - 1] ? status[line[nowPositionIndex - 1]] === Chess.None : false
        let moveAbleJumpBackward = line[nowPositionIndex - 2] ? status[line[nowPositionIndex - 2]] === Chess.None : false
        let moveAbleForward = line[nowPositionIndex + 1] ? status[line[nowPositionIndex + 1]] === Chess.None : false
        let moveAbleJumpForward = line[nowPositionIndex + 2] ? status[line[nowPositionIndex + 2]] === Chess.None : false

        unmoveAble = unmoveAble && (!(moveAbleBackward || moveAbleForward || moveAbleJumpBackward || moveAbleJumpForward))
      }
    } else unmoveAble = false

    if (unmoveAble) winCallback("鹿方失败，游戏结束。")
  }

  return chesspos
}
