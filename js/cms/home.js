"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// home
// script of behaviours for the homepage of the CMS
$(document).ready(function() {
	
	// home
    // comportement pour la page d'accueil du CMS une fois connecté
	$(this).on('route:home', function() {
		
		var form = $(this).find("main form");
		var field = form.find("[data-required],[data-pattern]");
		
		if(form.length)
		form.formAjaxPopup(field);
	});
});