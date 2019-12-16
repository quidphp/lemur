/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// sorter
// script with drag and drop related sorting functionnalities, uses jquery-ui
Component.Sorter = function(option) 
{    
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.Base.call(this);
    
    
    // option
    const $option = Pojo.replace({
        items: ".items",
        handle: '.handle',
        containment: 'parent',
        axis: "y",
        cursor: "move",
        tolerance: 'pointer',
        opacity: 0.5,
        cancel: Selector.input(false),
        stop: function(event,ui) {
            trigHdlr(this,'verticalSorter:stop');
            ui.item.css('z-index','auto');
        }
    },option);
    
    
    // event
    ael(this,'component:enable',function() {
        $(this).sortable('enable');
    });
    
    ael(this,'component:disable',function() {
        $(this).sortable('disable');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        $(this).sortable($option);
    });
    
    return this;
}