<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RedirectReferer
{
    const allowed = [
        "*jingbh.top",
        "*chessterm.tech",
        ""  // Allow empty referer.
    ];

    const redirectTo = "/#tabUse";

    public function handle(Request $request, Closure $next) {
        $referer = $request->header("referer");
        $refererHost = filled($referer) ? (parse_url($referer, PHP_URL_HOST) ?? "") : "";
        foreach (self::allowed as $allowed) {
            if (Str::is($allowed, $refererHost)) return $next($request);
        }
        return redirect(url(self::redirectTo));
    }
}
