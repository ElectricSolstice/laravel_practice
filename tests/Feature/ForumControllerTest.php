<?php

namespace Tests\Feature;

use App\Forum;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class ForumControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    public function testForumListing()
    {
        $forums = [];
        for ($i=0; $i<10; $i++) 
        {
            $forumRecord = ['title' => 'Forum ' . $i, 'description' => 'description of forum ' . $i];
            $forum = Forum::create($forumRecord);
            $forum->save();
            $this->assertDatabaseHas('forums', $forumRecord);
            $forums[] = $forumRecord;
        }

        $response = $this->get('/forums/list');
        $responseForums = $response['forums'];
        $this->assertTrue(strcmp(gettype($responseForums),"array") == 0);
        foreach ($responseForums as $key => $forum) {
            $this->assertTrue(in_array($forum, $forums));
        }
        $response->assertStatus(200);
    }
}
