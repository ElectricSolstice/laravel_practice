<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

use App\Post;
use App\Comment;
use App\Helpers\ControllerHelper;

class PostController extends Controller
{
    private function postData (Request $request, $postId)
    {
        $post = Post::where('id', $postId)->with(['user:id,name', 'forum:id,title'])->first();
        $comments = Comment::where('post_id', $postId)->with('user:id,name')->limit(10)->get();
        return ["title" => $post->title,
            "content" => $post->content,
            "author" => $post->user->name,
            "created_at" => $post->created_at->format(ControllerHelper::DATE_FORMAT),
            "post_id" => $post->id,
            "forum" => $post->forum->title,
            "forum_id" => $post->forum_id,
            "comments" => $comments];
    }

    public function postJson (Request $request, $postId)
    {
        return response()->json($this->postData($request, $postId));
    }

    public function postView (Request $request, $postId)
    {
        return response()->view('post', $this->postData($request, $postId));
    }

    public function getForumPosts (Request $request, $forumId)
    {
        $posts = ControllerHelper::getMessageBatch($request, Post::class, 'forum_id', $forumId, 10, 'created_at', 'asc');

        $jsonPosts = [];
        foreach ($posts as $post)
        {
            $jsonPosts[] = ['post_id' => $post->id, 'created_at' => $post->created_at->format(ControllerHelper::DATE_FORMAT), 'title' => $post-> title, 'content' => $post->content, 'user_name' => $post->user->name];
        }
        $jsonPosts = ['posts' => $jsonPosts];
        return response()->json($jsonPosts);
    }

    public function sessionCreatePost (Request $request, $forum_id)
    {
        $validator = Validator::make($request->all(),[
            'title' => 'required|string',
            'content' => 'required|string',
            'user_id' => 'required'
        ]);
        if ($validator->fails()) {
            //TODO more detailed error message
            return response()->json([
                'status' => 'error',
                'message' => 'Unable to validate.'
            ]);
        }
        $data = $request->only(['title', 'content', 'user_id']);
        $data['forum_id'] = $forum_id;

        if (Auth::check())
        {
            Post::create($data);
            return response()->json([
                'status' => 'created',
                'data' => [
                    'title' => $data['title'],
                    'content' => $data['content']
                ]
            ]);
        }
    }

    public function sessionDeletePost(Request $request, $post_id) 
    {
        $post = Post::where('id', $post_id)->first();
        if (Gate::allows('modify-creation', $post))
        {
            $post->delete();
            return response()->json([
                'status' => 'deleted'
            ]);
        } else {
            return response()->json([
                'status' => 'error'
            ]);
        }
    }
}
