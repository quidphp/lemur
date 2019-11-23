"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// burger
// script for a burger menu component
quid.core.burger = function()
{
    var html = $(document).triggerHandler('document:getHtml');
    
    $(this).on('click', function(event) {
        var value = (html.attr('data-burger') === 'open')? 'close':'open';
        $(this).trigger('burger:change',[value]);
    })
    .on('burger:change', function(event,value) {
        html.attr('data-burger',value)
        $(window).trigger('resize');
    })
    .trigger('burger:change',['close']);
    
    return this;
}