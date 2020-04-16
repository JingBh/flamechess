<?php

namespace App\Http\Controllers;

use App\Models\Game;

class GameController
{
    public function index() {
        $games = Game::orderBy("id", "DESC")->paginate(15);
        return view("chessterm.games", [
            "games" => $games
        ]);
    }

    public function show(Game $game) {
        return view("chessterm.games", [
            "single" => true,
            "game" => $game
        ]);
    }

    public function api(Game $game) {
        return response()->json($game);
    }
}
