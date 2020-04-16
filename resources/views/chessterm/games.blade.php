<!doctype html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ mix("css/chessterm_intro.css") }}">
    <title>ChessTerm Games</title>
</head>
<body>
<div class="container-fluid">
    @if ($single ?? false)
    <p class="my-2"><a href="{{ url("ajax/games") }}">&lt; 返回</a></p>
    <div class="game">
        <h2 class="font-weight-light">
            <span class="text-success game-title">{{ $game->title }}</span>
            <small class="text-muted text-nowrap game-id">(ID: {{ $game->id }})</small>
        </h2>
    </div>
    @else
    <p>这是系统中收录的棋盘列表，您可以点击查看详情。在<a href="javascript:top.document.getElementById('tabUse').click();">“使用”</a>中“Game ID”一栏输入您在下面看到的 ID 即可使用这些棋盘。</p>
    <div class="list-group mb-3">
        @foreach ($games as $game)
            <a href="{{ url("ajax/games/" . $game->id) }}" class="list-group-item list-group-item-action game">
                <h3 class="font-weight-light mb-1">
                    <span class="text-primary game-title">{{ $game->title }}</span>
                    <small class="text-muted text-nowrap game-id">(ID: {{ $game->id }})</small>
                </h3>
                <p class="text-muted mb-0">{{ $game->description }}</p>
            </a>
        @endforeach
    </div>
    <div class="text-right">
        {{ $games->links() }}
    </div>
    @endif
</div>
<script src="/static/autoHeight.js"></script>
</body>
</html>
