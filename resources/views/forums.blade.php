@extends('layout')

@section('content')
<h3 class="forum-title">Forums</h3>
<ul id="forums">
    @foreach (array_keys($forums) as $forum)
        <li><a class="forum" href="{{config('app.url') . '/forum/' . $forum}}">{{$forums[$forum]['title']}}</a></li>
    @endforeach
</ul>
@endsection
