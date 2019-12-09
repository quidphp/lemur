/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// timeout
// behaviours for a timeout component, triggers an event once a timeout has completed
const Timeout = Component.Timeout = function(type,timeout)
{
    // func
    setFunc(this,'timeout:duration',function(type) {
        return timeout || $(this).data('timeout-'+type) || 500;
    });
    
    setFunc(this,'timeout:getObj',function() {
        return Pojo.copy(getTimeoutObj.call(this));
    });
    
    setFunc(this,'timeout:set',function(type) {
        Str.check(type,true);
        const $this = $(this);
        const duration = triggerFunc(this,'timeout:duration',type);
        const timeoutObj = getTimeoutObj.call(this);
        const timeout = setTimeout(function() {
            triggerEvent($this,'timeout:'+type);
        },duration);
        
        triggerFunc(this,'timeout:clear',type);
        Pojo.setRef(type,timeout,timeoutObj);
    })
    
    setFunc(this,'timeout:clear',function(type) {
        Str.check(type,true);
        const oldTimeout = getTimeout.call(this,type);
        
        if(oldTimeout != null)
        clearTimeout(oldTimeout);
    });
    
    
    // event
    ael(this,type,function() {
        triggerFunc(this,'timeout:set',type);
    });
    
    
    // getTimeout
    const getTimeout = function(type)
    {
        return Pojo.get(type,getTimeoutObj.call(this));
    }
    
    
    // getTimeoutObj
    const getTimeoutObj = function() 
    {
        return Dom.getOrSetData(this,'timeout-obj',{});
    }
    
    return this;
}