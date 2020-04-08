import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import {eraseScreen, cursorLeft, cursorTo} from "ansi-escapes";
import {parse} from "qs";

const capitalize = require("lodash/capitalize");
const io = require("socket.io-client");

import {drawBoard, setAllPosition} from "./drawBoard";

export const VERSION = "0.1.0";

export const SERVER = document.querySelector("meta[name='data-server']").getAttribute("content");

export const BACKEND = document.querySelector("meta[name='data-backend']").getAttribute("content");

export interface Board {
    id: string|number,
    chesspos?: string,
    clock?: string
}

export interface Game {
    id: number,
    title?: string,
    description?: string|null,
    row: number,
    column: number
}

export enum Side {
    None = "None",
    X = "X",
    O = "O",
    Both = "Both"
}

export interface Params {
    board?: Board,
    game?: Game,
    side?: Side
}

interface loginResult {
    game: Game,
    board: Board
}

function clearScreen(term: Terminal) {
    term.write(eraseScreen + cursorTo(1, 1));
}

const term = new Terminal({});
const socket = io(SERVER);
console.log(socket);

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById("terminal"));
fitAddon.fit();
window.addEventListener("resize", function() {
    fitAddon.fit();
});

const paramsRaw = parse(location.search.substring(1));
let params: Params = {};

socket.on("connect", function() {
    clearScreen(term);
    term.write("Logging in, please wait...");
    let userId = paramsRaw.id;
    let gameId = paramsRaw.game;
    if (!userId) {
        clearScreen(term);
        term.write("\x1b[1;31mError: 请先登录。\x1b[0;37m");
        return;
    } else {
        socket.emit("login", socket.id, {
            backend: BACKEND,
            userId: userId,
            gameId: gameId
        });
    }
});

socket.on("login_result", function(data: loginResult) {
    console.info(data);
    params.board = data.board;
    params.game = data.game;

    let side = capitalize(paramsRaw.side);
    params.side = side in Side ? side : Side.None;

    term.write(eraseScreen + cursorLeft);
    drawBoard(term, params);
});

socket.on("login_fail", function(msg?: string) {
    clearScreen(term);
    term.write(`\x1b[1;31mError: ${msg || "登录失败。"}\x1b[0;37m`);
    term.write(cursorTo(1, 2));
    term.write("请检查 id 和 game 参数是否正确。");
});

socket.on("update_chesspos", function(chesspos?: string) {
    if (chesspos) setAllPosition(term, chesspos);
});
