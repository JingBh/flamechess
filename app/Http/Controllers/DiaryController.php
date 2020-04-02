<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class DiaryController extends Controller
{
    public function index(Request $request) {
        $id = $request->get("id", 10170);
        $name = $request->get("nm", "清华附中机器博弈");
        $user = User::find($id);
        if (filled($user)) {
            $diaries = $user->diaries()->where("active", 1)->get();
            return view("diary", [
                "input" => $id,
                "user" => $user,
                "name" => $name,
                "diaries" => $diaries
            ]);
        } else {
            $url = "http://flamechess.cn/js/diary/?id={$id}";
            return redirect($url);
            /* return view("redirect", [
                "url" => "http://flamechess.cn/js/diary/?id={$id}"
            ]); */
        }
    }
}
