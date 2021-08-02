<!DOCTYPE html>
<html lang="fr">
	<head>
	<title>Sudoku</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width">	
	<link href="sudoku.css" rel="stylesheet">
	</head>
	<?php require_once("ConnexionClass.php"); $login = new Login(); ?>
<body>
<div class="div_avion" id="div_avion">
    <img id="avion" alt="avion" src="avion.png">
  </div>
  <div id="slogan">
	<h2 class='accueil'>Votre logique vous permettra-elle de le réussir ?</h2> 
</div>	

  <?php  
  if($login->isUserLoggedIn()) echo "<br><h2 class='accueil' id='bonjour'>Bonjour ".$_SESSION["pseudo"].", faites votre choix.</h2>"; else echo "<br><br>"; ?>
	<div id="col1"  <?php if(!$login->isUserLoggedIn()) echo "hidden"; ?>>
		<div id="nouvelle" class="bouton">Nouvelle partie</div>
		<div <?php if($login->isUserLoggedIn()){ 		
		require_once("db_file.php");
		$restauration = $db->query("SELECT niveau FROM sudoku WHERE pseudo='{$_SESSION['pseudo']}'")->fetch_array()[0];		
		if ($restauration==0) echo "hidden";} ?> onclick="jouer('Restauration');" id="restauration" class="bouton">Partie en cours</div>
		<div id="deconnexion" class="bouton">Se déconnecter</div>
	</div>
	<div id="col2" <?php if($login->isUserLoggedIn()) echo "hidden"; ?>>
		<div id="seconnecter" class="bouton">SE CONNECTER</div>
		<div id="sinscrire" class="bouton">S'INSCRIRE</div>	
	</div>
	<form id="myForm" action="connexion.php" method="post" >
	<div id="col3" hidden>		
		<input type="hidden" id="ok" name="ok" value="<?php if (isset($_POST["ok"])) echo 1; else echo 0; ?>" />
		<input type="hidden" id="maj" value="" />
		<div id="div_inscription" >
		<label>Votre pseudo : <input id="pseudo" name="pseudo" type="text" placeholder="Tapez votre pseudo..." /></label>
		<br><label for='mdp' id='label_mdp'>Votre mot de passe : </label><input id="mdp" name="mdp" type="password" placeholder="Tapez votre mot de passe..." />
		<br><label class="connexion"><input type='checkbox' onchange='if (document.getElementById("mdp").type=="password") document.getElementById("mdp").type="text"; else document.getElementById("mdp").type="password";'>Afficher le mot de passe </label>	
		<br><label class="connexion" id="label_oubli" ><input type='checkbox' id="oubli">Mot de passe oublié</label>	
		<div hidden id="fin_inscription">
			<label id="label_question">Votre question secrète : <input id="question" name="question" type="text" placeholder="Tapez votre question..." /></label>
			<br><label id="label_reponse">Votre réponse à la question secrète : <input id="reponse" name="reponse" type="text" placeholder="Tapez la réponse ..." /></label>			
			<br><label id="label_mail">Votre email : <input id="mail" name="mail" type="email" placeholder="Tapez votre email..." /></label>
			
			<div id="envoi_code" class="bouton">Soumettre l'inscription</div>
			</div>
		</div>
		<div id="fin_connexion">
			<div id="connexion" class="bouton">Se connecter</div>
			</div>
		<div hidden id="div_connexion_oubli">
			<div id="connexion_oubli" class="bouton">Se connecter</div>
		</div>
	</div>
		<div hidden id="div_code">
		<br><label id="label_code">Votre code : <input id="code" name="code" maxlength="15" type="text" placeholder="Tapez le code reçu par mail..." /></label>
		<div id="valider_inscription" class="bouton">Valider l'inscription</div>	
		</div>
		<div hidden id="niveau" >		
		<div onclick="jouer('Facile');" id="facile" class="bouton">Facile</div>
		<div onclick="jouer('Moyen');" id="moyen" class="bouton">Moyen</div>
		<div onclick="jouer('Difficile');" id="diffficile" class="bouton">Difficile</div>
		</div>
		</form>
		<form id="envoimode" action="/sudoku/" method="post" >
		<input type="hidden" id="mode" name="mode" value="" />
		<input type="hidden" id="largeur" name="largeur" value="" />
		<input type="hidden" id="hauteur" name="hauteur" value="" />
		
		</form>
		<?php
			if (isset($_POST['new_game']))
		echo "<input type='hidden' id='new_game' value='new_game'>";
	else 
		echo "<input type='hidden' id='new_game' value=''>";  ?>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="connexion.js"></script>
	</body>
</html>