<?php

use Carbon\Carbon;
use App\Forum;
use App\User;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run()
    {
        $forums = Forum::pluck('id');
        $users = User::pluck('id');

        $posts = [];
        $timestamp = Carbon::now();
        for ($i=0;$i < 1000;$i++)
        {
            $posts[] = [
                'created_at' => $timestamp,
                'title' => Str::random(10),
                'content' => Str::random(20),
                'user_id' => $users->random(),
                'forum_id' => $forums->random()
            ];
        }
        DB::table('posts')->insert($posts);
    }
}
