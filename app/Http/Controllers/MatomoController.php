<?php

namespace App\Http\Controllers;

use Closure;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class MatomoController extends Controller
{
    public function __construct()
    {
        $this->middleware(function(Request $request, Closure $next) {
            $baseUrl = config("matomo.url");
            $apiKey = config("matomo.api_key");
            $siteId = config("matomo.site_id");

            if (!(filled($baseUrl) && filled($apiKey) && filled($siteId))) {
                return response()->json([
                    "success" => false,
                    "message" => "No config",
                    "data" => null
                ]);
            } else return $next($request);
        });
    }

    public function live()
    {
        return self::response("Live.getCounters", [
            "lastMinutes" => 30
        ]);
    }

    public function visits()
    {
        return self::response("VisitsSummary.get", [
            "period" => "range",
            "date" => "2020-04-09,today"
        ]);
    }

    protected static function response($method, $params=[])
    {
        $data = self::request($method, $params);
        return response()->json([
            "success" => filled($data),
            "message" => null,
            "data" => $data
        ]);
    }

    /**
     * @param string $method
     * @param array $params
     *
     * @return array|null
     */
    protected static function request($method, $params=[])
    {
        $params["method"] = $method;

        $client = new Client();
        $response = $client->get(config("matomo.url"), [
            "query" => array_merge([
                "module" => "API",
                "idSite" => config("matomo.site_id"),
                "format" => "JSON",
                "token_auth" => config("matomo.api_key")
            ], $params)
        ]);

        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        return filled($data) ? $data : null;
    }
}
