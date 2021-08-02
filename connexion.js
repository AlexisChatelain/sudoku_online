if (document.getElementById("ok").value=="0" && document.getElementById("new_game").value!='new_game'){
	document.getElementById("ok").value=1; 	
	document.getElementById("myForm").submit();
}
if (document.getElementById("new_game").value=='new_game'){
document.getElementById("col1").hidden=true;
document.getElementById("niveau").hidden=false;
}
function bouger(){
	x=x+1;
	document.getElementById("div_avion").style="margin-left:"+x+"px;";
	setTimeout(bouger, 0.0016); //millisecondes
	if (x>=window.innerWidth-largeur_avion)
	if (x>window.innerWidth){
		x=-largeur_avion;
		document.getElementById("div_avion").width=largeur_avion;
	}else{
		document.getElementById("div_avion").width=document.getElementById("div_avion").width-1;
		document.getElementById("div_avion").height=hauteur_avion;
	}
}
largeur_avion=document.getElementById("avion").width;
x=-largeur_avion;
hauteur_avion=document.getElementById("avion").height;
setTimeout(bouger, 0.0016); //millisecondes

document.getElementById("seconnecter").onclick = function(){
	document.getElementById("col2").hidden=true;
	document.getElementById("col3").hidden=false;
}
document.getElementById("sinscrire").onclick = function(){
	document.getElementById("col2").hidden=true;
	document.getElementById("col3").hidden=false;
	document.getElementById("label_oubli").hidden=true;
	document.getElementById("oubli").hidden=true;
	document.getElementById("fin_connexion").hidden=true;
	document.getElementById("fin_inscription").hidden=false;
}
document.getElementById("oubli").onchange = function(){
	document.getElementById("fin_connexion").hidden=true;
	document.getElementById("fin_inscription").hidden=false;
	document.getElementById("envoi_code").hidden=true;
	document.getElementById("div_connexion_oubli").hidden=false;	
	document.getElementById("label_oubli").hidden=true;	
	document.getElementById("mdp").placeholder="Votre nouveau mot de passe ...";
	document.getElementById("label_mdp").innerText="Votre nouveau mot de passe : ";
	document.getElementById("question").disabled=true;
	document.getElementById("question").placeholder="Inconnue";
}
document.getElementById("pseudo").onchange = function(){
	if (document.getElementById("fin_inscription").hidden || document.getElementById("fin_inscription").hidden!=true && document.getElementById("envoi_code").hidden   ){
		var data = 'pseudo='+encodeURIComponent(document.getElementById("pseudo").value)+'&question';
		$.ajax({
		  type: "POST",
		  url: "verif_mail.php",
		  data: data,
		  success: function(msg) {
				if (msg != 'Rien') 
					document.getElementById("question").value=msg;
			}
		})
	}
}
document.getElementById("nouvelle").onclick = function(){
document.getElementById("col1").hidden=true;
document.getElementById("niveau").hidden=false;
}
function jouer(str_mode){
document.getElementById("mode").value=str_mode;
document.getElementById("largeur").value=window.innerWidth;
document.getElementById("hauteur").value=window.innerHeight;
document.getElementById("envoimode").submit();
}
jQuery(document).ready(function($) {
		
	$('#valider_inscription').click(function() {
		var data = 'pseudo='+encodeURIComponent(document.getElementById("pseudo").value)+'&code=' + document.getElementById("code").value;
		$.ajax({
		  type: "POST",
		  url: "verif_mail.php",
		  data: data,
		  success: function(msg) {
				if (msg == 'Code incorrect') {		
					document.getElementById("code").value="Le code est incorrect";
				}else if (msg == 'Code correct') {					
					$('#connexion').click();
				}else{						
					alert("Erreur inconnue, veuillez réessayer plus tard.");
				}
			}
		})		
	})
	$('#deconnexion').click(function() {	
		$.ajax({
		  type: "GET",
		  url: "ConnexionClass.php",
		  data: "logout",
		  success: function(msg) {	
					document.getElementById("myForm").submit();
				}
		})
	})
	
	$('#connexion').click(function() {	
		go=1;
		if (document.getElementById("maj").value==1){
			if (document.getElementById("question").value==""){
				alert("Merci de saisir une question secrète obligatoire qui servira en cas d'oubli de votre mot de passe.");
				go=0;				
			}else if (document.getElementById("reponse").value==""){
					alert("Merci de saisir une réponse à votre question secrète obligatoire qui servira en cas d'oubli de votre mot de passe.");
					go=0;
			}else 
				go=2;
		}
		if (go!=0){
			if (go==2)
				var data = 'pseudo=' + encodeURIComponent(document.getElementById("pseudo").value) + '&login=1&mdp=' + encodeURIComponent(document.getElementById("mdp").value)	+'&question=' + encodeURIComponent(document.getElementById("question").value)+'&reponse=' + encodeURIComponent(document.getElementById("reponse").value);
			else			
				var data = 'pseudo=' + encodeURIComponent(document.getElementById("pseudo").value) + '&login=1&mdp=' + encodeURIComponent(document.getElementById("mdp").value);
			$.ajax({
			  type: "POST",
			  url: "ConnexionClass.php",
			  data: data,
			  success: function(msg) {
					if (msg != 'OK') {	
						alert(msg);
						if (msg=="Vous n'avez pas entré le code reçu par mail pour vérifier que vous n'êtes pas un robot, il ne vous le sera pas renvoyé ! Si vous n'avez pas reçu le mail, vérifiez dans vos spams/courriers indésirables."){
							document.getElementById("div_inscription").hidden=true;
							document.getElementById("col3").hidden=true;
							document.getElementById("div_code").hidden=false;
						}else if (msg=="Mise à jour obligatoire du compte : merci d'indiquer une question secrète et sa réponse qui serviront en cas d'oubli de votre mot de passe."){
							document.getElementById("fin_inscription").hidden=false;
							document.getElementById("label_mail").hidden=true;
							document.getElementById("mail").hidden=true;			
							document.getElementById("envoi_code").hidden=true;
							document.getElementById("maj").value=1;
						}
					}else{		
						document.getElementById("myForm").submit();
					}
				}
			})
		}
	})
		$('#connexion_oubli').click(function() {
		var reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,99})$/;
		if (document.getElementById("pseudo").value==""){
			alert("Merci de saisir un pseudo");
		}else{
			if (document.getElementById("mdp").value==""){
				alert("Merci de saisir un mot de passe.");
			}else{
				if (document.getElementById("mail").value==""){
					alert("Merci de saisir une adresse mail.");
				}else{
					if (document.getElementById("reponse").value==""){
						alert("Merci de saisir une réponse à votre question secrète.");
					}else{			
						if (!reg.test(document.getElementById("mdp").value)){
							alert("Merci de renseigner un mot de passe de 8 caractères minimum (Majuscules, minuscules, nombres et caractères spéciaux (-+!*$@%_) requis).");
						}else{		
							var data = 'oubli&pseudo=' + encodeURIComponent(document.getElementById("pseudo").value) + '&mdp=' + encodeURIComponent(document.getElementById("mdp").value) +
										'&mail=' + encodeURIComponent(document.getElementById("mail").value) + '&question=' + encodeURIComponent(document.getElementById("question").value)
										+ '&reponse=' + encodeURIComponent(document.getElementById("reponse").value);
							$.ajax({
							  type: "POST",
							  url: "verif_mail.php",
							  data: data,
							  success: function(msg) {
									if (msg == 'Le message a bien été envoyé !<br>') {				
										$('#connexion').click();
									}else{
										alert(msg);
									}
								}
							})
						}
					}
				}
			}
		}
	});
	$('#envoi_code').click(function() {
		var reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;
		var reg2 =/^[a-zA-Z0-9-\.]+@[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,6}$/;
		if (document.getElementById("pseudo").value==""){
			alert("Merci de saisir un pseudo");
		}else{
			if (document.getElementById("mdp").value==""){
				alert("Merci de saisir un mot de passe.");
			}else{
				if (document.getElementById("mail").value==""){
					alert("Merci de saisir une adresse mail.");
				}else{
					if (document.getElementById("question").value==""){
						alert("Merci de saisir une question secrète obligatoire qui servira en cas d'oubli de votre mot de passe.");
					}else{
						if (document.getElementById("reponse").value==""){
							alert("Merci de saisir une réponse à votre question secrète obligatoire qui servira en cas d'oubli de votre mot de passe.");
						}else{			
							if (!reg.test(document.getElementById("mdp").value)){
								alert("Merci de renseigner un mot de passe de 8 caractères minimum (Majuscules, minuscules, nombres et caractères spéciaux (-+!*$@%_) requis).");
							}else{			
								if (!reg2.test(document.getElementById("mail").value)){
									alert("Merci de renseigner une adresse mail valide.");
								}else{	
									var data = 'pseudo=' + encodeURIComponent(document.getElementById("pseudo").value) + '&mdp=' + encodeURIComponent(document.getElementById("mdp").value) +
												'&mail=' + encodeURIComponent(document.getElementById("mail").value) + '&question=' + encodeURIComponent(document.getElementById("question").value)
												+ '&reponse=' + encodeURIComponent(document.getElementById("reponse").value);
									$.ajax({
									  type: "POST",
									  url: "verif_mail.php",
									  data: data,
									  success: function(msg) {
											if (msg == 'Pas ok') {		
												alert("L'adresse mail saisie est déjà attribuée à un compte, merci de renseigner une autre adresse mail.");
											}else if (msg == 'Pseudo pas libre') {	
												alert("Le pseudo saisi est déjà attribué à un compte, merci de renseigner un autre pseudo.");								
											}else if (msg == '503') {	
												alert("Erreur interne, veuillez réessayer plus tard.");
											}else if (msg == 'Le message a bien été envoyé !<br>') {	
												document.getElementById("div_inscription").hidden=true;
												document.getElementById("div_code").hidden=false;
											}else{
												alert("Erreur inconnue, veuillez réessayer plus tard.");
											}
										}
									})
								}
							}
						}
					}
				}
			}
		}
	});
});