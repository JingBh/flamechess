import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import {eraseScreen, cursorLeft} from "ansi-escapes";
import {parse} from "qs";

import {drawBoard, Side} from "./drawBoard";

export const VERSION = "0.1.0";

export interface Params {
    userId?: string | number,
    gameId?: string | number,
    side?: Side
}

export function chessterm() {
    const term = new Terminal({});

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(document.getElementById("terminal"));
    fitAddon.fit();
    window.addEventListener("resize", function() {
        fitAddon.fit();
    });

    const paramsRaw = parse(location.search.substring(1));
    let params: Params = {};

    term.write(eraseScreen + cursorLeft + "Logging in, please wait...");
    let userId = paramsRaw.id;
    if (!userId) {
        term.write(eraseScreen + cursorLeft + "\x1b[31mError: Please login first.\x1b[37m");
        // return;
    } else params.userId = userId;

    term.write(eraseScreen + cursorLeft + "Logging in, please wait...");
    let gameId = paramsRaw.game;
    if (!gameId) {
        term.write(eraseScreen + cursorLeft + "\x1b[31mError: Please select a game.\x1b[37m");
        // return;
    } else params.gameId = gameId;

    term.write(eraseScreen + cursorLeft);
    params.side = paramsRaw.side in Side ? paramsRaw.side : Side.none;

    term.write(eraseScreen + cursorLeft);
    drawBoard(term, 14, 14, params);
}
