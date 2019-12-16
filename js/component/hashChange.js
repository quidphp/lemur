/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// hashChange
// sends the hash change event back to the nodes
Component.HashChange = function(persistent)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // nodes
    const $nodes = this;
    
    
    // event
    const handler = ael(window,'hashchange',function(event,sourceEvent) {
        trigEvt($nodes,'hash:change',sourceEvent);
    });
    
    
    // persistent
    if(persistent !== true)
    {
        const handlerDocument = aelOnce(document,'doc:unmountPage',function() {
            rel(window,handler);
        });
        
        aelOnce(this,'component:teardown',function() {
            rel(document,handlerDocument);
        });
    }
    
    return this;
}