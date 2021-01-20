<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('/session/login', 'Auth\LoginController@loginSession');
Route::post('/session/logout', 'Auth\LoginController@logoutSession');

Route::get('/', 'ForumController@getForumsView');

Route::get('/forum', 'ForumController@getForumsView');
Route::get('/forums/list', 'ForumController@getForumsJson');
Route::get('/forum/{forum_id}', 'ForumController@forumView')->where(['forum_id' => '[0-9]+']);
Route::get('/forum/{forum_id}/posts/list', 'PostController@getForumPosts')->where(['forum_id' => '[0-9]+']);

Route::post('/session/forum/{forum_id}/posts/create', 'PostController@sessionCreatePost')->where(['forum_id' => '[0-9]+']);

Route::get('/post/{post_id}', 'PostController@postView')->where(['post_id' => '[0-9]+']);
Route::get('/post/{post_id}/comments/list', 'CommentController@getPostComments')->where(['post_id' => '[0-9]+']);

Route::post('/session/post/{post_id}/delete', 'PostController@sessionDeletePost')->where(['post_id' => '[0-9]+']);
Route::post('/session/post/{post_id}/edit', 'PostController@sessionEditPost')->where(['post_id' => '[0-9]+']);
Route::post('/session/post/{post_id}/comments/create', 'CommentController@sessionCreateComment')->where(['post_id' => '[0-9]+']);

Route::post('/session/comment/{comment_id}/delete', 'CommentController@sessionDeleteComment')->where(['comment_id' => '[0-9]+']);
Route::post('/session/comment/{comment_id}/edit', 'CommentController@sessionEditComment')->where(['comment_id' => '[0-9]+']);
