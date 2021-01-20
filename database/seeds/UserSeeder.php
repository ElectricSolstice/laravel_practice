<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [];
        $timestamp = Carbon::now();
        for ($i=0;$i < 10000;$i++)
        {
            $users[] = [
                'created_at' => $timestamp,
                'name' => Str::random(10),
                'email' => Str::random(10) . '@fake_email.com',
                'email_verified_at' => now(),
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                'remember_token' => Str::random(10)
            ];
        }
        DB::table('users')->insert($users);
    }
}
