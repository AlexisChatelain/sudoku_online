<?php
	define('DB_HOST','localhost');
	define('DB_USER','nom_utilisateur');
	define('DB_PASS','mot_de_passe');
	define('DB_NAME','nom_projet');  

    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	$db->set_charset("utf8");
	
	if($db->connect_errno){
		http_response_code(500);
		die();
	} 
?>