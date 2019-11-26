"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// dimension
// script with functions related to dimension and positionning
quid.main.dimension = new function() {
    
    // heightWithPadding
    // retourne la hauteur avec le padding top et bottom
    this.heightWithPadding = $.fn.heightWithPadding = function()
    {
        return $(this).height() + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom"));
    }


    // offsetCorner
    // retourne l'objet offset du premier élément avec les propriétés d'autres propriétés en plus
    this.offsetCorner = $.fn.offsetCorner = function()
    {
        var r = $(this).offset();
        r.y = r.top - $(window).scrollTop();
        r.x = r.left - $(window).scrollLeft();
        
        r.topBottom = (r.y > ($(window).height() / 2))? 'bottom':'top';
        r.leftRight = (r.x > ($(window).width() / 2))? 'right':'left';
        r.corner = r.topBottom+"-"+r.leftRight;
        
        return r;
    }
}