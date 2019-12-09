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
    
    
    // func
    setFunc(this,'absolutePlaceholder:getChild',function() {
        return $(this).children().get(0);
    });
    
    setFunc(this,'absolutePlaceholder:onlyHeight',function() {
        return $(this).is('[data-only-height]');
    });
    
    setFunc(this,'absolutePlaceholder:onlyWidth',function() {
        return $(this).is('[data-only-width]');
    });
    
    setFunc(this,'absolutePlaceholder:refresh',function() {
        const child = triggerFunc(this,'absolutePlaceholder:getChild');
        if(child != null)
        {
            if(!triggerFunc(this,'absolutePlaceholder:onlyHeight'))
            {
                const outerWidth = $(child).outerWidth();
                $(this).width('auto');
                $(this).width(outerWidth);
            }
            
            if(!triggerFunc(this,'absolutePlaceholder:onlyWidth'))
            {
                const outerHeight = $(child).outerHeight();
                $(this).height('auto');
                $(this).height(outerHeight);
            }
            
            $(this).attr('data-absolute-placeholder','ready');
        }
    });
    
    
    // event
    ael(this,'resize:change',function() {
        triggerFunc(this,'absolutePlaceholder:refresh');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        triggerFunc(this,'absolutePlaceholder:refresh');
    });
    
    return this;
}