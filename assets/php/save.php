<?php

if (isset($GLOBALS['HTTP_RAW_POST_DATA']))
{
	// Get the data
	$imageData=$GLOBALS['HTTP_RAW_POST_DATA'];

	// Remove the headers (data:,) part.  
	// A real application should use them according to needs such as to check image type
	$filteredData=substr($imageData, strpos($imageData, ",")+1);

	// Need to decode before saving since the data we received is already base64 encoded
	$unencodedData=base64_decode($filteredData);

	//echo "unencodedData".$unencodedData;

	// Save file.  This example uses a hard coded filename for testing, 
	// but a real application can specify filename in POST variable
	$id = md5(uniqid(time() + mt_rand(0, 100000000), true));
	file_put_contents("/tmp/snapshot_".$id.".png", $unencodedData);
	echo $id;
}

?>