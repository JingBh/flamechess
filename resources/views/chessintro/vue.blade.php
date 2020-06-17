<!doctype html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="data-backend" content="{{ url('/') }}">
    <link rel="stylesheet" href="{{ mix("css/chessterm_intro.css") }}">
    <link rel="icon" href="/images/Hashtag.png">
    @include("matomo")
    <title>ChessTerm</title>
</head>
<body>
<div id="app"></div>
<script src="{{ mix("js/chessterm/intro.js") }}"></script>
</body>
</html>
