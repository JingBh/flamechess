<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectDeprecatedDomain
{
    const map = [
        "flamechess.jingbh.top" => "chessterm.tech"
    ];

    public function handle(Request $request, Closure $next)
    {
        $url = $request->fullUrl();
        $domain = parse_url($url, PHP_URL_HOST);
        if (filled($domain) && array_key_exists($domain, self::map)) {
            $fromHost = urlencode($domain);
            $fromUrl = urlencode($url);
            $to = urlencode(self::map[$domain]);
            return redirect("https://storage.jingbh.top/embed/utils/new-domain.html?fromHost={$fromHost}&fromUrl={$fromUrl}&to={$to}");
        } else return $next($request);
    }
}
