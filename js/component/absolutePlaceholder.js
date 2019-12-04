/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// absolutePlaceholder
// script of behaviours for an absolute placeholder component
const AbsolutePlaceholder = function()
{
    // nodes
    const $nodes = this;
    
    
    // resizeChange
    Component.ResizeChange.call(this);
    
    
    // func
    setFunc(this,'absolutePlaceholder:getChild',function() {
        return $(this).children().first();
    });
    
    setFunc(this,'absolutePlaceholder:onlyHeight',function() {
        return $(this).is('[data-only-height]');
    });
    
    setFunc(this,'absolutePlaceholder:onlyWidth',function() {
        return $(this).is('[data-only-width]');
    });
    
    
    // custom event
    ael(this,'absolutePlaceholder:refresh',function() {
        const child = triggerFunc(this,'absolutePlaceholder:getChild');
        if(child.length)
        {
            if(!triggerFunc(this,'absolutePlaceholder:onlyHeight'))
            {
                $(this).width('auto');
                $(this).width(child.outerWidth());
            }
            
            if(!triggerFunc(this,'absolutePlaceholder:onlyWidth'))
            {
                $(this).height('auto');
                $(this).height(child.outerHeight());
            }
            
            $(this).attr('data-absolute-placeholder','ready');
        }
    });
    
    ael(this,'resize:change',function() {
        triggerCustom(this,'absolutePlaceholder:refresh');
    })
    
    
    // firstRefresh
    triggerCustom(this,'absolutePlaceholder:refresh');
    
    return this;
}

// export
Component.AbsolutePlaceholder = AbsolutePlaceholder;