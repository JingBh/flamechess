<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::redirect("/", "http://flamechess.cn/js/10170/")->name("diary");

/*

$router->get("diary", function() {
    return redirect()->route("diary");
});

$router->get("board/{id}", function($id) {
    return view("boards.{$id}");
});

*/

Route::view("term", "chessterm");
