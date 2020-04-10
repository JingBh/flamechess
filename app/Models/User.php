<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property integer $id
 * @property string|null $name
 * @property string|null $email
 * @property string|null $password
 * @property array|null $links
 * @property Carbon|string|null $created_at
 * @property Carbon|string|null $updated_at
 */
class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ["name", "email", "links", "seal"];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ["password"];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        "links" => "array",
    ];

    public function diaries() {
        return $this->hasMany(Diary::class);
    }
}
