"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// anchorCorner
// script of behaviours for an absolute anchorCorner component
quid.core.anchorCorner = function()
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
        event.stopPropagation();
        $(this).trigger('anchorCorner:refresh');
    })
    .trigger('anchorCorner:refresh');
    
    return this;
}