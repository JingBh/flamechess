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
<div class="container-fluid text-center my-3 mt-md-5" id="container">
    <h1 class="display-4 mb-3">ChessTerm GUI <span class="badge badge-light release-stage">ALPHA</span></h1>
    <table id="table">
        <tbody id="board"></tbody>
    </table>
</div>
<script src="{{ mix('js/chessgui.js') }}"></script>
</body>
</html>
