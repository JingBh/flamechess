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
<div class="container-fluid container-lg text-center my-3 mt-md-4" id="container">
    <h1 class="display-4 mb-3">ChessTerm GUI <span class="badge badge-light release-stage">ALPHA</span></h1>
    <div id="loading" style="margin:30vh 0;">
        <svg id="load" x="0px" y="0px" viewBox="0 0 150 150">
            <circle id="loading-inner" cx="75" cy="75" r="60"/>
        </svg>
    </div>
    <div class="w-100" id="tableContainer">
        <table id="table">
            <tbody id="board"></tbody>
        </table>
    </div>
    <div class="text-left d-none" id="info">
        <hr style="margin: 5rem 0 1rem">
        <div class="row">
            <div class="col">
                <h1 class="font-weight-light">
                    <span data-param="game.title"></span>
                    <small class="text-muted mx-1 text-nowrap" style="font-size:50%;vertical-align:super;">
                        # <span data-param="user.id"></span>
                    </small>
                </h1>
                <p data-param="game.description"></p>
            </div>
            <div class="col-auto text-nowrap">
                <h6 class="text-secondary d-none d-sm-inline-block">从这里拿新棋子 &rarr;</h6>
                <div class="data-new-chess pickable" data-status="x">
                    <img class="data-chess" src="/images/flamechess/yellow_zu.png">
                </div>
                <div class="data-new-chess pickable" data-status="o">
                    <img class="data-chess" src="/images/flamechess/blue_zu.png">
                </div>
            </div>
        </div>
    </div>
</div>
@include("chessgui.contextmenu")
@include("chesstalk.index")
<script src="{{ mix('js/chessgui.js') }}"></script>
</body>
</html>
