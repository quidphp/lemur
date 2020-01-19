/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// resizeChange
// component to notify nodes when window size has changed or stopped
Component.ResizeChange = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        persistent: false,
        stop: 100,
        passive: true
    },option);
    
    
    // nodes
    const $nodes = this;
    const listener = ($option.passive === true)? aelPassive:ael;
    let handlerStop;


    // event
    const handler = listener(window,'resize',function(event) {
        trigEvt($nodes,'resize:change',event);
    });
    
    
    // stop
    if(Integer.is($option.stop))
    {
        handlerStop = listener($option.scroller,'resize',Func.debounce($option.stop,function(event) {
            trigEvt($nodes,'resize:stop',event);
        }));
    }
    
    
    // persistent
    if($option.persistent !== true)
    {
        aelOnce(document,'doc:unmountPage',function() {
            rel(window,handler);
            
            if(handlerStop)
            rel(window,handlerStop);
        });
        
        aelOnce(this,'component:teardown',function() {
            rel(window,handler);
            
            if(handlerStop)
            rel(window,handlerStop);
        });
    }
    
    return this;
}