@extends('layout')

@section('scripts')
@parent
@stop

@section('content')
<div class="topic">
    <h3 class="title">{{$title}}</h3>
    <div class="time">{{$created_at}}</div>
    <div class="username">{{$author}}</div>
    <div class="text">{{$content}}</div>
</div>
<div id="comments-ui"></div>
<div id="comments" data-post-id="{{$post_id}}">
</div>
@foreach ($comments as $comment)
    <div class='comment-container' data-username="{{$comment->user->name}}"
        data-comment-id="{{$comment->id}}" data-content="{{$comment->content}}" data-created-at="{{$comment->created_at}}"></div>
@endforeach
@endsection
