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
        return (triggerFunc(document,'doc:getHtml').attr('data-burger') === 'open')? true:false;
    })
    
    
    // custom
    ael(this,'click',function() {
        triggerCustom(this,'burger:toggle');
    });
    
    ael(this,'burger:toggle',function() {
        triggerCustom(this,triggerFunc(this,'burger:isOpen')? 'burger:close':'burger:open');
    });
    
    ael(this,'burger:open',function() {
        const html = triggerFunc(document,'doc:getHtml');
        html.attr('data-burger','open');
    });
    
    ael(this,'burger:close',function() {
        const html = triggerFunc(document,'doc:getHtml');
        html.attr('data-burger','close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        triggerCustom(this,'burger:close');
    })
    
    
    // teardown
    aelOnce(this,'component:teardown',function() {
        triggerCustom(this,'burger:close');
    });
    
    return this;
}

// block
Component.Burger = Burger;