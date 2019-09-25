"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// nobody
// script of behaviours for all pages where the user is not logged in the CMS
$(document).ready(function() {
	
	// login
    // comportement pour la page login
	$(this).on('route:login', function() {
		$(this).trigger('route:nobodyCommon');
	})
	
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	.on('route:resetPassword', function(event) {
		$(this).trigger('route:nobodyCommon');
	})
	
	// register
    // comportement pour la page enregistrement
	.on('route:register', function(event) {
		$(this).trigger('route:nobodyCommon');
	})
	
    // nobodyCommon
    // comportements commun pour toutes les pages ou l'utilisateur n'est pas connecté
	.on('route:nobodyCommon', function(event) {
		var browscap = $(this).find(".nobody .browscap");
		var form = $(this).find(".nobody form");
		
		form.formValidate().find("[data-required],[data-pattern]").focusFirst();
		
		if(!$.areCookiesEnabled())
		browscap.find(".cookie").show();
	});
});