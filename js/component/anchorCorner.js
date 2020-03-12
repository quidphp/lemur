/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// anchorCorner
// script of behaviours for an absolute anchorCorner component
Component.AnchorCorner = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.ResizeChange.call(this);
    
    
    // handler
    setHdlr(this,'anchorCorner:refresh',function() {
        const corner = offsetCorner.call(this);
        setAttr(this,'data-anchor-corner',corner);
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
        let r = null;
        const offset = Ele.getOffsetWin(this);
        const dimension = Win.getDimension();
        const topBottom = (offset.top > (dimension.height / 2))? 'bottom':'top';
        const leftRight = (offset.left > (dimension.width / 2))? 'right':'left';
        
        r = topBottom+"-"+leftRight;
        
        return r;
    }
    
    return this;
}