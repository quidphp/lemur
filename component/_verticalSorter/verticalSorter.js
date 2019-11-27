"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// verticalSorter
// script with drag and drop related functionnalities
// uses jquery-ui
quid.core.verticalSorter = function(items,handle,containment) 
{    
    containment = (containment != null)? containment:'parent';
    if(quid.base.str.isNotEmpty(items) && quid.base.str.isNotEmpty(handle))
    {
        $(this).each(function() {
            $(this).sortable({
                axis: "y",
                handle: handle,
                items: items,
                cursor: "move",
                tolerance: 'pointer',
                opacity: 0.5,
                containment: containment,
                cancel: ':inputReal',
                stop: function(event,ui) {
                    $(this).trigger('verticalSorter:stop');
                    ui.item.css('z-index','auto');
                }
            });
        });
    }
    
    return this;
}