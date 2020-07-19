/*
 * @require : Jquery, Bootstrap
 * @author  : Delavoux Thibault
 * @version : 1.2
 *
 * Génération de formulaires dynamiques par systèmes de classe
 * Permet :
 *			- La vérification avant soumission d'un formulaire et la mise en évidence des erreurs
 *			- La vérification poussée des champs via l'exécution de fonctions perso de vérification
 *			- L'ommission des champs cachés
 *			- La gestion des champs obligatoires et optionnels
 *
 *			Blocage des formulaires (boutton submit) ou de fonction JS associée
 *
 */

const EMPTY_STRING = "";
const EMPTY_SELECT = 0;
const NON_REQUIRED_SPEC = "non-required";
const CLASS_ERROR = 'has-error has-feedback';

$(function(){
	/* #########################################################################################################
	 *							Vérification des fomulaires avant soumission
	 ########################################################################################################### */

	/* Activation au clic sur un bouton de soumission
	 * Vérifie l'ensemble des champs du formulaire
	 *
	 * @use		optional	data-function	Fonction JS associé au boutton si celui ci ne submit pas de formulaire.
	 *										La fonction est lancé si aucun élément n'est bloquant
	 * @use		optional	data-required	Si la valeur est fixée à non-required, tous les champs ne sont pas obligatoires
	 */
	$('.submit-form-btn').click(function(){

		var blocage = false;
		var req		= ($(this).attr('data-required') && $(this).attr('data-required') === NON_REQUIRED_SPEC) ? false : true;
		var err		= new Array();

		$('.alertPerso').each(function(){
			$(this).detach();
		});


		/**
		 * --------- Vérification Des Sélecteurs  ----------
		 * @use optional  data-name				: nom du champ pour identifcation de l'erreur
		 * @use optional  data-verif			: valeur alternative a value pour la vérification.
		 * @use optional  data-alternate-verif	: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
		 * @use optional  data-error-message	: Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
		 */
		$('.verifySelect').each(function(){

			var error	= "Attention, " + ($(this).attr('data-name') ? $(this).attr('data-name') : 'Sélecteur ') + ' : Aucune sélection faite';
			var verif	= $('option:selected', this).attr('data-verif') ? $('option:selected', this).attr('data-verif') : false;
			if($(this).is(':visible')){

				if(req && ((verif !== false && verif === 'null') || ( verif === false	&& ( $('option:selected', this).val() === 'null' ||  parseInt($('option:selected', this).val()) === EMPTY_SELECT)))){
					err.push(error);
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
				else if(($(this).val().trim() !== EMPTY_STRING)  && eval($(this).attr('data-alternate-verif'))){
					err.push(error +$(this).attr('data-error-message'));
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
			}
		});


		/**
		 * --------- Vérification Des champs texte  ----------
		 * @use optional  data-name				: nom du champ pour identifcation de l'erreur
		 * @use optional  data-alternate-verif	: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
		 * @use optional  data-error-message	: Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
		 * @use optional  data-min-length		: taille minimale du texte à saisir
		 * @use optional  data-max-length		: taille maximale du texte à saisir
		 * @use optional  data-required			: Le champ est obligatoire
		 */
		$('.verifyText').each(function(){

			var minLength	= $(this).attr('data-min-length') ? parseInt($(this).attr('data-min-length')) : 0;
			var maxLength	= $(this).attr('data-max-length') ? parseInt($(this).attr('data-max-length')) : null;
			var error		= "Attention, " + ($(this).attr('data-name') ? $(this).attr('data-name') : 'champ texte ') + " non valide. ";
			var reqField	= ($(this).attr('data-required') && $(this).attr('data-required') === NON_REQUIRED_SPEC) ? false : true;

			if($(this).is(':visible')){
				if(req && $(this).val().trim() === EMPTY_STRING && reqField){
					err.push(error + "Saisie obligatoire");
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
				else if($(this).val().length < minLength){
					err.push(error + "saisie trop courte (min " + minLength + " caractères)");
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
				else if(maxLength !== null && ($(this).val().length > maxLength)){
					err.push(error + "saisie trop longue (max " + maxLength + " caractères)");
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
				else if(($(this).val().trim() !== EMPTY_STRING)  && eval($(this).attr('data-alternate-verif'))){
					err.push(error +$(this).attr('data-error-message'));
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
			}
		});


		/**
		 * --------- Vérification Des champs Int  ----------
		 * @use optional  data-name				: nom du champ pour identifcation de l'erreur
		 * @use optional  data-alternate-verif	: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
		 * @use optional  data-error-message	: Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
		 * @use optional  data-min				: taille minimale de l'objet
		 * @use optional  data-max				: taille maximale de l'objet
		 */
		$('.verifyInt').each(function(){

			var minVal = parseInt($(this).attr('data-min')) ? parseInt($(this).attr('data-min')) : 0;
			var maxVal = parseInt($(this).attr('data-max')) ? parseInt($(this).attr('data-max')) : 2147483647;
			var error  = "Attention, " + ($(this).attr('data-name') ? $(this).attr('data-name') : 'champ nombre ') + " non valide. ";

			if($(this).is(':visible')){
				if($(this).val() && (!$.isNumeric($(this).val()) ||  $(this).val().includes('.') !== false)){
					err.push(error + ' : Nombre entier attendu');
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}else if(req && $(this).val().trim() === EMPTY_STRING){
					err.push(error + "Saisie obligatoire");
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}else if($(this).val() < minVal || $(this).val() > maxVal){
					err.push(error + (minVal ? "Min : " + minVal : "")  + (maxVal ? ' Max : ' + maxVal : ""));
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}else if(($(this).val().trim() !== EMPTY_STRING)  && eval($(this).attr('data-alternate-verif'))){
					err.push(error +$(this).attr('data-error-message'));
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
			}
		});


		/**
		 * --------- Vérification Des champs Float  ----------
		 * @use optional  data-name				: nom du champ pour identifcation de l'erreur
		 * @use optional  data-alternate-verif	: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
		 * @use optional  data-error-message	: Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
		 * @use optional  data-min				: taille minimale de l'objet
		 * @use optional  data-max				: taille maximale de l'objet
		 */
		$('.verifyFloat').each(function(){

			var minVal = parseFloat($(this).attr('data-min')) ? parseFloat($(this).attr('data-min')) : 0;
			var maxVal = parseFloat($(this).attr('data-max')) ? parseFloat($(this).attr('data-max')) : 2147483647;
			var error  = "Attention, " + ($(this).attr('data-name') ? $(this).attr('data-name') : 'champ nombre ') + " non valide. ";

			if($(this).is(':visible')){
				if($(this).val() && !$.isNumeric($(this).val())){
					err.push(error + ' : Nombre attendu');
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}else if(req && $(this).val().trim() === EMPTY_STRING){
					err.push(error + "Saisie obligatoire");
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}else if($(this).val() < minVal || $(this).val() > maxVal){
					err.push(error + (minVal ? "Min : " + minVal : "")  + (maxVal ? ' Max : ' + maxVal : ""));
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}else if(($(this).val().trim() !== EMPTY_STRING)  && eval($(this).attr('data-alternate-verif'))){
					err.push(error +$(this).attr('data-error-message'));
					$(this).parent().addClass(CLASS_ERROR);
					blocage = true;
				}
			}

		});

		/**
		 * --------- Verification Des checkboxs  ----------
		 * @use optional  data-name		: nom du champ pour identifcation de l'erreur
		 */
		$('.verifyChecked').each(function(){

			var error  = "Attention, " + ($(this).attr('data-name') ? $(this).attr('data-name') : 'La checkbox ') + " n'a pas été accepté(e) / coché(e). ";

			if(!$(this).prop("checked")){
				$(this).next().css('color', "#c91a1a");
				err.push(error);
				blocage = true;
			}

		});

		/**
		 * --------- Vérification Des Radios  ----------
		 * Verification simple que l'un des boutons radio a été sélectionné dans la liste des radio de méme noms
		 * @use optional  data-name		: nom du champ pour identifcation de l'erreur
		 */
		$('.verifyRadio').each(function(){

			var error  = "Attention, " + ($(this).attr('data-name') ? $(this).attr('data-name') : ' Boutons Radios :') + " Aucune selection. ";
			var name = $(this).attr('name');


			if($(this).is(':visible')){
				var counter = 0;
				if($('input[name="' + name+'"]').is(":checked")){
					counter++;
				}

				if( counter === 0){
					if(err.indexOf(error) === -1)
						err.push(error);
					blocage =  true;
				}
			}


		});


		// Si aucune erreur n'a été levée, le submit est acif, sinon blocage de la soumission et affichage des erreurs
		if(blocage === true){
			$('form').submit(function(e) {e.preventDefault();});

			// ---- Affichage des erreurs ----
				var errorText = '<div class="alertPerso" id="alertPerso" style="position: fixed;right: 1em;top: 3em;z-index: 9999;">' +
									'<div class="alert alert-danger">'+
										'<span class="glyphicon glyphicon-hand-right" style="margin: 0 0.5em;"></span>'+
										'<strong>Oops, une petite erreur ?</strong><hr class="message-inner-separator">';
				err.forEach(function(element) {
					errorText += '<p>' + element + "</p>";
				});
				errorText += '</div></div>';
				$('body').append(errorText);
				setTimeout(function() {
					$('#alertPerso').detach();
				}, 5000);

				// reinit les flux de données
				errorText = "";
				err = new Array();
		}else{
			if($(this).attr('data-function')){
				eval($(this).attr('data-function'));
				$('form').submit(function(e) {e.preventDefault();});
			}else{
				$('form').unbind('submit').submit();
			}
		}

		reinitColor();
	});

	/*###########################################################################################################
	 *						Compteur de charactères pour texteArea
	 ############################################################################################################*/

	/**
	 * @use optional maxlength
	 *
	 * Défini un compteur automatique de caractères restant pour un texte area donné.
	 * La taille max est basée sur l'attribut maxlenght de la textArea. Par défaut, la valeur est à 500;
	 */
	$('.countArea>textarea').keyup(function(){
		$(this).parent().find('.lengthText').remove();
		var max = $(this).attr('maxlength') ? parseInt($(this).attr('maxlength')) : 500;
		var len = $(this).val().length;
		var ch = max - len;
		$(this).parent().append('<p class="small-text lengthText">' + ch + ' caractère(s) restant</p>');
	});
	$('.countArea>textarea').trigger('keyup');
});



/* #####################################################
 *	Réinitialisation des couleurs des champs de saisie
 ####################################################### */

function reinitColor(){
	/**
	 * Réinitialisation à la sélection d'un nouvel élément
	 */
	$('select').change(function(){
			$(this).parent().removeClass(CLASS_ERROR);
	});

	/**
	 * Réinitialisation sur Key Up
	 */
	$('.verifyText').keyup(function(){
		$(this).parent().removeClass(CLASS_ERROR);
	});

	$('.verifyInt').keyup(function(){
		$(this).parent().removeClass(CLASS_ERROR);
	});

	$('.verifyFloat').keyup(function(){
		$(this).parent().removeClass(CLASS_ERROR);
	});

	$('.verifyChecked').click(function(){
		$(this).next().css('color', '#424242');
	});
}
