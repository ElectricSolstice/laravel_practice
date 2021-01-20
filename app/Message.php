<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

abstract class Message extends Model
{
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
