<?php

namespace Tests\Browser;

use App\Forum;
use App\Post;
use App\Comment;
use App\User;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ScrollLoadingTest extends DuskTestCase
{

    use DatabaseMigrations;

    private $user;
    private $forum;
    private $commentIds;

    public function setupTest()
    {
        $this->forum = new Forum();
        $this->forum->title = "Forum: ScrollLoadingTest";
        $this->forum->description = "Testing out scroll loading comments";
        $this->forum->save();
        $this->assertDatabaseHas('forums', ['title' => $this->forum->title, 'description' => $this->forum->description]);

        $user = new User;
        $user->name = "test_scroll_comments";
        $user->email = "not_a_real_user@fake.email";
        $user->password = "not_a_real_User_1001@";
        $user->save();
        $this->assertDatabaseHas('users', ['name' => $user->name, 'email' => $user->email]);

        $this->post = new Post();
        $this->post->title = "scroll loading test title of post";
        $this->post->content = "scroll loading test content of post";
        $this->post->user_id = $user->id;
        $this->post->forum_id = $this->forum->id;
        $this->post->save();
        $this->assertDatabaseHas('posts', ['title' => $this->post->title, 'content' => $this->post->content]);

        $comment;
        $this->commentContent = "scroll loading test comment ";
        $this->commentIds = array();
        for ($i=0; $i<100; ++$i) 
        {
            $comment = new Comment();
            $comment->content =  $this->commentContent . $i;
            $comment->user_id = $user->id;
            $comment->post_id = $this->post->id;
            $comment->save();
            $this->assertDatabaseHas('comments', ['content' => $comment->content]);
            $this->assertTrue(is_int($comment->id));
            $this->commentIds[$i] = $comment->id;
        }
    }

    public function testScrollComments()
    {
        $this->setupTest();

        $this->browse(function (Browser $browser) {
            $browser->visit('/post/' . $this->post->id)->assertSee($this->commentContent . '0');
            for ($i=0; $i<sizeof($this->commentIds); ++$i)
            {
                $browser->scrollIntoView('#comment-' . strval($this->commentIds[$i]))->assertSee($this->commentContent . $i);
            }
        });
    }
}
