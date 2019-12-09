/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollChange
// component to notify nodes when window scroll has changed
const ScrollChange = Component.ScrollChange = function(persistent)
{
    // nodes
    const $nodes = this;
    
    
    // event
    const handler = ael(window,'scroll',function(event) {
        event.stopPropagation();
        triggerEvent($nodes,'scroll:change');
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