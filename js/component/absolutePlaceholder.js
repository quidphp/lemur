/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// absolutePlaceholder
// script of behaviours for an absolute placeholder component
const AbsolutePlaceholder = Component.AbsolutePlaceholder = function()
{
    // resizeChange
    Component.ResizeChange.call(this);
    
    
    // handler
    setHandler(this,'absolutePlaceholder:getChild',function() {
        return Arr.find($(this).children().get(),function() {
            return $(this).is(':visible');
        });
    });
    
    setHandler(this,'absolutePlaceholder:onlyHeight',function() {
        return $(this).is('[data-only-height]');
    });
    
    setHandler(this,'absolutePlaceholder:onlyWidth',function() {
        return $(this).is('[data-only-width]');
    });
    
    setHandler(this,'absolutePlaceholder:refresh',function() {
        const child = trigHandler(this,'absolutePlaceholder:getChild');
        
        if(child != null)
        {
            if(!trigHandler(this,'absolutePlaceholder:onlyHeight'))
            {
                $(this).width('auto');
                const outerWidth = $(child).outerWidth();
                $(this).width(outerWidth);
            }
            
            if(!trigHandler(this,'absolutePlaceholder:onlyWidth'))
            {
                $(this).height('auto');
                const outerHeight = $(child).outerHeight();
                $(this).height(outerHeight);
            }
            
            $(this).attr('data-absolute-placeholder','ready');
        }
    });
    
    
    // event
    ael(this,'resize:change',function() {
        trigHandler(this,'absolutePlaceholder:refresh');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigHandler(this,'absolutePlaceholder:refresh');
    });
    
    return this;
}