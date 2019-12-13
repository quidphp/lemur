/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// burger
// script for a burger menu component
const Burger = Component.Burger = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlrs(this,'burger:',{
        
        isOpen: function() {
            const html = trigHdlr(document,'doc:getHtml');
            return (getAttr(html,'data-burger') === 'open')? true:false;
        },
        
        toggle: function() {
            trigEvt(this,trigHdlr(this,'burger:isOpen')? 'burger:close':'burger:open');
        }
    });
    
    
    // event
    ael(this,'click',function() {
        trigHdlr(this,'burger:toggle');
    });
    
    ael(this,'burger:open',function() {
        const html = trigHdlr(document,'doc:getHtml');
        setAttr(html,'data-burger','open');
    });
    
    ael(this,'burger:close',function() {
        const html = trigHdlr(document,'doc:getHtml');
        setAttr(html,'data-burger','close');
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