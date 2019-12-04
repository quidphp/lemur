/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// anchorCorner
// script of behaviours for an absolute anchorCorner component
const AnchorCorner = function()
{
    // nodes
    const $nodes = this;
    
    
    // resizeChange
    Component.ResizeChange.call(this);
    
    
    // custom event
    ael(this,'anchorCorner:refresh',function() {
        const offset = offsetCorner.call(this);
        $(this).attr('data-anchor-corner',offset.corner);
    });
    
    ael(this,'resize:change',function() {
        triggerCustom(this,'anchorCorner:refresh');
    })
    
    
    // event mouse
    ael(this,'mouseenter',function(event) {
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

// export
Component.AnchorCorner = AnchorCorner;