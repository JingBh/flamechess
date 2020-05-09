<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiCors
{
    public function handle(Request $request, Closure $next) {
        $response = $next($request);
        $response->header('Access-Control-Allow-Origin', "*");
        return $response;
    }
}
