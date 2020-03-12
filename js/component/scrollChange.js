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
        stop: 50,
        passive: true
    },option);
    
    
    // nodes
    const $nodes = this;
    const listener = ($option.passive === true)? aelPassive:ael;
    let handlerStop;
    
    
    // handler
    setHdlr(this,'scrollChange:getScroller',function() {
        let r = this;
        
        if(Target.is($option.scroller))
        r = $option.scroller;
        
        else if(Str.isNotEmpty($option.scroller))
        r = qs(this,$option.scroller);
        
        return Target.check(r);
    });
    const scroller = Arr.valueFirst(trigHdlrs(this,'scrollChange:getScroller'));
    
    
    // event
    const handler = listener(scroller,'scroll',function(event) {
        trigEvt($nodes,'scroll:change',event);
    });
    
    
    // stop
    if(Integer.is($option.stop))
    {
        const handlerStop = ael($nodes,'scroll:change',Func.debounce($option.stop,function(event) {
            trigEvt($nodes,'scroll:stop',event);
        }));
    }
    
    
    // persistent
    if($option.persistent !== true)
    {
        const teardown = function() {
            rel(scroller,handler);
            
            if(handlerStop)
            rel(scroller,handlerStop);
        };
        
        aelOnce(document,'doc:unmountPage',teardown);
        aelOnce(this,'component:teardown',teardown);
    }
    
    return this;
}