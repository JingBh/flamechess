<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/head.css">
    <link rel="stylesheet" href="css/diary.css">
    <link rel="stylesheet" href="css/custom.css">
    <title>清华附中机器博弈</title>
</head>
<body class="body" id="bb">

<div class="div-b"><img src="http://flamechess.cn/js/xiaoyuan/target.png"></div>
<div class="div-c" id="cc" style="color:#fff;text-align:center;">{{ $user->name ?? $name }}</div>
<div class="div-l" id="ll" style="color:#fff;text-align:left;">
    @foreach ($user->links ?? [] as $link)
        @if (filled($link["link"]))
            <a href="{{ $link["link"] }}" target="_blank">
                <img style="height:36px" src="{{ $link["image"] }}">
            </a>
        @else
            <img style="height:36px" src="{{ $link["image"] }}">
        @endif
        &nbsp;
    @endforeach
</div>
<div class="div-z" id="zz" style="color:#fff;text-align:center;">
    @if (filled($user->seal ?? null))
        <img src="{{ $user->seal }}">
    @endif
</div>

<!-- Search form -->
<img src="img/input.png" class="div-input">
<form name="search-form" method="get" id="search-form-new" class="div-form">
    <span style="color:#6cc;font-size:48px;">&nbsp;&nbsp;</span>
    <input type="text" id="kw" maxlength="80" tabindex="1" size="10" name="id" autocomplete="off" value="{{ $user->id ?? $input }}">
    <script type="text/javascript">document.getElementById('kw').focus();</script>
    <button type="submit" id="search-btn" tabindex="2" class="btn-global">Recording</button>
</form>

<!-- This is a padding -->
<p><span style="font-size:48px;">&nbsp;</span></p>

<div id="content">
    @if ($notfound ?? false)
        <div><img src="img/none.png"></div>
    @else
        @foreach($diaries as $diary)
            <div>
                @if (filled($diary->link ?? null))
                    <a href="{{ $diary->link }}" target="_blank">
                        <img src="{{ $diary->image }}">
                    </a>
                @else
                    <img src="{{ $diary->image }}">
                @endif
            </div>
        @endforeach
    @endif
</div>

<footer class="footer">
    Edited and hosted proudly by <a href="https://www.jingbh.top/">JingBh</a>.
</footer>
</body>
</html>
