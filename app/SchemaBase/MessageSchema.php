<?php

namespace App\SchemaBase;

use Illuminate\Database\Schema\Blueprint;

class MessageSchema 
{
    //static class
    private static function initialize() {}

    /**
     * Add the message class attributes to the schema
     */
    public static function add(Blueprint $table)
    {
        $table->bigIncrements('id');
        $table->text('content');
        $table->timestamps();

        //foreign keys
        $table->unsignedBigInteger('user_id');
        $table->foreign('user_id')->references('id')->on('users');
    }
}
