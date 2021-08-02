document.getElementById("checkbox").onchange=function(){
if (document.getElementById("checkbox").checked)
	document.getElementById("options").hidden=false;
else
	document.getElementById("options").hidden=true;
}
document.getElementById("debut").value=Date.now();
document.getElementById("score_debut").value=document.getElementById("score").innerText;

function affich_message(msg){
	document.getElementById("hist5").innerText=document.getElementById("hist4").innerText;
	document.getElementById("hist4").innerText=document.getElementById("hist3").innerText;
	document.getElementById("hist3").innerText=document.getElementById("hist2").innerText;
	document.getElementById("hist2").innerText=document.getElementById("hist1").innerText;
	document.getElementById("hist1").innerText=document.getElementById("message").innerText;
	document.getElementById("message").innerText=document.getElementById("heure").innerText + " " + msg;
}
function sauvegarde(){
	str_grille="";
	for(i=1;i<=81;i++){
		num=document.getElementById(i).innerText;
		if (num=="")
			num=0;
		str_grille = str_grille + num;
	}
	
	if (document.getElementById("niveau").innerText == "Facile")
		level=1;
	else if (document.getElementById("niveau").innerText == "Difficile")
		level=3;	
	else 
		level=2;
	le_score=parseInt(document.getElementById("score").innerText);
	le_record=parseInt(document.getElementById("record").innerText.substring(19));
	le_temps=document.getElementById("temps").innerText.substring(15);
	
		if (document.querySelector('#audio').volume==0 || document.querySelector('#audio').muted || document.querySelector('#audio').paused)
		son=0;
	else
		son=1;
	if (document.getElementById("checkbox").checked)
		choix_options=1;
	else 
		choix_options=0;
	retour = jQuery(document).ready(function($) {
		$.ajax({
		  type: "POST",
		  url: "verif_mail.php",
		  data: "grille="+str_grille+"&niveau="+level+"&score="+le_score+"&record="+le_record+"&temps="+le_temps+"&son="+son+"&options="+choix_options,
		  success: function(msg) {
				if (msg == true){
					affich_message("Sauvegarde réussie");
					return true;
				}else{
					affich_message("Echec de la sauvegarde, veuillez recommencer");
					return false;
				}
			}
		})		
	})
	return retour;
}
function solution(){
	if(confirm("Voulez-vous vraiment afficher la solution ? Nous aurez alors 0 pt.")){		
		jQuery(document).ready(function($) {
			$.ajax({
			  type: "POST",
			  url: "verif_mail.php",
			  data: "solution",
			  success: function(msg) {
					fin_solution(msg);
				}
			})
		})
	}
}
function fin_solution(grille_solution){		
	for (i=1;i<=81;i++)
		document.getElementById(i).innerText=grille_solution.slice(i-1,i);	
	document.getElementById("score_debut").value=0;	
	document.getElementById("score").innerText=0;	
	affich_message("Perdu ! Vous avez 0 point.");
}
function accueil(){
	if(confirm("Voulez-vous sauvegarder avant de revenir à l'accueil ?")){		
		if (sauvegarde())
			document.location.href="connexion.php"; 
	}else
		document.location.href="connexion.php"; 
}
function nouvelle_partie(){
	if(confirm("Voulez-vous vraiment créer une nouvelle partie ? Attention, l'actuelle sera définitivement supprimée !")){
		form_nouvelle_partie.submit();	
	}
}
function deconnexion(){
	if(confirm("Voulez-vous sauvegarder avant de vous déconnecter ?")){	
		if (sauvegarde()){
			jQuery(document).ready(function($) {		
					$.ajax({
					  type: "GET",
					  url: "ConnexionClass.php",
					  data: "logout",
					  success: function(msg) {	
							affich_message("Vous êtes déconnecté");
							}
					})
			})
			document.location.href="connexion.php"; 			
		}
	}else{
		jQuery(document).ready(function($) {		
			$.ajax({
			  type: "GET",
			  url: "ConnexionClass.php",
			  data: "logout",
			  success: function(msg) {	
					affich_message("Vous êtes déconnecté");
					}
			})
		})
	document.location.href="connexion.php";
	} 	
}
function verif(){
	total=0;
	for(j=1;j<=9;j++){
		lignes=document.getElementsByClassName("l"+j);
		colonnes=document.getElementsByClassName("c"+j);
		carres=document.getElementsByClassName("ca"+j);
		tot_ligne=0;
		tot_colonne=0;
		tot_carre=0;
		for(i=0;i<9;i++){
			if (lignes[i].innerText!="")
				tot_ligne+=parseInt(lignes[i].innerText);
			if (colonnes[i].innerText!="")
				tot_colonne+=parseInt(colonnes[i].innerText);
			if (carres[i].innerText!="")
				tot_carre+=parseInt(carres[i].innerText);
		}
		if (tot_ligne == 45)
			total+=1;
		if (tot_colonne == 45)
			total+=1;
		if (tot_carre == 45)
			total+=1;
	}
	if (total!=27)
		affich_message("Sudoku incorrect (" + total +"/27)");
	else{
		if (parseInt(document.getElementById("score").innerText)!=0){
			if (parseInt(document.getElementById("record").innerText.substring(19)) < parseInt(document.getElementById("score").innerText)){
				document.getElementById("record").innerText="Record personnel : " + document.getElementById("score").innerText;							
				sauvegarde();
			}
			setTimeout(felicitations, 500); //millisecondes
		}else{
			affich_message("Sudoku correct.");
		}		
		setTimeout(rejouer, 2000); //millisecondes
	}
}
function felicitations(){
	affich_message("Félicitations ! Sudoku réussi.");
}
function rejouer(){
	if(confirm("Voulez-vous rejouer ?")){		
		form_nouvelle_partie.submit();	
	}
}
function fonction(){
	var ladate=new Date();
	if (ladate.getHours()<10)
		heures="0"+ladate.getHours();
	else
		heures=ladate.getHours();
	if (ladate.getMinutes()<10)
		minutes="0"+ladate.getMinutes();
	else
		minutes=ladate.getMinutes();
	if (ladate.getSeconds()<10)
		secondes="0"+ladate.getSeconds();
	else
		secondes=ladate.getSeconds();
	
	document.getElementById("heure").innerText=heures+":"+minutes+":"+secondes;
	if (parseInt(document.getElementById("score_debut").value)-parseInt((Date.now()-document.getElementById("debut").value)/1000)<0){
		document.getElementById("score").innerText="0";			
		if (document.getElementById("score_debut").value!=0){
			document.getElementById("score_debut").value=0;		
			affich_message("Perdu ! Vous avez 0 point.");
		}
	}else 
		document.getElementById("score").innerText=parseInt(document.getElementById("score_debut").value)-parseInt((Date.now()-document.getElementById("debut").value)/1000);
	secondes=parseInt((Date.now()-document.getElementById("debut").value)/1000)+parseInt(document.getElementById("temps_origine").value.slice(0, 2))*60*60+parseInt(document.getElementById("temps_origine").value.slice(3, 5))*60+parseInt(document.getElementById("temps_origine").value.slice(6, 8));
	minutes=parseInt(secondes/60);
	heures=parseInt(minutes/60);
	minutes=minutes-heures*60;
	secondes=secondes-heures*60*60-minutes*60;
	if (heures<10)
		heures="0"+heures;
	if (minutes<10)
		minutes="0"+minutes;
	if (secondes<10)
		secondes="0"+secondes;
	document.getElementById("temps").innerText="Temps de jeu : "+heures+":"+minutes+":"+secondes;	
	if (parseInt(document.getElementById("largeur_ecran").value)!=window.innerWidth || parseInt(document.getElementById("hauteur_ecran").value)!=window.innerHeight){
		document.getElementById("largeur_ecran").value=window.innerWidth;
		document.getElementById("hauteur_ecran").value=window.innerHeight;
		redimensionner_page();
	}
	setTimeout(fonction, 1000); //millisecondes
}	
setTimeout(fonction, 1000); //millisecondes
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
document.getElementById("audio").onended = function() {
musique_suivante();
}
document.getElementById("suivante").onclick = function() {
musique_suivante();
}
function musique_suivante(){
	var dispos = [];
	for (i=1;i<12;i++){
		if (document.getElementById("musique0"+i).value=="1"){
			dispos.push(i);
		}
	}
	if (dispos.length==0){
		nb=getRandomInt(11)+1;
		for (i=1;i<12;i++){
			if (nb!=i){
				document.getElementById("musique0"+i).value="1";
			}
		}
	}else {
		alea=getRandomInt(dispos.length);
		nb=dispos[alea];
		document.getElementById("musique0"+nb).value="";
	}
	
	document.getElementById("audio").src="0"+nb+".mp3";
	document.getElementById("musique").innerText="Musique "+nb+" :";
}
var delai;
jQuery(document).ready(function($) {
	$('.s').mousedown(function() {
		delai=Date.now();
	})
	$('.s').click(function() {
		if (this.className.indexOf("case")!=-1){
			old=0;
			if (typeof document.getElementsByClassName("selected")[0] !='undefined'){
				old=suppr_selected(this.id);
			}
			if (this.className.indexOf("selected")!=-1){
				$(this).attr('style','' ); 
				this.className.replace("selected", "");
			}else{			
				$(this).attr('style','border:4pt solid red' ); 
				this.style='border:4pt solid red';				
				this.className=this.className+" selected";
				if(old!=0){
					if (old.indexOf("cell")==-1 && this.className.indexOf("cell")!=-1){
						for (i=1;i<=9;i++){
							if (old.indexOf("case"+i)!=-1)
								this.innerText=i;
						}
					}
				}
			}
		}
	})
	$('.s').mouseup(function() {
		if (Date.now()-delai >=1000){ // 1 seconde
			if (this.className.indexOf("case")!=-1)
				this.innerText="";	
		}
	})
})
function touche(){
	var car = String.fromCharCode(event.keyCode);
	if (car=="1" || car=="2" || car=="3" || car=="4" || car=="5" || car=="6" || car=="7" || car=="8" || car=="9"){
		if (typeof document.getElementsByClassName("selected")[0] !='undefined')
			document.getElementsByClassName("selected")[0].innerText=car;
	}
}
function suppr_selected(id_pas_suppr){
	tout=document.getElementsByClassName("selected");
	for (i=0;i<tout.length;i++){
		if (tout[i].id!=id_pas_suppr){		
			$(tout[i].id).attr('style','border:4pt solid red'); 
			tout[i].style="";
			old=tout[i].className;
			tout[i].className=tout[i].className.replace("selected", "");
		}
	}
	return old;
}
function evenements(){	
	if (event.keyCode==37 || event.keyCode==38 || event.keyCode==39 || event.keyCode==40){
		if (typeof document.getElementsByClassName("selected")[0] !='undefined'){
			num=document.getElementsByClassName("selected")[0].id;
			if (document.getElementById(num).className.indexOf("cell")!=-1){
				if (event.keyCode==37){	// gauche		
					num1=parseInt(num)-1;
					if (parseInt(num)-1<82 && parseInt(num)-1>0 && typeof document.getElementById(num1) !='undefined'){
						if (document.getElementById(num1).className.indexOf("case")!=-1){
							suppr_selected(0);			
							$(num1).attr('style','border:4pt solid red' ); 		
							document.getElementById(num1).style='border:4pt solid red';				
							document.getElementById(num1).className=document.getElementById(num1).className+" selected";
						}
					}
				}else if (event.keyCode==39){	// droite	
					num2=parseInt(num)+1;			
					if (parseInt(num)+1<82 && parseInt(num)+1>0 && typeof document.getElementById(num2) !='undefined'){
						if (document.getElementById(num2).className.indexOf("case")!=-1){
							suppr_selected(0);					
							$(num2).attr('style','border:4pt solid red' ); 		
							document.getElementById(num2).style='border:4pt solid red';				
							document.getElementById(num2).className=document.getElementById(num2).className+" selected";
						}
					}					
				}else if (event.keyCode==38){	// haut		
					num3=parseInt(num)-9;			
					if (parseInt(num)-9<82 && parseInt(num)-9>0 && typeof document.getElementById(num3) !='undefined'){
						if (document.getElementById(num3).className.indexOf("case")!=-1){
							suppr_selected(0);					
							$(num3).attr('style','border:4pt solid red' ); 		
							document.getElementById(num3).style='border:4pt solid red';				
							document.getElementById(num3).className=document.getElementById(num3).className+" selected";
						}
					}			
				}else if (event.keyCode==40){	// bas	
					num4=parseInt(num)+9;	
					if (parseInt(num)+9<82 && parseInt(num)+9>0  && typeof document.getElementById(num4) !='undefined'){
						if (document.getElementById(num4).className.indexOf("case")!=-1){
							suppr_selected(0);	
							$(num4).attr('style','border:4pt solid red' ); 						
							document.getElementById(num4).style='border:4pt solid red';				
							document.getElementById(num4).className=document.getElementById(num4).className+" selected";
						}
					}
				}	
			}
		}	
	}else if (event.keyCode==8 || event.keyCode==46){
		if (typeof document.getElementsByClassName("selected")[0] !='undefined')
			if (document.getElementsByClassName("selected")[0].className.indexOf("cell")!=-1){
				document.getElementsByClassName("selected")[0].innerText="";
			}
	}
}
function clic_droit(obj,event){
	if (event.button== 2){
			if (obj.className.indexOf("case")!=-1){
				bool=false;
				obj.innerText="";				
				setTimeout(retablir_menu, 2000); //millisecondes
			}
	}
}
function retablir_menu(){
bool=true;
}
var mouse_down = false;
var id_square = ""; 
var top_depart = document.getElementById("square1").getBoundingClientRect().top;
var left_depart = document.getElementById("square1").getBoundingClientRect().left;
var bool=true;
document.onmousemove = on_mouse_move;
document.onmouseup = on_mouse_up;

