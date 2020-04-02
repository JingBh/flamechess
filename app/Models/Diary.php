<?php

namespace App\Models;

use App\Services\GetURL;
use Illuminate\Database\Eloquent\Model;

class Diary extends Model
{
    protected $casts = [
        "active" => "boolean"
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function getImageAttribute($value) {
        return GetURL::get($value);
    }

    public function getLinkAttribute($value) {
        return GetURL::get($value);
    }
}
