function init_chessrecord( pi, fn )
{
    var request = new XMLHttpRequest();
    request.open('GET', "../../../diary/img/10560/"+pi+"/"+fn+".txt", true);
    //地址替换为自己dat文件的地址
    request.responseType = 'blob';
    request.onload = function () {
        var reader = new FileReader();
        reader.readAsText(request.response);
        reader.onload=function(e)
        {
            // console.log("DAT_data:" + this.result);
            convertF2page( this.result );
        }

    };
    request.send();
}

var lnsOflog2pyPages = -1;
var log2pyPages = null;

function convertF2page( f )
{
    if ( lnsOflog2pyPages != -1 ) return;
    if ( log2pyPages != null ) return;
    log2pyPages = new Array();
    lnsOflog2pyPages = 0;
    var laststart = 0;
    for ( var i = 0; i<f.length; i ++ )
    {
        if ( f[i] == '\n' ) {
            log2pyPages[lnsOflog2pyPages] = f.substring( laststart, i-1 );
            lnsOflog2pyPages ++;
            laststart = i+1;
        }   }
    if ( lnsOflog2pyPages == log2pyPages.length )
        lnsOflog2pyPages = 1;
}
//==============
// 重点看文件读入的部分，把棋盘布局的文件通过url参数的方式传递给前端，绘制棋盘。
// 这样通过连接，就可以分享，实现网络对弈啦。


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

var idstr = getQueryString("code");

if (idstr != null && idstr != "") {
    cmdstr += "code=" + idstr; // 10253;
    xmlhttp.open("GET", cmdstr, true);
    xmlhttp.send();
}

// 这个url参数读入：
// https://wx.qq.com/?&lang=zh_CN ；类似这个。
