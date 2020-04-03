var g_rsize = 60;
var g_row = 6, g_col = 5;

var chesspos =
    "00000" +
    "00000" +
    "00000" +
    "00000" +
    "00000" +
    "0z0Z0";
/*
    "0000000000" +
    "0000000000" +
    "0000000000" +
    "0000000000" +
    "0000000000" +
    "0000000000" +
    "0000000000" +
    "0000000000" +
    "0000000000";// +
*/
var boardrects =
    /*
    '+,3,7,3,7;' + // 1 个矩形 或的关系（在其中），1个矩形 或的关系（但不在其中）
    '-,3,4,3,4;' +   // 切掉右下角的空格。
    '-,6,7,3,4;' +  // 切掉右下角的空格。
    '-,3,4,6,7;' +  // 切掉右下角的空格。
    '-,6,7,5,7;' +// 切掉右下角的空格。
    '-,5,6,6,7;' // 切掉右下角的空格。
    */
    /*
        "0000000000" +
        "0000000000" +
        "0000000000" +
        "0000000000" +
        "0000000000" +
        "0000000000" +
        "0000000000" +
        "0000000000" +
        "0000000000";
    */
    "00000" +
    "00000" +
    "00000" +
    "00000" +
    "00000" +
    "00000";

var globalscript = '#037;' + // var divEcolor
    'false;' +  // "divx" <img src="./xiaoyuan/transcube.png"/>
    'true,../16/;' + // "divd" <a href="./index.html"><img src="./xiaoyuan/yu100.png"/></a>
    '131,云棋盘3.0六六吉祥;' + // <title>火焰棋#40.谁先走出广场2vs2</title>
    '六六吉祥,云棋盘，作为火种队辅助训练的设备，肩负着让大山中的孩子走出来的使命。历经了1.0的开源Arduino版，2.0的NFC模块版，2.5的专用芯片版，和现在的更强适配能力的HexRect版;' +       // divc.innerText = "小白③号" //nm;
    'CCG,fc100,ccb,66;' + // <div id="aa" class="div-a">
    'false;' + // clrcheck = true.
    ',z,Z;' + // go for HEX. // no move, r=z, b=Z,
    'rect;' +  // hex or rect
    ';' +  // size
    ';'    // pc
;

/*
scritpt for flamechess rule defination.
 */

// var fcs_zu = {r:'z',b:'Z',name:'zu',script:'123456789'};

var fcscript = // new Array(2);
//fcs[0] = {r:'z',b:'Z',name:'zu',
    'z,Z,zu,2,;' +
    //    script:
    '&&,1,-5,只能移动到空格内。;' +
    '!=,t,undefined;' +
    // 不能移动到对方棋子，不能吃子。
    //    if ( t != undefined && t.type == "zu") return -3;

    '&&,1,-5,不能跳跃棋子，起点和终点间不能有其他棋子。;' +
    '!=,jumpX,1;' +
    //var cnt = countLineChess(prepos, pos)
    //if (cnt == 1 ) return 0
    //else return -5


    //            };
    //fcs[1] = {r:'b',b:'B',name:'bing',script:'123456789'};
    //}
    'b,B,bing,0,;'
;

var fcscriptpapers = // new Array(2);

    'RECTpaper.png,六六吉祥;' +
    'RECTpaper2.png,五行棋;' +
    'RECTpaper3.png,四方棋;' +
    'RECTpaper4.png,四方棋二;'
;
