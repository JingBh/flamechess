export interface Board {
    id: string|number,
    chesspos?: string,
    clock?: string
}

export interface Game {
    id: number,
    title?: string,
    description?: string|null,
    chesspos?: string|null,
    boardrects?: string|null,
    rectpaper?: string|null,
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
    side?: Side,
    mouse?: boolean,
    bot?: boolean,
    callbacks: {[event: string]: (data) => any}
}

export interface loginResult {
    game: Game,
    board: Board
}

export enum Chess {
    Unavailable = " ",
    None = "-",
    X = "X",
    O = "O"
}

export const chessBinds: {[key: string]: Chess} = {
  "0": Chess.None,
  "z": Chess.X,
  "Z": Chess.O
}
