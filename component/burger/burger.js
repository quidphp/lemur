"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// burger
// script for a burger menu component
quid.component.burger = function()
{
    // triggerHandler
    $(this).on('burger:isOpen', function() {
        return ($(document).triggerHandler('document:getHtml').attr('data-burger') === 'open')? true:false;
    })
    
    // trigger
    .on('click', function() {
        $(this).trigger('burger:toggle');
    })
    .on('burger:toggle', function() {
        $(this).trigger($(this).triggerHandler('burger:isOpen')? 'burger:close':'burger:open');
    })
    .on('burger:open', function() {
        var html = $(document).triggerHandler('document:getHtml');
        html.attr('data-burger','open');
    })
    .on('burger:close', function() {
        var html = $(document).triggerHandler('document:getHtml');
        html.attr('data-burger','close');
    })
    
    // setup
    .one('component:setup', function() {
        $(this).trigger('burger:close');
    })
    
    // teardown
    .one('component:teardown', function() {
        $(this).trigger('burger:close');
    });
    
    return this;
}