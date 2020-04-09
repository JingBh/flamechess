<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class SocketIO
{
    public static function emit($event, $data) {
        try {
            $url = self::url($event);
            if (is_object($data)) $data = $data->toArray();
            Http::post($url, $data);
        } catch (Exception $e) {}
    }

    protected static function url($event) {
        return config("flamechess.term_server") . "/" . $event;
    }
}
