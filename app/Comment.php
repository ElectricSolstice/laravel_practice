<?php

namespace App;

use App\Message;

class Comment extends Message
{
    public function message()
    {
        return $this->belongsTo('App\Message');
    }

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

    protected $fillable = ['content', 'user_id', 'post_id'];
}
