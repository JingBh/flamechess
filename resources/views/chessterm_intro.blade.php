<!doctype html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ mix("css/chessterm_intro.css") }}">
    <link rel="icon" href="/images/Hashtag.png">
    @include("matomo")
    <title>ChessTerm</title>
</head>
<body>
<div class="container-fluid my-3">
    <div class="jumbotron pt-sm-4 pb-sm-5">
        <h1 class="display-4">ChessTerm <small class="text-muted" id="version"></small></h1>
        <p class="lead mb-1">A checkerboard, but in a terminal.</p>
        <p class="mb-0">Developed by <a class="text-body" href="https://www.jingbh.top/" target="_blank">JingBh</a></p>
    </div>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="tabIntro" data-toggle="tab" href="#panelIntro" role="tab" aria-controls="panelIntro" aria-selected="true">简介</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="tabSource" data-toggle="tab" href="#panelSource" role="tab" aria-controls="panelSource" aria-selected="false">源码</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="tabUse" data-toggle="tab" href="#panelUse" role="tab" aria-controls="panelUse" aria-selected="false">试用</a>
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
                <li>用了一下午想办法兼容 IE 11 <small class="text-muted">（这个是真的难 TAT）</small></li>
                <li>使用基于 WebSocket 的 Socket.io 实现与服务器与客户端的双向实时通信</li>
            </ul>
        </div>
        <div class="tab-pane fade" id="panelSource" role="tabpanel" aria-labelledby="tabSource">
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="{{ url("static/chess_source.html") }}"></iframe>
            </div>
        </div>
        <div class="tab-pane fade" id="panelUse" role="tabpanel" aria-labelledby="tabUse">
            @if (\hisorange\BrowserDetect\Parser::isIE())
                <p class="text-danger"><strong>注意：</strong>你的浏览器太旧了！我不保证 ChessTerm 能在这里正常运行。<small class="text-white">嫌弃你的浏览器！</small></p>
            @endif
            <p>正确填写下面参数才能打开 ChessTerm 哦~</p>
            <form action="{{ url("term") }}" method="GET">
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label" for="inputGameId">Game ID</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="inputGameId" name="game" value="1000" placeholder="请输入 Game ID" required="required">
                        <small class="form-text">Game ID 主要标识了棋盘名称和大小，若不知道可以尝试一下 Game ID 为 <code>1000</code> 的 14x14 测试棋盘。</small>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label" for="inputBoardId">棋盘码</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="inputBoardId" name="id" required="required">
                        <small class="form-text">要使用 ChessTerm，需要一个有效的棋盘码。</small>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label" for="selectSide">控制的棋子</label>
                    <div class="col-sm-10">
                        <select class="custom-select" id="selectSide" name="side">
                            <option selected="selected" value="none">无</option>
                            <option value="x">“X”</option>
                            <option value="o">“O”</option>
                            <option value="both">“X”和“O”</option>
                        </select>
                        <small class="form-text">如“简介”中所说，棋盘上有两种棋子：<code>X</code> 和 <code>O</code>，您可以选择控制其中一方或两方，或者都不控制，进行观战。</small>
                    </div>
                </div>
                <div class="form-group row justify-content-end">
                    <div class="col-sm-10">
                        <input type="submit" class="btn btn-primary" value="打开 ChessTerm">
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="{{ mix("js/chessterm_intro.js") }}"></script>
</body>
</html>
