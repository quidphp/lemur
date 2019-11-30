/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// absolutePlaceholder
// script of behaviours for an absolute placeholder component
Quid.Component.absolutePlaceholder = function()
{
    // resizeChange
    Quid.Component.resizeChange.call(this);
    
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
        var child = $(this).triggerHandler('absolutePlaceholder:getChild');
        if(child.length)
        {
            if(!$(this).triggerHandler('absolutePlaceholder:onlyHeight'))
            {
                $(this).width('auto');
                $(this).width(child.outerWidth());
            }
            
            if(!$(this).triggerHandler('absolutePlaceholder:onlyWidth'))
            {
                $(this).height('auto');
                $(this).height(child.outerHeight());
            }
            
            $(this).attr('data-absolute-placeholder','ready');
        }
        
        event.stopPropagation();
    })
    .on('resize:change', function() {
        $(this).trigger('absolutePlaceholder:refresh');
    })
    
    // firstRefresh
    .trigger('absolutePlaceholder:refresh');
    
    return this;
}