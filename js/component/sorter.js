/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// sorter
// script with drag and drop related sorting functionnalities, uses jquery-ui
const Sorter = Component.Sorter = function(option) 
{    
    // option
    const $option = Object.assign({
        items: ".items",
        handle: '.handle',
        containment: 'parent',
        axis: "y",
        cursor: "move",
        tolerance: 'pointer',
        opacity: 0.5,
        cancel: Selector.input(),
        stop: function(event,ui) {
            trigHdlr(this,'verticalSorter:stop');
            ui.item.css('z-index','auto');
        }
    },option);
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        $(this).sortable($option);
    });
    
    return this;
}