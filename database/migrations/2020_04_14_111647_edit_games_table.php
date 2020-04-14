<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("games", function (Blueprint $table) {
            $table->string("chesspos")->nullable()->after("description");
            $table->string("boardrects")->nullable()->after("chesspos");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("games", function (Blueprint $table) {
            $table->dropColumn(["chesspos", "boardrects"]);
        });
    }
}
