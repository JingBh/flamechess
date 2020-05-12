import {Terminal} from "xterm";
import {cursorTo, eraseEndLine} from "ansi-escapes";

const padStart = require("lodash/padStart");

import {Available, getAvailable} from "./boardrects";
import {Side, Params, Chess, chessBinds} from "./classes";
import {mouseCursor} from "./mouseCursor";
import {VERSION} from "./version";

let _init: boolean = false;

let positions: {[key: number]: {[key: number]: Array<number>}} = {};
let boardStatus: {[key: number]: {[key: number]: Chess}} = {};
let available: Available = [];

let onKey: {[key: string]: (position?: Array<number>) => any} = {};
let callbacks: {[event: string]: (data) => any} = {};
let ruleCallback;

let lastChesspos: string;

function isAvailable(x: number, y: number): boolean {
    for (let item of available) {
        if (item[0] === x && item[1] === y) return true;
    }
    return false;
}

function cursorToPosition(term: Terminal, x: number, y: number) {
    // x: column
    // y: row

    const position = (positions[y] || {})[x] || null;
    if (position) term.write(cursorTo(position[0], position[1]));
}

function getPositionByCursor(x: number, y: number): Array<number> {
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

function getStatusByPosition(x: number, y: number): Chess {
    // x: column
    // y: row

    const status = (boardStatus[y] || {})[x] || null;
    if (status === Chess.Unavailable) return Chess.Unavailable;
    return Chess[status] || Chess.None;
}

function setStatusByPosition(term: Terminal, x: number, y: number, status: Chess, color?) {
    // x: column
    // y: row

    if ((boardStatus[y] || {})[x]) {

        cursorToPosition(term, x, y);
        if (color) term.write(color);

        if (boardStatus[y][x] !== Chess.Unavailable) {
            boardStatus[y][x] = status;

            term.write(status);
        } else term.write(Chess.Unavailable);

        if (color) term.write('\x1b[0;37m\x1b[49m');
    }
}

export function setAllPosition(term: Terminal, chesspos: string) {
    if (!chesspos) return;

    if (ruleCallback) chesspos = ruleCallback(chesspos, lastChesspos);

    lastChesspos = chesspos;

    let index = 0;
    const cursorBack = cursorTo(term.buffer.active.cursorX, term.buffer.active.cursorY);

    for (let y in positions) {
        // yi: row

        for (let x in positions[y]) {
            // xi: column

            let status: Chess = chessBinds[chesspos[index] || null] || Chess.None;
            setStatusByPosition(term, Number(x), Number(y), status);
            index ++;
        }
    }

    term.write(cursorBack);
}

export function uploadAllPosition() {
    if (callbacks.update_board) {
        let chesspos = "";

        for (let y in boardStatus) {
            // yi: row

            for (let x in boardStatus[y]) {
                // xi: column

                let status: Chess = boardStatus[y][x];
                if (status == Chess.Unavailable) status = Chess.None;
                for (let key in chessBinds) {
                    if (chessBinds[key] == status) chesspos += key;
                }
            }
        }

        if (ruleCallback) chesspos = ruleCallback(chesspos, lastChesspos);

        callbacks.update_board(chesspos);

        lastChesspos = chesspos;
    }
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

        if (currentPosition[0] === position[0] && currentPosition[1] === position[1]) {
            setStatusByPosition(term, position[0], position[1], currentStatus);

        } else if (status == Chess.None || status == Chess.Unavailable) {

            setStatusByPosition(term, currentPosition[0], currentPosition[1], Chess.None);
            setStatusByPosition(term, position[0], position[1], currentStatus);

            uploadAllPosition();
        } else return

        term.write(cursorTo(infoX, infoY) + eraseEndLine);
        term.write(cursorTo(infoX, infoY + 1) + eraseEndLine);
        term.write(cursorTo(infoX, infoY + 2) + eraseEndLine);

        onKey["space"] = onKey["x"] = null;
    };

    onKey["x"] = function() {
        setStatusByPosition(term, currentPosition[0], currentPosition[1], Chess.None);

        term.write(cursorTo(infoX, infoY) + eraseEndLine);
        term.write(cursorTo(infoX, infoY + 1) + eraseEndLine);
        term.write(cursorTo(infoX, infoY + 2) + eraseEndLine);

        uploadAllPosition();

        onKey["space"] = onKey["x"] = null;
    };
}

