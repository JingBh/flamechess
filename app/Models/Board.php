<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * @property string id
 * @property string chesspos
 * @property string clock
 */
class Board extends Model
{
    public $timestamps = false;

    public function record() {
        return DB::table("boards_history")
            ->insert([
                "board_id" => $this->id,
                "board_clock" => $this->clock,
                "chesspos" => $this->chesspos
            ]);
    }

    public function history() {
        return DB::table("boards_history")
            ->where("board_id", $this->id)
            ->orderBy("time", "DESC")
            ->pluck("chesspos");
    }
}
