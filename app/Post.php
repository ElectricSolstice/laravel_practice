<?php

namespace App;

use App\Message;

class Post extends Message 
{
    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function forum()
    {
        return $this->belongsTo('App\Forum');
    }

    protected $fillable = ['title', 'content', 'user_id', 'forum_id'];
}
