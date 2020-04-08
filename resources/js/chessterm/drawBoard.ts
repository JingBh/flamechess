import {Terminal} from "xterm";
import {cursorTo, eraseEndLine} from "ansi-escapes";

const padStart = require("lodash/padStart");

import {Side, Params, VERSION} from "./main";

export enum Chess {
    None = "-",
    X = "X",
    O = "O"
}

const binds: {[key: string]: Chess} = {
    "0": Chess.None,
    "z": Chess.X,
    "Z": Chess.O
};

let positions: {[key: number]: {[key: number]: Array<number>}} = {};
let boardStatus: {[key: number]: {[key: number]: Chess}} = {};

let onKey: {[key: string]: (position?: Array<number>) => any} = {};

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

        for (let xi in positions[yi]) {
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

export function setStatusByPosition(term: Terminal, x: number, y: number, status: Chess, color?) {
    // x: column
    // y: row

    if ((boardStatus[y] || {})[x]) {
        boardStatus[y][x] = status;
        cursorToPosition(term, x, y);
        if (color) term.write(color);
        term.write(status);
        if (color) term.write('\x1b[0;37m\x1b[49m');
    }
}

export function setAllPosition(term: Terminal, chesspos: string) {
    let index = 0;
    const cursorBack = cursorTo(term.buffer.cursorX, term.buffer.cursorY);

    for (let yi in positions) {
        // yi: row

        for (let xi in positions[yi]) {
            // xi: column

            let position = positions[yi][xi];
            let status: Chess = binds[chesspos[index]] || Chess.None;
            term.write(cursorTo(position[0], position[1]));
            term.write(status);
        }
    }

    term.write(cursorBack);
}

function pickup(term: Terminal, currentPosition: Array<number>, infoX: number, infoY: number) {
    let currentStatus: Chess = getStatusByPosition(currentPosition[0], currentPosition[1]);
    setStatusByPosition(term, currentPosition[0], currentPosition[1], currentStatus, '\x1b[46m');

    term.write(cursorTo(infoX, infoY));
    term.write('\x1b[1;32m');
    let rowNumber = currentPosition[1] + 1;
    let colNumber = String.fromCharCode(65 + currentPosition[0]);
    term.write(`Picking up: ${rowNumber}${colNumber} (${currentStatus})`);
    term.write(cursorTo(infoX, infoY + 1));
    term.write('\x1b[1;36m');
    term.write("<Space> to put down;");
    term.write(cursorTo(infoX, infoY + 2));
    term.write("<X> to delete.");
    term.write('\x1b[0;37m');

    onKey["space"] = function(position) {
        let status: Chess = getStatusByPosition(position[0], position[1]);
        if (status == Chess.None) {
            setStatusByPosition(term, currentPosition[0], currentPosition[1], Chess.None);
            setStatusByPosition(term, position[0], position[1], currentStatus);

            term.write(cursorTo(infoX, infoY) + eraseEndLine);
            term.write(cursorTo(infoX, infoY + 1) + eraseEndLine);
            term.write(cursorTo(infoX, infoY + 2) + eraseEndLine);

            onKey["space"] = null;
        }
    };

    onKey["x"] = function() {
        setStatusByPosition(term, currentPosition[0], currentPosition[1], Chess.None);

        term.write(cursorTo(infoX, infoY) + eraseEndLine);
        term.write(cursorTo(infoX, infoY + 1) + eraseEndLine);
        term.write(cursorTo(infoX, infoY + 2) + eraseEndLine);

        onKey["x"] = null;
    };
}

export function drawBoard(term: Terminal, params: Params) {
    const x = params.game.column;  // Number of columns
    const y = params.game.row;  // Number of rows

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
    term.write(`\x1b[1;37m${params.game.title}\x1b[0;37m`);
    term.write(cursorTo(infoStartX, infoStartY + 4));
    term.write(`# ${params.board.id}`);
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

    setAllPosition(term, params.board.chesspos);

    term.onKey(function(event) {
        console.log(event.domEvent.key);

        const cursorX = term.buffer.cursorX;
        const cursorY = term.buffer.cursorY;
        const currentPosition = getPositionByCursor(cursorX, cursorY);
        const currentStatus = getStatusByPosition(currentPosition[0], currentPosition[1]);

        if (currentPosition) {
            let targetPosition = currentPosition;
            let targetStatus: Chess;

            switch (event.domEvent.key.toLowerCase()) {
                case "arrowup":
                case "up":
                    targetPosition[1] -= 1;
                    if (targetPosition[1] < 0) targetPosition[1] = 0;
                    break;
                case "arrowdown":
                case "down":
                    targetPosition[1] += 1;
                    if (targetPosition[1] > y) targetPosition[1] = y;
                    break;
                case "arrowleft":
                case "left":
                    targetPosition[0] -= 1;
                    if (targetPosition[0] < 0) targetPosition[0] = 0;
                    break;
                case "arrowright":
                case "right":
                    targetPosition[0] += 1;
                    if (targetPosition[0] > x) targetPosition[0] = x;
                    break;
                case " ":
                case "spacebar":
                case "enter":
                    if (onKey["space"]) {
                        onKey["space"](currentPosition);
                    } else {
                        switch (params.side) {
                            case Side.X:
                                if (currentStatus == Chess.X) {
                                    pickup(term, currentPosition, infoStartX, infoStartY + 7);
                                } else if (currentStatus == Chess.None) targetStatus = Chess.X;
                                break;
                            case Side.O:
                                if (currentStatus == Chess.O) {
                                    pickup(term, currentPosition, infoStartX, infoStartY + 7);
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
                            setStatusByPosition(term,
                                currentPosition[0],
                                currentPosition[1],
                                targetStatus);
                    }
                    break;
                case "escape":
                case "esc":
                case "x":
                    if (onKey["x"]) onKey["x"]();
                    break;
            }
            if (targetPosition)
                cursorToPosition(term, targetPosition[0], targetPosition[1]);
        }
    });
}
