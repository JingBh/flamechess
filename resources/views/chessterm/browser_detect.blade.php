<div class="container-fluid position-fixed" style="z-index:1000000;">
    @if (\hisorange\BrowserDetect\Parser::isIEVersion(11))
        <p class="text-warning"><strong>警告：</strong>这个浏览器太旧了，建议换个<strong>现代的</strong>浏览器。</p>
    @elseif (\hisorange\BrowserDetect\Parser::isIE())
        <p class="text-danger"><em>真难以想象这么旧的浏览器的为什么还能用...</em></p>
    @endif
    <noscript class="text-danger">要<strong>启用 JavaScript </strong>才能打开 ChessTerm。</noscript>
</div>
