<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ForumSeeder extends Seeder
{
    public function run()
    {
        $forums = [];
        $timestamp = Carbon::now();
        for ($i=0;$i < 100;$i++)
        {
            $forums[] = [
                'created_at' => $timestamp,
                'title' => Str::random(10),
                'description' => Str::random(50)
            ];
        }
        DB::table('forums')->insert($forums);
    }
}
