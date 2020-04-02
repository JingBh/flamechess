<?php

/**
 * @param $rel string
 * @param $base string
 * @return string
 * @see https://stackoverflow.com/a/4444490
 */
function rel2abs($rel, $base)
{
    /* return if already absolute URL */
    if (parse_url($rel, PHP_URL_SCHEME) != "") {
        return $rel;
    }

    /* queries and anchors */
    if ($rel[0] == "#" || $rel[0] == "?") {
        return $base . $rel;
    }

    /**
     * parse base URL and convert to local variables:
     * @var $scheme string
     * @var $host string
     * @var $path string
     */
    extract(parse_url($base));

    /* remove non-directory element from path */
    $path = preg_replace('#/[^/]*$#', "", $path);

    /* destroy path if relative url points to root */
    if ($rel[0] == "/") $path = "";

    /* dirty absolute URL */
    $abs = "{$host}{$path}/{$rel}";

    /* replace '//' or '/./' or '/foo/../' with '/' */
    $re = array('#(/\.?/)#', '#/(?!\.\.)[^/]+/\.\./#');
    $n = 1;
    while ($n > 0) {
        $abs = preg_replace($re, '/', $abs, -1, $n);
    }

    /* absolute URL is ready! */
    return "{$scheme}://{$abs}";
}
