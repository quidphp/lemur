/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// anchorCorner
// script of behaviours for an absolute anchorCorner component
Component.anchorCorner = function()
{
    // resizeChange
    Component.resizeChange.call(this);
    
    
    // trigger
    $(this).on('anchorCorner:refresh', function(event) {
        const offset = offsetCorner.call(this);
        $(this).attr('data-anchor-corner',offset.corner);
        event.stopPropagation();
    })
    .on('resize:change', function() {
        triggerCustom(this,'anchorCorner:refresh');
    })
    
    
    // mouse
    .on('mouseenter', function(event) {
        triggerCustom(this,'anchorCorner:refresh');
        event.stopPropagation();
    });
    
    
    // offsetCorner
    const offsetCorner = function()
    {
        let r = $(this).offset();
        r.y = r.top - $(window).scrollTop();
        r.x = r.left - $(window).scrollLeft();
        
        r.topBottom = (r.y > ($(window).height() / 2))? 'bottom':'top';
        r.leftRight = (r.x > ($(window).width() / 2))? 'right':'left';
        r.corner = r.topBottom+"-"+r.leftRight;
        
        return r;
    }
    
    
    // firstRefresh
    triggerCustom(this,'anchorCorner:refresh');
    
    
    return this;
}