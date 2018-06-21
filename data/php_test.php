<?php

// $get = $_GET['action'];
// echo $get;


$cards = array(123456789, 987654321, 456987123, 654789321, 987123456, 654123987, 963258741, 258741369, 'djura');
header("Content-Type: text/xml");
$xml = "<?xml version='1.0'?><response>";
foreach ($cards as $card) {
	$xml .= "<card>".$card."</card>";
}
$xml .= "</response>";
echo $xml;

