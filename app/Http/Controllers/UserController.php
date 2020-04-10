<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;

class UserController
{
    public function getBoard(Request $request) {
        $id = $request->input("id");
        $game = $request->input("game");

        $response = [
            "success" => false,
            "message" => null,
            "data" => null
        ];

        /** @var User $user */
        $user = User::find($id);
        if (filled($user)) {

            /** @var Game $game */
            $game = Game::find($game);

            if (filled($game)) {
                $boardId = intval($game->id . $user->id);
                $board = Board::find($boardId);
                if (blank($board)) {
                    $board = new Board;
                    $board->id = $boardId;
                    $board->save();
                    $board = Board::find($boardId);
                }

                $response["success"] = true;
                $response["data"] = [
                    "user" => $user,
                    "game" => $game,
                    "board" => $board
                ];

            } else $response["message"] = "指定的 Game ID 不存在。";

        } else $response["message"] = "指定的棋盘码不存在。";

        return response()->json($response);
    }
}
