<?php

namespace Tests\Feature;

use App\Forum;
use App\Post;
use App\Comment;
use App\User;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class CommentControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    private $user;
    private $post;

    public function setupTest()
    {
        $forum = new Forum;
        $forum->title = "Forum: CommentControllerTest";
        $forum->description = "Testing out CommentController";
        $forum->save();
        $this->assertDatabaseHas('forums', ['title' => $forum->title, 'description' => $forum->description]);

        $this->user = new User;
        $this->user->name = "test_session_comment_controller";
        $this->user->email = "test_session_comment_controller@fake.email";
        $this->user->password = "not_a_real_User_1001@";
        $this->user->save();
        $this->assertDatabaseHas('users', ['name' => $this->user->name, 'email' => $this->user->email]);

        $this->post = new Post;
        $this->post->title = 'post title for CommentControllerTest';
        $this->post->content = 'post content for CommentControllerTest';
        $this->post->user_id = $this->user->id;
        $this->post->forum_id = $forum->id;
        $this->post->save();
        $this->assertDatabaseHas('posts', ['forum_id' => $forum->id]);
    }

    public function testSessionCommenting()
    {
        $this->setupTest();

        $commentContent = 'session comment content';
        $commentRecord = ['user_id' => $this->user->id, 'content' => $commentContent];
        $response = $this->actingAs($this->user)->postJson('/session/post/' . $this->post->id . '/comments/create', $commentRecord);
        $response->assertJson([
            'status' => 'created',
            'message' => $commentContent
        ]);
        $this->assertDatabaseHas('comments', $commentRecord);
        $response->assertStatus(200);

        $comment = Comment::where('user_id', $this->user->id)->first();
        $response = $this->actingAs($this->user)->post('/session/comment/' . $comment->id . '/delete');
        $this->assertDeleted('comments', $commentRecord);
        $response->assertStatus(200);
    }

    public function testCommentListing ()
    {
        $this->setupTest();

        $comments = [];
        for ($i=0; $i<10; $i++) 
        {
            $commentRecord = ['content' => 'comment ' . $i . ' content', 'post_id' => $this->post->id, 'user_id' => $this->user->id];
            $comment = Comment::create($commentRecord);
            $comment->save();
            $this->assertDatabaseHas('comments', $commentRecord);
            $comments[] = $commentRecord['content'];
        }

        $response = $this->get('/post/' . $this->post->id . '/comments/list');
        $responseComments = $response['comments'];
        $this->assertTrue(strcmp(gettype($responseComments),"array") == 0);
        foreach ($responseComments as $key => $comment) 
        {
            $this->assertTrue(in_array($comment['content'], $comments), json_encode($comment) . " is not found in " . json_encode($comments));
        }
        $response->assertStatus(200);
    }
}
