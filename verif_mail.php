<?php		
require_once("db_file.php");
if (isset($_POST["solution"])){
	require_once("ConnexionClass.php"); 
	$login = new Login();
	echo $db->query("SELECT grille1 FROM sudoku WHERE id_user=".$_SESSION["id"])->fetch_array()[0];
}else if (isset($_POST["grille"]) && isset($_POST["niveau"])){
	require_once("ConnexionClass.php"); 
	$login = new Login();
	echo $db->query("UPDATE sudoku SET grille3='".$_POST['grille']."', niveau=".$_POST['niveau'].", score=".$_POST['score'].", record=".$_POST['record'].", temps='".$_POST['temps']."', son=".$_POST['son'].", options=".$_POST['options']." WHERE id_user=".$_SESSION['id']);
}else if (isset($_POST["code"]) && isset($_POST["pseudo"])){
	$pseudo = urldecode($_POST['pseudo']);
	$resultat = $db->query("SELECT confirmation FROM sudoku WHERE pseudo='{$pseudo}'");
	$row = $resultat->fetch_object();
	if ($_POST["code"]==$row->confirmation){
		$db->query("UPDATE sudoku SET confirmation='OK' WHERE pseudo='{$_POST['pseudo']}'");
		echo "Code correct";
	}else{
		echo "Code incorrect";
	}
}else if (isset($_POST["question"]) && isset($_POST["oubli"])){
	$pseudo = urldecode($_POST['pseudo']);		
	$mail = urldecode($_POST['mail']);
	$mdp = urldecode($_POST['mdp']);
	$question = urldecode($_POST['question']);
	$reponse = urldecode($_POST['reponse']);
	$mdp_hash = password_hash($mdp, PASSWORD_DEFAULT);			
	
	$result=$db->query("SELECT reponse FROM sudoku WHERE pseudo='{$pseudo}' and mail='{$mail}' and question='{$question}'");	
	if($result->num_rows==1)
		if (password_verify($reponse, $result->fetch_object()->reponse)){
			$db->query("UPDATE sudoku SET mdp='".$mdp_hash."' WHERE pseudo='{$_POST['pseudo']}'");
			require('mail.php');
			$adress = array($mail, $pseudo, "");
			$subject = 'Votre mot de passe Sudoku a bien été modifié';
			$body = '<html>
			<head>
			<title>Confirmation de votre inscription</title>	   
			<meta charset="UTF-8" />
			</head>
			<body>	  
			<p>Bonjour '.$pseudo.',<br>
			Ceci est un message automatique envoyé par le site d\'Alexis Chatelain.<br>
			Votre mot de passe Sudoku a bien été modifié à l\'instant<br>
			Si vous n\'êtes pas à l\'origine de ce changement, écrivez vite un message <a href="http://alexischatelain.freeboxos.fr/#contact">en cliquant vite sur ce lien (http://alexischatelain.freeboxos.fr/</a>)<br>
			Merci de ne pas répondre à ce mail :)<br>
			</p>
			</body>
			</html>';
			$alt='(logo du club) 
			Bonjour '.$pseudo.',
			Ceci est un message texte automatique envoyé par le site d\'Alexis Chatelain.
			Votre mot de passe Sudoku a bien été modifié à l\'instant<br>		
			Si vous n\'êtes pas à l\'origine de ce changement, écrivez vite un message ici : http://alexischatelain.freeboxos.fr )<br>
			Merci de ne pas répondre à ce mail :)';				
			sendMail($construction_mail, $adress, $subject, $body, $alt, true, "Sudoku");
		}else{		
			echo "La réponse à la question secrète est incorrecte.";
	}else{
		$result=$db->query("SELECT id_user FROM sudoku WHERE pseudo='{$pseudo}' and mail='{$mail}'");	
		if($result->num_rows==0)
			echo "Le mail saisi n'est pas associé à ce pseudo.";
		else {
			$result=$db->query("SELECT id_user FROM sudoku WHERE pseudo='{$pseudo}' and question='{$question}'");	
			if($result->num_rows==0)
				echo "La question n'est pas associée à ce pseudo. Veuillez réessayer ultérieurement.";
			else {
				echo "Les informations saisies ne nous permettent pas de vous connecter, veuillez réessayer.";
			}
		}
	}
}else if (isset($_POST["mail"]) && isset($_POST["pseudo"])){
	$pseudo = urldecode($_POST['pseudo']);
	$query = "SELECT pseudo FROM sudoku WHERE pseudo='{$pseudo}'";
	$resultat = $db->query($query);
	if($resultat->num_rows!=0){
		echo "Pseudo pas libre";
	}else{
		$mail = urldecode($_POST['mail']);
		$query = "SELECT mail FROM sudoku WHERE mail='{$mail}'";
		$resultat = $db->query($query);
		if($resultat->num_rows!=0){
			echo "Pas ok";
		}else{
			$mdp = urldecode($_POST['mdp']);
			$question = urldecode($_POST['question']);
			$reponse = urldecode($_POST['reponse']);
			$mdp_hash = password_hash($mdp, PASSWORD_DEFAULT);			
			$reponse_hash = password_hash($reponse, PASSWORD_DEFAULT);				
			if (!$db->connect_errno) {
				$code="";
				for ($i=0; $i<15; $i++)
					$code.= chr(rand(65, 90));
				$query_new_user = $db->query("INSERT INTO sudoku (pseudo, confirmation, mail, mdp, question, reponse, grille1, grille2, grille3, niveau, score, record, temps, son, options) 
				VALUES('".$pseudo."', '" . $code . "', '" . $mail . "', '" . $mdp_hash . "', '" . $question . "', '" . $reponse_hash . "',0,0,0,0,0,0,'00:00:00',1,0);");
				if ($query_new_user) {
					require('../config/mail.php');
					$adress = array($mail, $pseudo, "");
					$subject = 'Confirmation de votre inscription';
					$body = '<html>
					<head>
					<title>Confirmation de votre inscription</title>	   
					<meta charset="UTF-8" />
					</head>
					<body>	  
					<p>Bonjour '.$pseudo.',<br>
					Ceci est un message automatique envoyé par le site d\'Alexis Chatelain.<br>
					Voici le code pour confirmer votre inscription  : '.$code.'<br>
					Merci de ne pas répondre à ce mail :)<br>
					</p>
					</body>
					</html>';
					$alt='(logo du club) 
					Bonjour '.$pseudo.',
					Ceci est un message texte automatique envoyé par le site d\'Alexis Chatelain.
					Voici le code pour confirmer votre inscription : '.$code.'
					Merci de ne pas répondre à ce mail :)';				
					sendMail($construction_mail, $adress, $subject, $body, $alt, true, "Sudoku");
				} else 						
					echo "503";
			} else 						
				echo "503";		
		}
	}
	$db->close();
}else if (isset($_POST["question"]) && isset($_POST["pseudo"])){
	$pseudo = urldecode($_POST['pseudo']);
	$result=$db->query("SELECT question FROM sudoku WHERE pseudo='{$pseudo}'");	
	if($result->num_rows!=0)
		echo $result->fetch_array()[0];
	else 
		echo "Rien";
}