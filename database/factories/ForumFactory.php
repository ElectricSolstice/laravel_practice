<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Forum;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

$factory->define(Forum::class, function (Faker $faker) {
    return [
        'title' => Str::random(10),
        'description' => $faker->paragraph
    ];
});
