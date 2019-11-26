"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// absolutePlaceholder
// script of behaviours for an absolute placeholder component
quid.core.absolutePlaceholder = function()
{
    $(this).resizeChange().on('absolutePlaceholder:refresh', function(event) {
        event.stopPropagation();
        
        var child = $(this).children().first();
        if(child.length)
        {
            if(!$(this).is('[data-absolute-placeholder-height]'))
            {
                $(this).width('auto');
                $(this).width(child.outerWidth());
            }
            
            if(!$(this).is('[data-absolute-placeholder-width]'))
            {
                $(this).height('auto');
                $(this).height(child.outerHeight());
            }
            
            $(this).attr('data-absolute-placeholder','ready');
        }
    })
    .on('resize:change', function(event) {
        event.stopPropagation();
        $(this).trigger('absolutePlaceholder:refresh');
    })
    .trigger('absolutePlaceholder:refresh');
    
    return this;
}