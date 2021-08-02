<?php

class Login
{
    public $messages = array();

    public function __construct()
    {
		if(!isset($_SESSION)) { 
			session_start();
		}
        if (isset($_GET["logout"])) {
            $this->doLogout();
        }
        elseif (isset($_POST["login"])) {
            $this->dologinWithPostData();
        }
    }

    private function dologinWithPostData()
    {
        if (empty($_POST['pseudo'])) {
            echo "Pseudo invalide.";
        } elseif (empty($_POST['mdp'])) {
            echo "Mot de passe invalide.";
        } else {
			
			require_once("db_file.php");

			if (!$db->connect_errno) {
                $pseudo = $db->real_escape_string($_POST['pseudo']);
                $checklogin = $db->query("SELECT id_user, confirmation, pseudo, mail, mdp, question, niveau FROM sudoku WHERE pseudo = '" . $pseudo . "';");
				if ($checklogin->num_rows == 0) {
                $checklogin = $db->query("SELECT id_user, confirmation, pseudo, mail, mdp, question, niveau FROM sudoku WHERE mail = '" . $pseudo . "';");
                }
				if ($checklogin->num_rows == 1) {
                    $result_row = $checklogin->fetch_object();
					$la_question =$result_row->question;
                    if (password_verify($_POST['mdp'], $result_row->mdp)) {
						if (isset($_POST['question']) && isset($_POST['reponse'])){			
							$question = urldecode($_POST['question']);
							$reponse = urldecode($_POST['reponse']);								
							$reponse_hash = password_hash($reponse, PASSWORD_DEFAULT);	
							$db->query("UPDATE sudoku SET question= '" . $question . "', reponse= '" . $reponse_hash . "' WHERE pseudo='" .$pseudo."'" );		
							$la_question="OK";					
						}
						if ($result_row->confirmation!="OK")	
							echo "Vous n'avez pas entré le code reçu par mail pour vérifier que vous n'êtes pas un robot, il ne vous le sera pas renvoyé ! Si vous n'avez pas reçu le mail, vérifiez dans vos spams/courriers indésirables.";					
						else if ($la_question=="")	
							echo "Mise à jour obligatoire du compte : merci d'indiquer une question secrète et sa réponse qui serviront en cas d'oubli de votre mot de passe.";					
						else {	
							$_SESSION['projet'] = "sudoku";
							$_SESSION['mail'] = $result_row->mail;
							$_SESSION['pseudo'] = $result_row->pseudo;
							$_SESSION['id'] = $result_row->id_user;
							$_SESSION['niveau'] = $result_row->niveau;
							$_SESSION['logged_in'] = 1;
							
							$query_update_date = $db->query("UPDATE sudoku SET derniere_connexion=now() WHERE pseudo='".$_SESSION['pseudo']."';");
							$db->close();

							$this->logged_in = true;
							echo "OK";
						}
                    } else {

                        echo "Mot de passe incorrect.";
                    }

				} else {
					echo  "Pseudo inconnu.";
				}

            } else {
                echo "Erreur interne, veuillez réessayer plus tard.";
            }

		}
    }

    public function doLogout()
    {
        $_SESSION = array();
        session_destroy();
        echo "Vous avez été déconnecté.";
    }

    public function isUserLoggedIn()
    {
        if (isset($_SESSION['logged_in']) AND $_SESSION['logged_in'] == 1 AND $_SESSION['projet'] == "sudoku") {
            return true;
        }
        return false;
    }
	
	public function isAdmin(){
		if (isset($_SESSION['admin']) AND $_SESSION['admin']) {
            return true;
        }
        return false;
	}
}
$login = new Login();