document.oncontextmenu = function() {return bool;}

function on_mouse_down_square(event,id) {
	el=document.getElementById(id);
	mouse_down=true; 
	square = "#"+id;
	id_square = id;
	 $('#case'+id.substr(-1,1)).trigger('click'); 
}

function nouveau(le_id,la_class){
	var container = document.getElementById('case'+le_id);
	var div = document.createElement("div");
	div.className= la_class;		
	div.id="square"+le_id;
	div.innerText=le_id;
	div.setAttribute("onmousedown", "on_mouse_down_square(event,this.id)");
	container.appendChild(div);
}

function on_mouse_up(event){
	if (mouse_down === true) {
		mouse_down=false;
		ok=82;
		for(i=1;i<=81;i++){
			if (event.clientX<= document.getElementById(i).getBoundingClientRect().right && event.clientX >= document.getElementById(i).getBoundingClientRect().left &&
			 event.clientY<= document.getElementById(i).getBoundingClientRect().bottom && event.clientY >= document.getElementById(i).getBoundingClientRect().top &&
			 document.getElementById(i).className.indexOf("cell")!=-1 && document.getElementById(i).className.indexOf("case")!=-1)
				ok=i;
		}
		if (ok!=82)
			document.getElementById(ok).innerText=document.querySelector(square).innerText;
		le_id=el.id.substr(-1,1);
		la_class=el.className;
		el.remove();
		nouveau(le_id,la_class);
	}
}

