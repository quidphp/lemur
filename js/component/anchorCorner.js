/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// anchorCorner
// script of behaviours for an absolute anchorCorner component
const AnchorCorner = Component.AnchorCorner = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.ResizeChange.call(this);
    
    
    // handler
    setHdlr(this,'anchorCorner:refresh',function() {
        const offset = offsetCorner.call(this);
        $(this).attr('data-anchor-corner',offset.corner);
    });
    
    
    // event
    ael(this,'mouseenter',function(event) {
        trigHdlr(this,'anchorCorner:refresh');
        event.stopPropagation();
    });
    
    ael(this,'resize:change',function() {
        trigHdlr(this,'anchorCorner:refresh');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigHdlr(this,'anchorCorner:refresh');
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
    
    return this;
}