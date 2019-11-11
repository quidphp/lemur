"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// dimension
// script with functions related to dimension and positionning

// heightWithPadding
// retourne la hauteur avec le padding top et bottom
quid.core.heightWithPadding = $.fn.heightWithPadding = function()
{
    return $(this).height() + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom"));
}


// offsetCorner
// retourne l'objet offset du premier élément avec les propriétés d'autres propriétés en plus
quid.core.offsetCorner = $.fn.offsetCorner = function()
{
    var r = $(this).offset();
    r.y = r.top - $(window).scrollTop();
    r.x = r.left - $(window).scrollLeft();
    
    r.topBottom = (r.y > ($(window).height() / 2))? 'bottom':'top';
    r.leftRight = (r.x > ($(window).width() / 2))? 'right':'left';
    r.corner = r.topBottom+"-"+r.leftRight;
    
    return r;
}


// anchorCorner
// applique une clase à l'élément, sert à identifier le coin de l'écran dans lequel se trouve l'élément
quid.core.anchorCorner = $.fn.anchorCorner = function(type)
{
    type = type || 'mouseenter';
    
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).on(type, function(event) {
            var offset = $(this).offsetCorner();
            $(this).removeClass("top-left top-right bottom-left bottom-right");
            $(this).addClass(offset.corner);
        });
    }
    
    return this;
}