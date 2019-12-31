/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollChange
// component to notify nodes when window scroll has changed
Component.ScrollChange = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        scroller: window,
        persistent: false
    },option);
    
    
    // nodes
    const $nodes = this;
    
    
    // event
    const handler = ael($option.scroller,'scroll',function(event) {
        trigEvt($nodes,'scroll:change',event);
    });
    
    
    // persistent
    if($option.persistent !== true)
    {
        aelOnce(document,'doc:unmountPage',function() {
            rel($option.scroller,handler);
        });
        
        aelOnce(this,'component:teardown',function() {
            rel($option.scroller,handler);
        });
    }
    
    return this;
}