<?php
require_once("conn.php");//引用数据库链接文件
$i= $_GET['i'];//GET方法为URL参数传递

$idnum = '131';
//echo $idnum;
//echo "<br>";
$idcmd = $_GET['id'];
//echo $idcmd;
//echo "<br>";
//echo $idnum.$idcmd;
//echo "<br>";
$id = $idnum.$idcmd;
//echo $id."<br>";

if ( strlen($i) > 0 )
{

//echo "0<br>";
//echo "" . $i. "<br>";

//INSERT INTO `ccbiii` (`BDID`, `CLOCK`) VALUES ('106', '000000000000000ZZZ0000z00ZZZ000ZZZ0ZZZ000Z0Z0ZZZ000ZZZ0ZZZ0000z00Z000000000000000000000000');
//$sql = "INSERT INTO ccbiii(BDID, CLOCK) VALUES (106,'$i');";

//UPDATE `ccbiii` SET `BDID`='106',`CLOCK`='z00000000000000ZZZ0000z00ZZZ000ZZZ0ZZZ000Z0Z0ZZZ000ZZZ0ZZZ0000z00Z000000000000000000000000' WHERE `BDID`='106'
$sql = "UPDATE ccbiii SET BDID='$id', CLOCK='$i' WHERE BDID='$id';";

//SELECT * FROM `ccbiii` WHERE `BDID`='106'
//$sql = "SELECT * FROM `ccbiii` WHERE `BDID`='106'";

mysql_query($sql);//借SQL语句插入数据

}// else {

//echo "1<br>";

//SELECT * FROM `ccbiii` WHERE `BDID`='106'
$sql = "SELECT * FROM `ccbiii` WHERE `BDID`='$id'";

$result = mysql_query($sql); //借SQL语句插入数据
 

if ( mysql_num_rows($result) > 0) {
    // 输出数据
    while( $row = mysql_fetch_assoc( $result ) ) {

//        echo "time: " . $row["time"]. " - wnan: " . $row["wnan"]. " " . $row["time"]. "<br>";
          echo "" . $row["CLOCK"]. "<br>";
    }
}// else {
//    echo "0";
//}

//}

mysql_close();//关闭MySQL连接
// echo '".$id.'<p>' written.<br>";
// echo "<p align='center'><font color='#6CC'; size=26px;>".$_GET['id']."&nbsp</font></p>";
//echo $query;
?>