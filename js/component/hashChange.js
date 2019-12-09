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
        triggerEvent($nodes,'hash:change',Request.fragment(),sourceEvent);
    });
    
    
    // persistent
    if(persistent !== true)
    {
        aelOnce(document,'doc:unmount',function() {
            rel(window,handler);
        });
    }
    
    return this;
}