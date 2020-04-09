<?php

namespace App\Http\Controllers;

use App\Models\Game;

class GameController
{
    public function show(Game $game) {
        return response()->json($game);
    }
}
