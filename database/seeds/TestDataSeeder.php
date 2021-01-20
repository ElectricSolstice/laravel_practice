<?php

use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*factory(App\User::class,50)->create();
        factory(App\Forum::class,5)->create();
        factory(App\Post::class,500)->create();
        factory(App\Comment::class,50000)->create();*/
        $this->call([
            UserSeeder::class,
            ForumSeeder::class,
            PostSeeder::class,
            CommentSeeder::class
        ]);
    }
}
