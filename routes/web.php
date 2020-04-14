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

Route::any("/", function() {
    return redirect()->route("chessterm.intro");
})->name("diary");

Route::any("diary", function() {
    return redirect()->route("diary");
});

Route::any("intro", function() {
    return redirect()->route("chessterm.intro");
});

/*

$router->get("board/{id}", function($id) {
    return view("boards.{$id}");
});

*/

Route::group([
    "prefix" => "term",
    "as" => "chessterm."
], function() {
    Route::view("/", "chessterm.index");

    Route::view("intro", "chessterm.intro")->name("intro");
});
