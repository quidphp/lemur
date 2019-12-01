/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// absolutePlaceholder
// script of behaviours for an absolute placeholder component
Component.absolutePlaceholder = function()
{
    // resizeChange
    Component.resizeChange.call(this);
    
    // triggerHandler
    $(this).on('absolutePlaceholder:getChild', function() {
        return $(this).children().first();
    })
    .on('absolutePlaceholder:onlyHeight', function() {
        return $(this).is('[data-only-height]');
    })
    .on('absolutePlaceholder:onlyWidth', function() {
        return $(this).is('[data-only-width]');
    })
    
    // trigger
    $(this).on('absolutePlaceholder:refresh', function(event) {
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
        
        event.stopPropagation();
    })
    .on('resize:change', function() {
        triggerCustom(this,'absolutePlaceholder:refresh');
    })
    
    // firstRefresh
    .trigger('absolutePlaceholder:refresh');
    
    return this;
}