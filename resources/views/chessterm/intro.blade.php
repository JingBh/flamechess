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
<div class="container-fluid container-md my-3">
    <div class="jumbotron pt-sm-4 pb-sm-5">
        <h1 class="display-4">ChessTerm <small class="text-muted" id="version"></small></h1>
        <p class="lead mb-1">A checkerboard, but in a terminal.</p>
        <p class="mb-0">Developed by <a class="text-body" href="https://www.jingbh.top/" target="_blank">JingBh</a></p>
    </div>
    <ul class="nav nav-tabs" id="tabs" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="tabIntro" data-toggle="tab" href="#panelIntro" role="tab" aria-controls="panelIntro" aria-selected="true">简介</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="tabSource" data-toggle="tab" href="#panelSource" role="tab" aria-controls="panelSource" aria-selected="false">源码</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="tabUse" data-toggle="tab" href="#panelUse" role="tab" aria-controls="panelUse" aria-selected="false">使用</a>
        </li>
        <li class="nav-item d-none">
            <a class="nav-link" id="tabRegister" data-toggle="tab" href="#panelRegister" role="tab" aria-controls="panelRegister" aria-selected="false">注册</a>
        </li>
    </ul>
    <div class="tab-content mt-2" id="myTabContent">
        <div class="tab-pane fade show active" id="panelIntro" role="tabpanel" aria-labelledby="tabIntro">
            <p>ChrssTerm 是我研学项目的一部分，是一个在 Terminal 中实现的棋盘。</p>
            <p>这个棋盘不是针对某种具体的棋，也没有规则限制，可以随意调整棋盘大小，自由使用。</p>
            <p>棋盘上有两种棋子：<code>X</code> 和 <code>O</code>，您可以选择控制其中一方或两方，或者都不控制，进行观战。</p>
            <p>当能控制至少一方棋子时，可以在空白格（用 <code>-</code> 表示）按下 <kbd>Space</kbd> 放下棋子，也可以在棋子上按下 <kbd>X</kbd> 删除棋子。</p>
            <p>当只控制一方时，还有按下 <kbd>Space</kbd> 拿起棋子的功能。在拿起的状态下，可以在新位置重新放下，或者按 <kbd>X</kbd> 删除。</p>
            <p>为了学习，我在棋盘中采用的技术大多都是之前没接触过的。总结一下，大概有这些：</p>
            <ul>
                <li>使用 Xterm.js 模拟终端</li>
                <li>使用 TypeScript 语言</li>
                <li>使用基于 WebSocket 的 Socket.io 实现与服务器与客户端的双向实时通信</li>
                <li>用了一下午想办法兼容 IE 11 <small class="text-muted">（这个是真的难 TAT）</small></li>
            </ul>
            <div class="text-muted hide" id="visits">
                <hr>
                <p>本站访问量：
                    <span id="visitsLive" title="当前" data-toggle="tooltip">?</span> /
                    <span id="visitsCount" title="总计" data-toggle="tooltip">?</span>
                </p>
            </div>
        </div>
        <div class="tab-pane fade" id="panelSource" role="tabpanel" aria-labelledby="tabSource">
            <div class="embed-responsive" style="height:calc(100vh - 20rem);min-height:10rem;">
                <iframe class="embed-responsive-item" src="{{ url("static/chess_source.html") }}"></iframe>
            </div>
        </div>
        <div class="tab-pane fade" id="panelUse" role="tabpanel" aria-labelledby="tabUse">
            @include("chessterm.intro_use")
        </div>
        <div class="tab-pane fade" id="panelRegister" role="tabpanel" aria-labelledby="tabRegister">
            @include("chessterm.register")
        </div>
    </div>
</div>
<script src="{{ mix("js/chessterm_intro.js") }}"></script>
</body>
</html>
