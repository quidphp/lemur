"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// dimension
// script with functions related to dimension and positionning
(function ($, document, window) {
	
    // heightWithPadding
	// retourne la hauteur avec le padding top et bottom
	$.fn.heightWithPadding = function()
	{
		return $(this).height() + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom"));
	}
    
    
    // offsetCorner
	// retourne l'objet offset du premier élément avec les propriétés d'autres propriétés en plus
	$.fn.offsetCorner = function()
	{
		var r = $(this).offset();
        r.topMiddle = (r.top + ($(this).height() / 2));
        r.leftMiddle = (r.left + ($(this).width() / 2));
		r.y = r.topMiddle - $(window).scrollTop();
		r.x = r.leftMiddle - $(window).scrollLeft();
        
		r.topBottom = (r.y > ($(window).height() / 2))? 'bottom':'top';
		r.leftRight = (r.x > ($(window).width() / 2))? 'right':'left';
		r.corner = r.topBottom+"-"+r.leftRight;
        
		return r;
	}
    
    
    // anchorCorner
	// applique une clase à l'élément, sert à identifier le coin de l'écran dans lequel se trouve l'élément
	$.fn.anchorCorner = function(type)
	{
		if($.isStringNotEmpty(type))
		{
			$(this).on(type, function(event) {
				var offset = $(this).offsetCorner();
				$(this).removeClass("top-left top-right bottom-left bottom-right");
				$(this).addClass(offset.corner);
			});
		}
		
		return this;
	}
    
}(jQuery, document, window));