@if (\hisorange\BrowserDetect\Parser::isIE())
    <p class="text-danger"><strong>注意：</strong>你的浏览器太旧了！我不保证 ChessTerm 能在这里正常运行。<small class="text-white">嫌弃你的浏览器！</small></p>
@endif
<p>正确填写下面参数才能打开 ChessTerm 哦~</p>
<form action="{{ url("term") }}" method="GET">
    <div class="form-group row">
        <label class="col-sm-3 col-md-2 col-form-label" for="inputGameId">Game ID</label>
        <div class="col-sm-9 col-md-10">
            <input type="text" class="form-control" id="inputGameId" name="game" value="1000" placeholder="请输入 Game ID" required="required">
            <small class="form-text">Game ID 主要标识了棋盘名称和大小，若不知道可以尝试一下 Game ID 为 <code>1000</code> 的 14x14 测试棋盘。<a href="#tabGames" data-toggle-link="tab">&gt; 查看所有棋盘 &lt;</a></small>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-md-2 col-form-label" for="inputBoardId">棋盘码</label>
        <div class="col-sm-9 col-md-10">
            <input type="text" class="form-control" id="inputBoardId" name="id" required="required">
            <small class="form-text">要使用 ChessTerm，需要一个有效的棋盘码。<a href="#tabRegister" data-toggle-link="tab">&gt; 清华附中师生注册入口 &lt;</a></small>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-md-2 col-form-label" for="selectSide">控制的棋子</label>
        <div class="col-sm-9 col-md-10">
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
        <div class="col-sm-9 col-md-10">
            <input type="submit" class="btn btn-primary" value="打开 ChessTerm">
        </div>
    </div>
</form>
