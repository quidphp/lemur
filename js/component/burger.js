/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// burger
// script for a burger menu component
const Burger = Component.Burger = function()
{
    // handler
    setHandler(this,'burger:isOpen',function() {
        const html = trigHandler(document,'doc:getHtml');
        return ($(html).attr('data-burger') === 'open')? true:false;
    });
    
    setHandler(this,'burger:toggle',function() {
        trigEvt(this,trigHandler(this,'burger:isOpen')? 'burger:close':'burger:open');
    });
    
    
    // event
    ael(this,'click',function() {
        trigHandler(this,'burger:toggle');
    });
    
    ael(this,'burger:open',function() {
        const html = trigHandler(document,'doc:getHtml');
        $(html).attr('data-burger','open');
    });
    
    ael(this,'burger:close',function() {
        const html = trigHandler(document,'doc:getHtml');
        $(html).attr('data-burger','close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigEvt(this,'burger:close');
    })
    
    
    // teardown
    aelOnce(this,'component:teardown',function() {
        trigEvt(this,'burger:close');
    });
    
    return this;
}