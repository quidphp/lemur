/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// anchorCorner
// script of behaviours for an absolute anchorCorner component
Quid.Component.anchorCorner = function()
{
    // resizeChange
    Quid.Component.resizeChange.call(this);
    
    
    // trigger
    $(this).on('anchorCorner:refresh', function(event) {
        var offset = offsetCorner.call(this);
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
    });
    
    
    // offsetCorner
    var offsetCorner = function()
    {
        var r = $(this).offset();
        r.y = r.top - $(window).scrollTop();
        r.x = r.left - $(window).scrollLeft();
        
        r.topBottom = (r.y > ($(window).height() / 2))? 'bottom':'top';
        r.leftRight = (r.x > ($(window).width() / 2))? 'right':'left';
        r.corner = r.topBottom+"-"+r.leftRight;
        
        return r;
    }
    
    
    // firstRefresh
    $(this).trigger('anchorCorner:refresh');
    
    
    return this;
}