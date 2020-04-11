<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function registerQhfz(Request $request) {
        $type = intval($request->input("type", 0));
        $code = strtoupper($request->input("code", ""));
        $codeLower = strtolower($code);
        $name = $request->input("name", "");

        $response = [
            "success" => false,
            "message" => null,
            "data" => null
        ];

        $eschoolUser = DB::table("eschool_users")
            ->where("type", $type)
            ->where("name", $name);

        if ($type != 1 || filled($code)) $eschoolUser = $eschoolUser
            ->where(function($query) use ($code, $codeLower) {
                $query->where("id", $code)
                    ->orWhere("id", $codeLower);
            });

        $eschoolUser = $eschoolUser->get();
        $eschoolMatch = $eschoolUser->count();

        if ($eschoolMatch === 1) {

            $response["success"] = true;

            $eschoolUser = $eschoolUser[0];
            $userName = "[{$eschoolUser->id}] {$eschoolUser->name}";
            $user = User::where("name", $userName)->first();

            if (blank($user)) {
                $lastId = User::where("id", ">=", "10170560000")
                    ->where("id", "<=", "10170569999")
                    ->orderBy("id", "DESC")->value("id") ?? 10170559999;

                if ($lastId >= 10170569999) {
                    $response["success"] = false;
                    $response["message"] = "注册人数已达上限，不允许注册。";
                } else {
                    $userId = $lastId + 1;
                    $user = new User;
                    $user->id = $userId;
                    $user->name = $userName;
                    $user->save();
                    $user = User::find($userId);
                }
            }

            $response["data"] = $user;

        } elseif ($eschoolMatch > 1) {

            $response["success"] = true;
            $response["message"] = "!choose";
            $response["data"] = $eschoolUser;

        } else $response["message"] = "查无此人。请检查您的输入是否准确。";

        return response()->json($response);
    }
}