export function drawBoard(term: Terminal, params: Params) {
    const x = params.game.column;  // Number of columns
    const y = params.game.row;  // Number of rows

    callbacks = params.callbacks;
    if ((callbacks.rules || {})[Number(params.game.id)])
        ruleCallback = callbacks.rules[Number(params.game.id)]

    const boardrects = params.game.boardrects;
    if (boardrects) available = getAvailable(boardrects, x, y);
    const hasBoardrects = (available || []).length > 0;
    console.log(available);

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

            if (hasBoardrects) {
                if (isAvailable(xi, yi)) {
                    boardStatus[yi][xi] = Chess.None;
                } else boardStatus[yi][xi] = Chess.Unavailable;
            } else {
                available.push([xi, yi]);
                boardStatus[yi][xi] = Chess.None;
            }

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
    term.write(`# ${String(params.board.id).substring(String(params.game.id).length)}`);
    term.write(cursorTo(infoStartX, infoStartY + 5));
    term.write(`Side: ${params.side}`);

    const howtoStartX = 4;
    const howtoStartY = Math.max(6 + y, infoStartY + 11);
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
            term.write(cursorTo(howtoStartX, howtoStartY + 6));
            term.write("5. 在非空白格按下<Esc>或<X>可以直接删除棋子");
        } else {
            term.write("3. 在非空白格按下<Enter>或<Space>可以切换棋子");
            term.write(cursorTo(howtoStartX, howtoStartY + 4));
            term.write("4. 在非空白格按下<Esc>或<X>可以直接删除棋子");
        }
    }

    setAllPosition(term, params.board.chesspos);

    cursorToPosition(term, 0, 0);

    if (!_init) {
        term.onKey(function(event) {
            let key = event.domEvent.key || event.domEvent.code;
            console.log(key);

            const cursorX = term.buffer.active.cursorX;
            const cursorY = term.buffer.active.cursorY;
            const currentPosition = getPositionByCursor(cursorX, cursorY);
            const currentStatus = getStatusByPosition(currentPosition[0], currentPosition[1]);

            if (currentPosition) {
                let targetPosition = currentPosition;
                let targetStatus: Chess;

                switch (key.toLowerCase()) {
                    case "w":
                    case "keyw":
                    case "arrowup":
                    case "up":
                        targetPosition[1] -= 1;
                        if (targetPosition[1] < 0) targetPosition[1] = 0;
                        break;
                    case "s":
                    case "keys":
                    case "arrowdown":
                    case "down":
                        targetPosition[1] += 1;
                        if (targetPosition[1] > y) targetPosition[1] = y;
                        break;
                    case "a":
                    case "keya":
                    case "arrowleft":
                    case "left":
                        targetPosition[0] -= 1;
                        if (targetPosition[0] < 0) targetPosition[0] = 0;
                        break;
                    case "d":
                    case "keyd":
                    case "arrowright":
                    case "right":
                        targetPosition[0] += 1;
                        if (targetPosition[0] > x) targetPosition[0] = x;
                        break;
                    case " ":
                    case "spacebar":
                    case "space":
                    case "numpadenter":
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
                        }
                        break;
                    case "escape":
                    case "esc":
                    case "backspace":
                    case "keyx":
                    case "x":
                        if (onKey["x"]) {
                            onKey["x"]();
                        } else if ((params.side == Side.X && currentStatus == Chess.X) ||
                            (params.side == Side.O && currentStatus == Chess.O) ||
                            params.side == Side.Both) {
                            targetStatus = Chess.None;
                        }
                        break;
                }

                if (currentStatus && targetStatus &&
                    currentStatus != targetStatus &&
                    currentStatus != Chess.Unavailable) {

                    setStatusByPosition(term,
                        currentPosition[0],
                        currentPosition[1],
                        targetStatus);

                    uploadAllPosition();
                }

                if (targetPosition)
                    cursorToPosition(term, targetPosition[0], targetPosition[1]);
            }
        });

        if (params.mouse === true) mouseCursor(term, positions);

        term.focus()

        _init = true;
    }
}
