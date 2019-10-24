"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// browser
// script with a some functions related to browsers
(function ($, document, window) {
	
	// isResponsive
	// retourne vrai si la fenêtre courante est responsive
	$.isResponsive = function() 
	{
		return ($(window).width() < 900)? true:false;
	}
	
	
	// isTouch
	// retourne vrai si le navigateur courant supporte le touch
	$.isTouch = function() 
	{
		return ($(document).data('isTouch') === true)? true:false;
	}
	
	
	// isOldIe
	// retourne vrai si le navigateur est une vieille version de IE (IE8 ou moins)
	$.isOldIe = function() 
	{
		return (document.all && !document.addEventListener)? true:false;
	}
	
	
	// areCookiesEnabled
	// retourne vrai si les cookies sont activés
	$.areCookiesEnabled = function()
	{
		var r = false;
		
		if(navigator.cookieEnabled) 
		r = true;
		
		else
		{
			document.cookie = "cookietest=1";
		    r = document.cookie.indexOf("cookietest=") != -1;
			document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}

		return r;
	}
	
	
	// sur le premier isTouch
	$(document).one('touchstart', function(event) {
		$(this).data('isTouch',true);
	});
	
}(jQuery, document, window));