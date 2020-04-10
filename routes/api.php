<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
*/

Route::group([
    "prefix" => "user"
], function() {
    Route::get("getBoard", "UserController@getBoard");
});

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
