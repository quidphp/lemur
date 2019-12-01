/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// verticalSorter
// script with drag and drop related functionnalities
// uses jquery-ui
Component.verticalSorter = function(items,handle,containment) 
{    
    containment = (containment != null)? containment:'parent';
    if(Str.isNotEmpty(items) && Str.isNotEmpty(handle))
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
                cancel: Selector.input(),
                stop: function(event,ui) {
                    triggerCustom(this,'verticalSorter:stop');
                    ui.item.css('z-index','auto');
                }
            });
        });
    }
    
    return this;
}