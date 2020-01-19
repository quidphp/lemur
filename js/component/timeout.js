/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// timeout
// behaviours for a timeout component, triggers an event once a timeout has completed
Component.Timeout = function(type,timeout)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlr(this,'timeout:duration',function(type) {
        return timeout || getData(this,'timeout-'+type) || 500;
    });
    
    setHdlr(this,'timeout:getObj',function() {
        return Pojo.copy(getTimeoutObj.call(this));
    });
    
    setHdlr(this,'timeout:set',function(type) {
        Str.check(type,true);
        const $this = this;
        const duration = trigHdlr(this,'timeout:duration',type);
        const timeoutObj = getTimeoutObj.call(this);
        const timeout = Func.timeout(duration,function() {
            trigEvt($this,'timeout:'+type);
        });
        
        trigHdlr(this,'timeout:clear',type);
        Pojo.setRef(type,timeout,timeoutObj);
    })
    
    setHdlr(this,'timeout:clear',function(type) {
        Str.check(type,true);
        const oldTimeout = getTimeout.call(this,type);
        
        if(oldTimeout != null)
        clearTimeout(oldTimeout);
    });
    
    
    // event
    ael(this,type,function(event) {
        trigHdlr(this,'timeout:set',type);
    });
    
    
    // getTimeout
    const getTimeout = function(type)
    {
        return Pojo.get(type,getTimeoutObj.call(this));
    }
    
    
    // getTimeoutObj
    const getTimeoutObj = function() 
    {
        return Nod.getOrSetData(this,'timeout-obj',{});
    }
    
    return this;
}