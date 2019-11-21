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


    // anchorCorner
    // applique une clase à l'élément, sert à identifier le coin de l'écran dans lequel se trouve l'élément
    this.anchorCorner = $.fn.anchorCorner = function()
    {
        $(this).resizeChange().on('mouseenter', function(event) {
            event.stopPropagation();
            $(this).trigger('anchorCorner:refresh')
        })
        .on('anchorCorner:refresh', function(event) {
            event.stopPropagation();
            var offset = $(this).offsetCorner();
            $(this).attr('data-anchor-corner',offset.corner);
        })
        .on('resize:change', function(event) {
            $(this).trigger('anchorCorner:refresh');
        })
        .trigger('anchorCorner:refresh');
        
        return this;
    }


    // absolutePlaceholder
    // permet d'attribuer au placeholder la dimension de son enfant qui est absolut
    this.absolutePlaceholder = $.fn.absolutePlaceholder = function()
    {
        $(this).resizeChange().on('absolutePlaceholder:refresh', function(event) {
            event.stopPropagation();

            var child = $(this).children().first();
            if(child.length)
            {
                if(!$(this).is('[data-absolute-placeholder-height]'))
                {
                    $(this).width('auto');
                    $(this).width(child.outerWidth());
                }
                
                if(!$(this).is('[data-absolute-placeholder-width]'))
                {
                    $(this).height('auto');
                    $(this).height(child.outerHeight());
                }
                
                $(this).attr('data-absolute-placeholder','ready');
            }
        })
        .on('resize:change', function(event) {
            $(this).trigger('absolutePlaceholder:refresh');
        })
        .trigger('absolutePlaceholder:refresh');
        
        return this;
    }
}