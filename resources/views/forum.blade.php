@extends('layout')

@section('content')
<h3 class="forum-title">{{$title}}</h3>
<p class="description">{{$description}}</p>
<div id="posts-ui"></div>
<div id="posts" data-forum-id="{{$forum_id}}"></div>
@foreach ($posts as $post)
    <div class='post-container' data-title="{{$post->title}}" data-username="{{$post->user->name}}"
        data-post-id="{{$post->id}}" data-content="{{$post->content}}" data-created-at="{{$post->created_at}}"></div>
@endforeach
@endsection
