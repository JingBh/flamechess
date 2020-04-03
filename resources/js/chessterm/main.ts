import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import {eraseScreen, cursorLeft} from "ansi-escapes";
import {parse} from "qs";

import {drawBoard, Side} from "./drawBoard";

export function chessterm() {
    const term = new Terminal({});

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(document.getElementById("terminal"));
    fitAddon.fit();

    const params = parse(location.search.substring(1));

    term.write(eraseScreen + cursorLeft + "Logging in, please wait...");
    let userId = params.id;
    if (!userId) {
        term.write(eraseScreen + cursorLeft + "\x1b[31mError: Please login first.\x1b[37m");
        // return;
    }

    term.write(eraseScreen + cursorLeft + "Logging in, please wait...");
    let gameId = params.game;
    if (!gameId) {
        term.write(eraseScreen + cursorLeft + "\x1b[31mError: Please select a game.\x1b[37m");
        // return;
    }

    term.write(eraseScreen + cursorLeft);
    let side: Side = params.side in Side ? params.side : Side.none;

    term.write(eraseScreen + cursorLeft);
    drawBoard(term, 14, 14, side);
}
