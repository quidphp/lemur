/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollChange
// component to notify nodes when window scroll has changed or stopped
Component.ScrollChange = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        scroller: window,
        persistent: false,
        stop: 100,
        passive: true
    },option);
    
    
    // nodes
    const $nodes = this;
    const listener = ($option.passive === true)? aelPassive:ael;
    let handlerStop;
    
    
    // event
    const handler = listener($option.scroller,'scroll',function(event) {
        trigEvt($nodes,'scroll:change',event);
    });
    
    
    // stop
    if(Integer.is($option.stop))
    {
        const handlerStop = listener($option.scroller,'scroll',Func.debounce($option.stop,function(event) {
            trigEvt($nodes,'scroll:stop',event);
        }));
    }
    
    
    // persistent
    if($option.persistent !== true)
    {
        const teardown = function() {
            rel($option.scroller,handler);
            
            if(handlerStop)
            rel($option.scroller,handlerStop);
        };
        
        aelOnce(document,'doc:unmountPage',teardown);
        aelOnce(this,'component:teardown',teardown);
    }
    
    return this;
}