<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

use App\Comment;
use App\Helpers\ControllerHelper;

class CommentController extends Controller
{
    public function getPostComments(Request $request, $postId)
    {
        $comments = ControllerHelper::getMessageBatch($request, Comment::class, 'post_id', $postId, 10, 'created_at', 'asc');

        $jsonComments = [];
        foreach ($comments as $comment)
        {
            $jsonComments[] = ['comment_id' => $comment->id, 'created_at' => $comment->created_at->format(ControllerHelper::DATE_FORMAT), 'content' => $comment->content, 'user_name' => $comment->user->name];
        }
        $jsonComments = ['comments' => $jsonComments];
        return response()->json($jsonComments);
    }

    public function sessionCreateComment(Request $request, $post_id) 
    {
        $validator = Validator::make($request->all(),[
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
        $data = $request->only(['content', 'user_id']);
        $data['post_id'] = $post_id;

        if (Auth::check())
        {
            Comment::create([
                'post_id' => $data['post_id'],
                'content' => $data['content'],
                'user_id' => $data['user_id']
            ]);
            return response()->json([
                'status' => "created",
                'message' => $data['content']
            ]);
        }
    }

    public function sessionDeleteComment(Request $request, $comment_id) 
    {
        $comment = Comment::where('id', $comment_id)->with(['user:id'])->first();
        if (Gate::allows('modify-creation', $comment))
        {
            $comment->delete();
            return response()->json([
                'status' => 'deleted',
            ]);
        }
    }
}
