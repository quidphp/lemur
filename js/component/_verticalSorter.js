/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// verticalSorter
// script with drag and drop related functionnalities
// uses jquery-ui
Quid.Component.verticalSorter = function(items,handle,containment) 
{    
    containment = (containment != null)? containment:'parent';
    if(Quid.Str.isNotEmpty(items) && Quid.Str.isNotEmpty(handle))
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
                cancel: Quid.Selector.input(),
                stop: function(event,ui) {
                    $(this).trigger('verticalSorter:stop');
                    ui.item.css('z-index','auto');
                }
            });
        });
    }
    
    return this;
}