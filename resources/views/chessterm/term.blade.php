<!doctype html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=700, height=700">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="data-server" content="{{ config('flamechess.term_server') }}">
    <meta name="data-backend" content="{{ url('/') }}">
    <link rel="stylesheet" href="{{ mix('css/chessterm.css') }}">
    <link rel="icon" href="/images/Hashtag.png">
    @include("matomo")
    <title>ChessTerm</title>
</head>
<body>
@include("chessterm.browser_detect")
<div id="terminal"></div>
@include("chesstalk.index")
<script src="{{ mix('js/chessterm.js') }}"></script>
</body>
</html>
