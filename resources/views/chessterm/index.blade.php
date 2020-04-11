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
<div class="container-fluid position-fixed" style="z-index:1000000;">
    @if (\hisorange\BrowserDetect\Parser::isIEVersion(11))
        <p class="text-warning"><strong>警告：</strong>这个浏览器太旧了，建议换个<strong>现代的</strong>浏览器。</p>
    @elseif (\hisorange\BrowserDetect\Parser::isIE())
        <p class="text-danger"><em>真难以想象这么旧的浏览器的为什么还能用...</em></p>
    @endif
</div>
<div id="terminal"></div>
<script src="{{ mix('js/chessterm.js') }}"></script>
</body>
</html>
