<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EschoolSpider
{
    const url = "http://eschool.qhfz.edu.cn/bxn-core-uic/participant-select/search/rule-id/getOrganizationsAndTagsByUserCategoryRule/param/%/q/%?unwrap=true&_=%";

    /**
     * @param integer|string $groupId
     * @param string $cookies
     *
     * @return array
     */
    public static function fetchOneGroup($groupId, $cookies) {
        $params = [$groupId, "_", time() . "0000"];
        $url = Str::replaceArray("%", $params, self::url);

        $client = new Client([
            "headers" => [
                "Cookie" => $cookies
            ],
            "verify" => false
        ]);

        $response = $client->get($url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        return $data ?? [];
    }

    /**
     * @param integer|string $groupId
     * @param array $user
     */
    public static function parseOneUser($groupId, $user) {
        $name = $user["label"];
        if (strpos($name, "jt") === false &&
            strpos($name, "tc") === false) {
            $name = str_replace("（", "(", $name);
            $name = str_replace("）", ")", $name);
            $name = preg_replace('/\(.*?\)/', "", $name);
            if (filled($name)) DB::table("eschool_users")->updateOrInsert([
                "id" => $user["code"]
            ], [
                "type" => $groupId,
                "name" => $name
            ]);
        }
    }
}
