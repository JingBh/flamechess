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

Route::view("/", "chessterm.intro")->name("chessterm.intro");

Route::view("term", "chessterm.term")->name("chessterm");

Route::any("term/intro", function() {
    return redirect()->route("chessterm.intro");
});

Route::resource("ajax/games", "GameController")->only([
    "index", "show"
]);

Route::group([
    "prefix" => "matomo"
], function() {
    Route::get("live", "MatomoController@live");

    Route::get("visits", "MatomoController@visits");
});

Route::resource("ajax/games", "GameController")->only([
    "index", "show"
]);

Route::group([
    "prefix" => "matomo"
], function() {
    Route::get("live", "MatomoController@live");

    Route::get("visits", "MatomoController@visits");
});
