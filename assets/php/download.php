<?php

$id = $_GET["id"];

header('Content-type', 'octet/stream');
header('Content-disposition: attachment; filename=snapshot.png;');
readfile("/tmp/snapshot_".$id.".png");
unlink("/tmp/snapshot_".$id.".png");

?>