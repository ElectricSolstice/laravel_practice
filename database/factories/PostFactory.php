<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Post;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

$factory->define(Post::class, function (Faker $faker) {
    return [
        'content' => $faker->paragraph,
        'user_id' => App\User::pluck('id')->random(),
        'title' => Str::random(10),
        'forum_id' => App\Forum::pluck('id')->random()
    ];
});
