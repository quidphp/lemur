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
            const childs = Selector.children(this);
            return Arr.find(childs,function() {
                return Dom.isNodeVisible(this);
            });
        },
        
        isOnlyHeight: function() {
            return Selector.match(this,'[data-only-height]');
        },
        
        isOnlyWidth: function() {
            return Selector.match(this,'[data-only-width]');
        },
        
        refresh: function() {
            const child = trigHdlr(this,'absolutePlaceholder:getChild');

            if(child != null)
            {
                if(!trigHdlr(this,'absolutePlaceholder:isOnlyHeight'))
                {
                    DomChange.setWidth(this,'auto');
                    const outerWidth = Dom.getWidth(child,true);
                    DomChange.setWidth(this,outerWidth);
                }
                
                if(!trigHdlr(this,'absolutePlaceholder:isOnlyWidth'))
                {
                    DomChange.setHeight(this,'auto');
                    const outerHeight = Dom.getHeight(child,true);
                    DomChange.setHeight(this,outerHeight);
                }
                
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