function on_mouse_move(event) {
  if (mouse_down === true) {
	if (typeof document.getElementsByClassName("selected")[0] !='undefined')
		suppr_selected(0);
	document.querySelector(square).style.left = event.clientX-left_depart-30+'px';
	document.querySelector(square).style.top = event.clientY-top_depart+10+'px';		
	document.querySelector(square).style.border ="solid 1pt black";
   }
}
function redimensionner_page(){
	largeur= largeur_ecran.value;
	hauteur= hauteur_ecran.value;
	largeur_bouton=250/1680*largeur;
	hauteur_bouton=45/907*hauteur;
	police=22/1680*largeur;
	padding_police=12/250*largeur_bouton;
	margin_bouton=30/1680*largeur;
	largeur_messages=250/1680*largeur;
	largeur_div_numeros=200/1680*largeur;
	margin_p=7/1680*largeur;
	largeur_heure=150/1680*largeur;
	largeur_musique=240/1680*largeur;
	largeur_boutons_haut=1300/1680*largeur;
	margin_boutons_haut=37/1680*largeur;
	hauteur_boutons_haut=87/907*hauteur;
	largeur_droite=300/1680*largeur;
	largeur_sudoku=Math.min(largeur-largeur_droite-largeur_div_numeros-largeur_messages-20, hauteur-hauteur_boutons_haut-20);
	la_case=largeur_sudoku/9;
	div_case=la_case-10;
	margin_div_case=-div_case/2;
	padding_div_case=div_case/2-5;
	height_div_case=div_case/2+5;
	document.getElementsByTagName("style")[0].innerText="html{	font-family: Arial;text-align:center; background-image:url(fond.jpg); background-size: 100% 100%; min-height: 100%; color:white; } .bouton{ background-image:url(bouton.png); width:"+largeur_bouton+"px; height:"+hauteur_bouton+"px; font-size:"+police+"pt; padding-top:"+padding_police+"px; margin: 0 auto "+margin_bouton+"px; /*haut, droite, bas, gauche */ background-size:"+largeur_bouton+"px; background-repeat:no-repeat; } #table{ margin: 0 auto; border:solid black 3pt; border-collapse: collapse; width:"+largeur_sudoku+"px; height:"+largeur_sudoku+"px; } #boutons_haut{ float:left; width:"+largeur_boutons_haut+"px; height:"+hauteur_boutons_haut+"px; } #droite{ float:right; width:"+largeur_droite+"px; } .boutons_haut{ float:left; margin-left:"+margin_boutons_haut+"px; margin-right:"+margin_boutons_haut+"px; } audio{ width:"+largeur_musique+"px; } #gauche{ float:left; width:"+largeur_messages+"px; } #div_numeros{ float:left; /*width:"+largeur_div_numeros+"px;*/ height:"+largeur_sudoku+"px; } td{ color:black; background-color:#D3D3D3; border:solid black 1pt; } #div_numeros table{ margin: 2px auto; width:"+la_case+"px; height:100%; position:relative; } p{ margin-top:"+margin_p+"px; } .ligne{ border-bottom:solid black 3pt; } .colonne{ border-right:solid black 3pt; } .case{ background-color:#FFE4B5; color:rgb(0,204,203); font-weight:bold; } #cadre{ border: solid 10pt white; } #heure{ border: solid 4pt white; width:"+largeur_heure+"px; margin:0 auto; padding:5px; } #score{ color:red; } #checkbox{ width:20px; height:20px; }  .deplace{ position:absolute; width:"+ div_case +"px; height:"+ height_div_case +"px; margin-top:"+ margin_div_case +"px; padding-top:"+ padding_div_case +"px; }";
}
/*
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
{
alert("Vous êtes sur téléphone");
}*/