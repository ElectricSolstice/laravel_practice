<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Forum;
use App\Post;

class ForumController extends Controller
{
    private function forumData (Request $request, $forumId)
    {
        $forum = Forum::where('id', $forumId)->first();
        $posts = Post::where('forum_id', $forumId)->with('user:id,name')->limit(10)->get();
        return ["forum_id" => $forum->id,
            "title" => $forum->title,
            "description" => $forum->description,
            "posts" => $posts];
    }

    public function forumJson (Request $request, $forumId)
    {
        return response()->json($this->forumData($request, $forumId));
    }

    public function forumView (Request $request, $forumId)
    {
        return response()->view('forum', $this->forumData($request, $forumId));
    }

    private function forumList ()
    {
        $forums = Forum::all();
        $forumList = [];
        foreach ($forums as $forum)
        {
            $forumList[$forum->id] = ['title' => $forum->title, 'description' => $forum->description];
        }
        return ["forums" => $forumList];
    }

    public function getForumsJson()
    {
        return response()->json($this->forumList());
    }

    public function getForumsView ()
    {
        return response()->view('forums', $this->forumList());
    }
}
