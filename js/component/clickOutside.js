/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOutside
// component to manage click outside a node, uses the direct parent of the node
const ClickOutside = function(value,persistent) 
{
    // nodes
    const $nodes = this;
    
    
    // func
    setFunc(this,'clickOutside:getParent',function() {
        return document;
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const parent = triggerFunc(this,'clickOutside:getParent');
        
        const handler = ael(parent,'click',function() {
            triggerCustom($this,value);
        });
        
        const handlerCustom = ael(parent,'clickOutside:click',function() {
            triggerCustom($this,value);
        });
        
        // persistent
        if(persistent !== true)
        {
            aelOnce(document,'doc:unmount',function() {
                rel(parent,handler);
                rel(parent,handlerCustom);
            });
        }
    });
    
    return this;
}

// export
Component.ClickOutside = ClickOutside;