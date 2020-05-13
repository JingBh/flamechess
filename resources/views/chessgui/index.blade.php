<!doctype html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="data-server" content="{{ config('flamechess.term_server') }}">
    <meta name="data-backend" content="{{ url('/') }}">
    <link rel="stylesheet" href="{{ mix('css/chessgui.css') }}">
    @include("matomo")
    <title>ChessTerm GUI</title>
</head>
<body>
@include("chessterm.browser_detect")
<div class="container-fluid text-center my-3 mt-md-4" id="container">
    <h1 class="display-4 mb-3">ChessTerm GUI <span class="badge badge-light release-stage">ALPHA</span></h1>
    <div id="loading" style="margin:30vh 0;">
        <svg id="load" x="0px" y="0px" viewBox="0 0 150 150">
            <circle id="loading-inner" cx="75" cy="75" r="60"/>
        </svg>
    </div>
    <table id="table">
        <tbody id="board"></tbody>
    </table>
</div>
@include("chesstalk.index")
<script src="{{ mix('js/chessgui.js') }}"></script>
</body>
</html>
