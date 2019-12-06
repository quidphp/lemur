/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// burger
// script for a burger menu component
const Burger = function()
{
    // nodes
    const $nodes = this;
    
    
    // func
    setFunc(this,'burger:isOpen',function() {
        const html = triggerFunc(document,'doc:getHtml');
        return ($(html).attr('data-burger') === 'open')? true:false;
    });
    
    setFunc(this,'burger:toggle',function() {
        triggerEvent(this,triggerFunc(this,'burger:isOpen')? 'burger:close':'burger:open');
    });
    
    
    // event
    ael(this,'click',function() {
        triggerFunc(this,'burger:toggle');
    });
    
    ael(this,'burger:open',function() {
        const html = triggerFunc(document,'doc:getHtml');
        $(html).attr('data-burger','open');
    });
    
    ael(this,'burger:close',function() {
        const html = triggerFunc(document,'doc:getHtml');
        $(html).attr('data-burger','close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        triggerEvent(this,'burger:close');
    })
    
    
    // teardown
    aelOnce(this,'component:teardown',function() {
        triggerEvent(this,'burger:close');
    });
    
    return this;
}

// block
Component.Burger = Burger;