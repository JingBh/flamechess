<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $title
 * @property string|null $description
 * @property string|null $chesspos
 * @property string|null $boardrects
 * @property integer $row
 * @property integer $column
 */
class Game extends Model
{
    public $timestamps = false;
}
