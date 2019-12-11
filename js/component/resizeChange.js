/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// resizeChange
// component to notify nodes when window size has changed
const ResizeChange = Component.ResizeChange = function(persistent)
{
    // nodes
    const $nodes = this;
    

    // event
    const handler = ael(window,'resize',function(event) {
        event.stopPropagation();
        trigEvt($nodes,'resize:change');
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