<?php

if (isset($GLOBALS['HTTP_RAW_POST_DATA']))
{
	$imageData=$GLOBALS['HTTP_RAW_POST_DATA'];

	$filteredData=substr($imageData, strpos($imageData, ",")+1);

	$unencodedData=base64_decode($filteredData);

	$id = md5(uniqid(time() + mt_rand(0, 100000000), true));
	file_put_contents("/tmp/snapshot_".$id.".png", $unencodedData);
	echo $id;
}

?>