import {Terminal} from "xterm";
import {cursorTo} from "ansi-escapes";

export enum Side {
    none = "none",
    x = "x",
    o = "o",
    both = "both"
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

export function drawBoard(term: Terminal, x: number, y: number, side: Side) {
    // x: Number of columns
    // y: Number of rows

    for (let yi = 0; yi < y; yi ++) {
        positions[yi] = {};
        boardStatus[yi] = {};
        for (let xi = 0; xi < x; xi ++) {
            positions[yi][xi] = [5 + xi * 2, 3 + yi];
            boardStatus[yi][xi] = Chess.None;
            cursorToPosition(term, xi, yi);  // Move the cursor
            term.write(Chess.None);
        }
    }

    cursorToPosition(term, 0, 0);

    term.onKey(function(event) {
        const cursorX = term.buffer.cursorX;
        const cursorY = term.buffer.cursorY;
        const currentPosition = getPositionByCursor(cursorX, cursorY);
        const currentStatus = getStatusByPosition(currentPosition[0], currentPosition[1]);

        if (currentPosition) {
            let targetPosition = currentPosition;
            let targetStatus: Chess;
            switch (event.domEvent.code) {
                case "ArrowUp":
                    targetPosition[1] -= 1;
                    if (targetPosition[1] < 0) targetPosition[1] = 0;
                    break;
                case "ArrowDown":
                    targetPosition[1] += 1;
                    if (targetPosition[1] > y) targetPosition[1] = y;
                    break;
                case "ArrowLeft":
                    targetPosition[0] -= 1;
                    if (targetPosition[0] < 0) targetPosition[0] = 0;
                    break;
                case "ArrowRight":
                    targetPosition[0] += 1;
                    if (targetPosition[0] > x) targetPosition[0] = x;
                    break;
                case "Space":
                case "Enter":
                    switch (side) {
                        case Side.x:
                            if (currentStatus == Chess.X) {
                                targetStatus = Chess.None;
                            } else if (currentStatus == Chess.None) targetStatus = Chess.X;
                            break;
                        case Side.o:
                            if (currentStatus == Chess.O) {
                                targetStatus = Chess.None;
                            } else if (currentStatus == Chess.None) targetStatus = Chess.O;
                            break;
                        case Side.both:
                            if (currentStatus == Chess.None) {
                                targetStatus = Chess.X;
                            } else if (currentStatus == Chess.X) {
                                targetStatus = Chess.O;
                            } else if (currentStatus == Chess.O) {
                                targetStatus = Chess.None;
                            }
                            break;
                    }
                    if (currentStatus)
                        setStatusByPosition(term, currentPosition[0], currentPosition[1], targetStatus);
            }
            cursorToPosition(term, targetPosition[0], targetPosition[1]);
        }
    });
}
