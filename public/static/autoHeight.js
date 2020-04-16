window.setInterval(function() {
    var iframe = window.frameElement;
    iframe.parentElement.style.height = iframe.contentWindow.document.body.scrollHeight + 16 + "px";
}, 100);
