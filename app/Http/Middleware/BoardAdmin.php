<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class BoardAdmin
{
    public function handle(Request $request, Closure $next) {
        $password = env("FLAMECHESS_PASSWORD");
        $input = $request->input("key");
        if ($input === $password) {
            return $next($request);
        } else return response()->json([
            "success" => false,
            "message" => "Unauthorized"
        ])->setStatusCode(401);
    }
}
