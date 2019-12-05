/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// resizeChange
// component to notify nodes when window size has changed
const ResizeChange = function(persistent)
{
    // nodes
    const $nodes = this;
    

    // event
    const handler = ael(window,'resize',function(event) {
        event.stopPropagation();
        triggerCustom($nodes,'resize:change');
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

// export
Component.ResizeChange = ResizeChange;