/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// hashChange
// renvoie l'événement haschange aux nodes
const HashChange = Component.HashChange = function(persistent)
{
    // nodes
    const $nodes = this;
    
    
    // event
    const handler = ael(window,'hashchange',function(event,sourceEvent) {
        event.stopPropagation();
        trigEvt($nodes,'hash:change',Request.fragment(),sourceEvent);
    });
    
    
    // persistent
    if(persistent !== true)
    {
        const handlerDocument = aelOnce(document,'doc:unmount',function() {
            rel(window,handler);
        });
        
        aelOnce(this,'component:teardown',function() {
            rel(window,handler);
            rel(document,handlerDocument);
        });
    }
    
    return this;
}