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
    const handler = ael(window,'hashchange',function(event) {
        trigEvt($nodes,'hash:change',true);
    });
    
    // pour popstate, trigger seulement le hash change si le navigateur est ie, les autres navigateurs envoient un événement natif hashchange
    const handler2 = ael(window,'hashChange:history',function(event,popstate) {
        if(popstate !== true || Browser.isIe())
        trigEvt($nodes,'hash:change',false);
    });
    
    
    // persistent
    if(persistent !== true)
    {
        const teardown = function() {
            rel(window,handler);
            rel(window,handler2);
        };
        
        aelOnce(document,'doc:unmountPage',teardown);
        aelOnce(this,'component:teardown',teardown);
    }
    
    return this;
}