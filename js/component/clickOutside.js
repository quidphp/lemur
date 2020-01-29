/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOutside
// component to manage click outside a node, uses the direct parent of the node
Component.ClickOutside = function(value,persistent) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlr(this,'clickOutside:getParent',function() {
        return document;
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        
        const $this = this;
        const parent = trigHdlr(this,'clickOutside:getParent');
        
        const handler = ael(parent,'click',function() {
            trigEvt($this,value);
        });
        
        const handlerCustom = ael(parent,'clickOutside:click',function() {
            trigEvt($this,value);
        });
        
        // persistent
        if(persistent !== true)
        {
            const teardown = function() {
                rel(parent,handler);
                rel(parent,handlerCustom);
            };
            
            aelOnce(document,'doc:unmountPage',teardown);
            aelOnce(this,'component:teardown',teardown);
        }
    });
    
    return this;
}