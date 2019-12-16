/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollChange
// component to notify nodes when window scroll has changed
Component.ScrollChange = function(persistent)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // nodes
    const $nodes = this;
    
    
    // event
    const handler = ael(window,'scroll',function(event) {
        event.stopPropagation();
        trigEvt($nodes,'scroll:change');
    });
    
    
    // persistent
    if(persistent !== true)
    {
        const handlerDocument = aelOnce(document,'doc:unmountPage',function() {
            rel(window,handler);
        });
        
        aelOnce(this,'component:teardown',function() {
            rel(window,handler);
            rel(document,handlerDocument);
        });
    }
    
    return this;
}