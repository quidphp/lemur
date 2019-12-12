/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// absolutePlaceholder
// script of behaviours for an absolute placeholder component
const AbsolutePlaceholder = Component.AbsolutePlaceholder = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.ResizeChange.call(this);
    
    
    // handler
    setHdlrs(this,'absolutePlaceholder:',{
        
        getChild: function() {
            return Arr.find($(this).children().get(),function() {
                return $(this).is(':visible');
            });
        },
        
        isOnlyHeight: function() {
            return $(this).is('[data-only-height]');
        },
        
        isOnlyWidth: function() {
            return $(this).is('[data-only-width]');
        },
        
        refresh: function() {
            const child = trigHdlr(this,'absolutePlaceholder:getChild');
            
            if(child != null)
            {
                if(!trigHdlr(this,'absolutePlaceholder:isOnlyHeight'))
                {
                    $(this).width('auto');
                    const outerWidth = $(child).outerWidth();
                    $(this).width(outerWidth);
                }
                
                if(!trigHdlr(this,'absolutePlaceholder:isOnlyWidth'))
                {
                    $(this).height('auto');
                    const outerHeight = $(child).outerHeight();
                    $(this).height(outerHeight);
                }
                
                $(this).attr('data-absolute-placeholder','ready');
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