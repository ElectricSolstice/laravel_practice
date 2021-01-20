<?php

use App\Post;
use App\User;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CommentSeeder extends Seeder
{
    public function run()
    {
        $posts = Post::pluck('id');
        $users = User::pluck('id');

        $comments = [];
        $timestamp = Carbon::now();
        $INSERTION_SIZE = 10000;
        for ($i=0;$i < 100000;$i++)
        {
            $comments[] = [
                'created_at' => $timestamp,
                'content' => Str::random(20),
                'user_id' => $users->random(),
                'post_id' => $posts->random()
            ];

            //chunk up the insertion to avoid going past max memory limit
            if ($i % $INSERTION_SIZE == $INSERTION_SIZE-1)
            {
                DB::table('comments')->insert($comments);
                $comments = [];
            }
        }
        DB::table('comments')->insert($comments);
    }
}
