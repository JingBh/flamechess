<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditGamesTableAddRectpaper extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("games", function (Blueprint $table) {
            $table->string("rectpaper")->nullable()->after("description");
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
            $table->dropColumn(["rectpaper"]);
        });
    }
}
