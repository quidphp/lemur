/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// absolutePlaceholder
// script of behaviours for an absolute placeholder component
Component.AbsolutePlaceholder = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.ResizeChange.call(this);
    
    
    // handler
    setHdlrs(this,'absolutePlaceholder:',{
        
        getChild: function() {
            const childs = Nod.children(this);
            return Arr.find(childs,function() {
                return Ele.isVisible(this);
            });
        },
        
        isOnlyHeight: function() {
            return Nod.match(this,'[data-only-height]');
        },
        
        isOnlyWidth: function() {
            return Nod.match(this,'[data-only-width]');
        },
        
        refresh: function() {
            const child = trigHdlr(this,'absolutePlaceholder:getChild');

            if(child != null)
            {
                const doWidth = !trigHdlr(this,'absolutePlaceholder:isOnlyHeight');
                const doHeight = !trigHdlr(this,'absolutePlaceholder:isOnlyWidth');
                
                Ele.setDimension(this,(doWidth)? 'auto':null,(doHeight)? 'auto':null);
                const dimension = Ele.getDimension(child);
                Ele.setDimension(this,(doWidth)? dimension.width:null,(doHeight)? dimension.height:null);
                
                setAttr(this,'data-absolute-placeholder','ready');
            }
        }
    });
    
    
    // event
    ael(this,'resize:change',function() {
        trigHdlr(this,'absolutePlaceholder:refresh');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigHdlr(this,'absolutePlaceholder:refresh');
    });
    
    return this;
}