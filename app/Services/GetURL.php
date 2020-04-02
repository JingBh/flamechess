<?php

namespace App\Services;

class GetURL
{
    const base = "http://flamechess.cn/js/diary/index.html";

    /**
     * @param string|null $url
     * @return string|null
     */
    public static function get($url) {
        if (filled($url)) {
            $parts = parse_url($url);
            $path = __DIR__ . "/../../public/" . $parts["path"];
            if (is_dir($path)) $path .= "/index.html";
            if (realpath($path) === false) $url = rel2abs($url, self::base);
            return $url;
        } else return null;
    }
}
