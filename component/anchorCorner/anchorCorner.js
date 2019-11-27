"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// anchorCorner
// script of behaviours for an absolute anchorCorner component
quid.component.anchorCorner = function()
{
    // resizeChange
    quid.main.window.resizeChange.call(this);
    
    // trigger
    $(this).on('anchorCorner:refresh', function(event) {
        var offset = quid.main.dimension.offsetCorner.call(this);
        $(this).attr('data-anchor-corner',offset.corner);
        event.stopPropagation();
    })
    .on('resize:change', function() {
        $(this).trigger('anchorCorner:refresh');
    })
    
    // mouse
    .on('mouseenter', function(event) {
        $(this).trigger('anchorCorner:refresh');
        event.stopPropagation();
    })
    
    // firstRefresh
    .trigger('anchorCorner:refresh');
    
    return this;
}