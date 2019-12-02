/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// burger
// script for a burger menu component
Component.burger = function()
{
    // triggerHandler
    $(this).on('burger:isOpen',function() {
        return (triggerFunc(document,'document:getHtml').attr('data-burger') === 'open')? true:false;
    })
    
    // trigger
    .on('click',function() {
        triggerCustom(this,'burger:toggle');
    })
    .on('burger:toggle',function() {
        triggerCustom(this,triggerFunc(this,'burger:isOpen')? 'burger:close':'burger:open');
    })
    .on('burger:open',function() {
        const html = triggerFunc(document,'document:getHtml');
        html.attr('data-burger','open');
    })
    .on('burger:close',function() {
        const html = triggerFunc(document,'document:getHtml');
        html.attr('data-burger','close');
    })
    
    // setup
    .one('component:setup',function() {
        triggerCustom(this,'burger:close');
    })
    
    // teardown
    .one('component:teardown',function() {
        triggerCustom(this,'burger:close');
    });
    
    return this;
}