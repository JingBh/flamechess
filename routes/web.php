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

Route::group([
    "prefix" => "boards"
], function() {
    // Create new board
    Route::post("create", "BoardController@store");
    Route::get("create", "BoardController@store");

    // Show or edit content of a board
    Route::get("/", "BoardController@legacy");

    // Delete a board
    Route::post("delete", "BoardController@destroy");
    Route::get("delete", "BoardController@destroy");
});

Route::resource("boards", "BoardController")->only([
    "store", "show", "update", "destroy"
]);

Route::resource("games", "GameController")->only([
    "show"
]);

Route::view("term", "chessterm");
