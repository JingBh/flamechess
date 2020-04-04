import {Terminal} from "xterm";
import {cursorTo} from "ansi-escapes";

const padStart = require("lodash/padStart");

import {Params, VERSION} from "./main";

export enum Side {
    None = "None",
    X = "X",
    O = "O",
    Both = "Both"
}

export enum Chess {
    None = "-",
    X = "X",
    O = "O"
}

let positions: {[key: number]: {[key: number]: Array<number>}} = {};
let boardStatus: {[key: number]: {[key: number]: Chess}} = {};

export function cursorToPosition(term: Terminal, x: number, y: number) {
    // x: column
    // y: row

    const position = (positions[y] || {})[x] || null;
    if (position) term.write(cursorTo(position[0], position[1]));
}

export function getPositionByCursor(x: number, y: number): Array<number> {
    // x and y is cursor position

    for (let yi in positions) {
        // yi: row

        for (let xi in positions) {
            // xi: column

            let position = positions[yi][xi];
            if (position[0] === x && position[1] === y)
                return [Number(xi), Number(yi)];
        }
    }

    return null;
}

export function getStatusByPosition(x: number, y: number): Chess {
    // x: column
    // y: row

    const status = (boardStatus[y] || {})[x] || null;
    return Chess[status] || Chess.None;
}

export function setStatusByPosition(term: Terminal, x: number, y: number, status: Chess) {
    // x: column
    // y: row

    if ((boardStatus[y] || {})[x]) {
        boardStatus[y][x] = status;
        cursorToPosition(term, x, y);
        term.write(status);
    }
}

function pickup(term: Terminal, currentStatus: Chess, currentPosition: Array<number>, infoX: number, infoY: number) {

}

export function drawBoard(term: Terminal, x: number, y: number, params: Params) {
    // x: Number of columns
    // y: Number of rows

    for (let yi = 0; yi < y; yi ++) {
        positions[yi] = {};
        boardStatus[yi] = {};
        for (let xi = 0; xi < x; xi ++) {
            if (yi == 0) {
                term.write(cursorTo(9 + xi * 2, 2));
                term.write(String.fromCharCode(65 + xi));
            }

            if (xi == 0) {
                term.write(cursorTo(4, 4 + yi));
                let lineNumber = padStart(yi + 1, 2);
                term.write(lineNumber);
            }

            positions[yi][xi] = [9 + xi * 2, 4 + yi];
            boardStatus[yi][xi] = Chess.None;
            cursorToPosition(term, xi, yi);  // Move the cursor
            term.write(Chess.None);
        }
    }

    const infoStartX = 20 + x * 2;
    const infoStartY = 4;
    term.write(cursorTo(infoStartX, infoStartY));
    term.write(`ChessTerm v${VERSION}`);
    term.write(cursorTo(infoStartX, infoStartY + 1));
    term.write("Developed by JingBh");
    term.write(cursorTo(infoStartX, infoStartY + 3));
    term.write(`User ID: ${params.userId}`);
    term.write(cursorTo(infoStartX, infoStartY + 4));
    term.write(`Game ID: ${params.gameId}`);
    term.write(cursorTo(infoStartX, infoStartY + 5));
    term.write(`Side: ${params.side}`);

    const howtoStartX = 4;
    const howtoStartY = 6 + y;
    term.write(cursorTo(howtoStartX, howtoStartY));
    term.write("如何使用：");
    term.write(cursorTo(howtoStartX, howtoStartY + 1));
    term.write("1. 使用键盘上的方向键控制光标");
    if (params.side != Side.None) {
        term.write(cursorTo(howtoStartX, howtoStartY + 2));
        term.write("2. 在空白格按下<Enter>或<Space>来放置棋子");
        term.write(cursorTo(howtoStartX, howtoStartY + 3));
        if (params.side != Side.Both) {
            term.write("3. 在非空白格按下<Enter>或<Space>可以拿起棋子");
            term.write(cursorTo(howtoStartX, howtoStartY + 4));
            term.write("4. 拿起棋子时，在空白格按下<Enter>或<Space>可以");
            term.write(cursorTo(howtoStartX + 3, howtoStartY + 5));
            term.write("重新放下，按下<Esc>或<X>可以删除该棋子");
        } else term.write("3. 在非空白格按下<Enter>或<Space>可以切换棋子");
    }

    cursorToPosition(term, 0, 0);

    term.onKey(function(event) {
        console.log(event.domEvent.key);

        const cursorX = term.buffer.cursorX;
        const cursorY = term.buffer.cursorY;
        const currentPosition = getPositionByCursor(cursorX, cursorY);
        const currentStatus = getStatusByPosition(currentPosition[0], currentPosition[1]);

        if (currentPosition) {
            let targetPosition = currentPosition;
            let targetStatus: Chess;
            switch (event.domEvent.key) {
                case "ArrowUp":
                case "Up":
                    targetPosition[1] -= 1;
                    if (targetPosition[1] < 0) targetPosition[1] = 0;
                    break;
                case "ArrowDown":
                case "Down":
                    targetPosition[1] += 1;
                    if (targetPosition[1] > y) targetPosition[1] = y;
                    break;
                case "ArrowLeft":
                case "Left":
                    targetPosition[0] -= 1;
                    if (targetPosition[0] < 0) targetPosition[0] = 0;
                    break;
                case "ArrowRight":
                case "Right":
                    targetPosition[0] += 1;
                    if (targetPosition[0] > x) targetPosition[0] = x;
                    break;
                case " ":
                case "Spacebar":
                case "Enter":
                    switch (params.side) {
                        case Side.X:
                            if (currentStatus == Chess.X) {
                                pickup(term, currentStatus, currentPosition, infoStartX, infoStartY + 7);
                            } else if (currentStatus == Chess.None) targetStatus = Chess.X;
                            break;
                        case Side.O:
                            if (currentStatus == Chess.O) {
                                pickup(term, currentStatus, currentPosition, infoStartX, infoStartY + 7);
                            } else if (currentStatus == Chess.None) targetStatus = Chess.O;
                            break;
                        case Side.Both:
                            if (currentStatus == Chess.None) {
                                targetStatus = Chess.X;
                            } else if (currentStatus == Chess.X) {
                                targetStatus = Chess.O;
                            } else if (currentStatus == Chess.O) {
                                targetStatus = Chess.None;
                            }
                            break;
                    }
                    if (currentStatus && targetStatus)
                        setStatusByPosition(term, currentPosition[0], currentPosition[1], targetStatus);
            }
            cursorToPosition(term, targetPosition[0], targetPosition[1]);
        }
    });
}
