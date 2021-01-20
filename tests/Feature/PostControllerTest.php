<?php

namespace Tests\Feature;

use App\Forum;
use App\Post;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    private $user;
    private $forum;

    public function setupTest()
    {
        $this->forum = new Forum;
        $this->forum->title = "Forum: PostControllerTest";
        $this->forum->description = "Testing out PostController";
        $this->forum->save();
        $this->assertDatabaseHas('forums', ['title' => $this->forum->title, 'description' => $this->forum->description]);

        $this->user = new User;
        $this->user->name = "test_session_post_controller";
        $this->user->email = "test_session_post_controller@fake.email";
        $this->user->password = "not_a_real_user_1001@";
        $this->user->save();
        $this->assertDatabaseHas('users', ['name' => $this->user->name, 'email' => $this->user->email]);
    }

    public function testGetForumPosts()
    {
        $response = $this->get('/forum/1/posts/list');
        $response->assertStatus(200);
        $this->assertTrue(gettype($response['posts']) == "array");
    }

    public function testSessionPosting()
    {
        $this->setupTest();

        $postTitle = 'session post title';
        $postContent = 'session post content';
        $postRecord = ['user_id' => $this->user->id, 'title' => $postTitle, 'content' => $postContent];
        $response = $this->actingAs($this->user)->postJson('/session/forum/' . $this->forum->id . '/posts/create', $postRecord);
        $response->assertJson([
            'status' => 'created',
            'data' => ['title' => $postTitle, 'content' => $postContent]
        ]);
        $this->assertDatabaseHas('posts', $postRecord);
        $response->assertStatus(200);

        $post = Post::where('user_id', $this->user->id)->first();
        $response = $this->actingAs($this->user)->post('/session/post/' . $post->id . '/delete');
        $this->assertDeleted('posts', $postRecord);
        $response->assertStatus(200);
    }

    public function testPostListing()
    {
        $this->setupTest();

        $posts = [];
        for ($i=0; $i<10; $i++) 
        {
            $postRecord = ['title' => 'post ' . $i . ' title', 'content' => 'post ' . $i . ' content', 'forum_id' => $this->forum->id, 'user_id' => $this->user->id];
            $post = Post::create($postRecord);
            $post->save();
            $this->assertDatabaseHas('posts', $postRecord);
            $postContents[] = $postRecord['content']; 
            $postTitles[] = $postRecord['title'];
        }

        $response = $this->get('/forum/' . $this->forum->id . '/posts/list');
        $responsePosts = $response['posts'];
        $this->assertTrue(strcmp(gettype($responsePosts),"array") == 0);
        foreach ($responsePosts as $key => $post) 
        {
            $this->assertTrue(in_array($post['content'], $postContents), json_encode($post) . " is not found in contents " . json_encode($postContents));
            $this->assertTrue(in_array($post['title'], $postTitles), json_encode($post) . " is not found in titles " . json_encode($postTitles));
        }
        $response->assertStatus(200);
    }
}
