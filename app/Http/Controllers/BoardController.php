<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Services\SocketIO;
use Exception;
use Illuminate\Support\Facades\Request;

class BoardController extends Controller
{
    public function __construct()
    {
        $this->middleware("board_admin", ["only" => [
            "store",
            "destroy",
        ]]);
    }

    public function store()
    {
        $response = [
            "success" => false,
            "message" => null
        ];
        $id = Request::input("id");
        if (filled($id)) {
            $exists = Board::find($id);
            if (blank($exists)) {
                $board = new Board;
                $board->id = $id;
                $board->save();
                $response["success"] = true;
            } else $response["message"] = "创建失败，棋盘码已存在。";
        } else $response["message"] = "创建失败，输入的棋盘码为空。";
        return response()->json($response);
    }

    public function show($id=null)
    {
        if (!filled($id)) $id = Request::input("id");
        $history = Request::input("history") == "true";
        $cut = intval(Request::input("cut"));
        $json = Request::input("json") === "true";

        $response = [
            "success" => false,
            "message" => null,
            "data" => []
        ];

        /** @var Board $board */
        $board = Board::find($id);
        if (filled($board)) {
            $response["data"] = $board->toArray();
            if ($history === true) {
                $response["data"]["history"] = [];
                foreach ($board->history() as $data) {
                    if (filled($cut) && $cut > 0) $data = str_split($data, $cut);
                    array_push($response["data"]["history"], $data);
                }
            } elseif (filled($cut) && $cut > 0) {
                $response["data"]["chesspos"] = str_split($board->chesspos, $cut);
            } elseif ($json === false) {
                return response($board->chesspos)->withHeaders([
                    "Content-Type" => "text/plain"
                ]);
            }
            $response["success"] = true;
        } else $response["message"] = "指定的棋盘不存在。";

        return response()->json($response);
    }

    public function update($id=null)
    {
        if (!filled($id)) $id = Request::input("id");
        $chesspos = Request::input("chesspos");
        $clock = Request::input("clock");
        $socket = Request::input("socket", "true") === "true";

        $response = [
            "success" => false,
            "message" => null
        ];

        /** @var Board $board */
        $board = Board::find($id);
        if (filled($board)) {
            if (filled($chesspos)) $board->chesspos = $chesspos;
            if (filled($clock)) $board->clock = $clock;
            if (filled($chesspos) || filled($clock)) {
                if ($socket === true) SocketIO::emit("update_board", $board);
                $board->record();
            }
            $board->save();
            $response["success"] = true;
        } else $response["message"] = "指定的棋盘不存在。";

        return response()->json($response);
    }

    public function destroy($id=null)
    {
        if (!filled($id)) $id = Request::input("id");

        $response = [
            "success" => false,
            "message" => null
        ];

        /** @var Board $board */
        $board = Board::find($id);
        if (filled($board)) {
            try {
                $board->delete();
                $response["success"] = true;
            } catch (Exception $e) {
                $response["message"] = $e->getMessage();
            }
        } else $response["message"] = "指定的棋盘不存在。";

        return response()->json($response);
    }

    public function legacy()
    {
        $id = Request::input("id");
        return (Request::has("chesspos") || Request::has("clock"))
            ? $this->update($id)
            : $this->show($id);
    }
}
