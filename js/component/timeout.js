/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// timeout
// behaviours for a timeout component, triggers an event once a timeout has completed
const Timeout = function(type,timeout)
{
    // nodes
    const $nodes = this;
    
    
    // func
    setFunc(this,'timeout:duration',function(type) {
        return timeout || $(this).data('timeout-'+type) || 500;
    });
    
    setFunc(this,'timeout:getObj',function() {
        return Obj.copy(getTimeoutObj.call(this));
    });
    
    setFunc(this,'timeout:set',function(type) {
        Evt.checkType(type,'timeout:set');
        const $this = $(this);
        const duration = triggerFunc(this,'timeout:duration',type);
        const timeoutObj = getTimeoutObj.call(this);
        const timeout = setTimeout(function() {
            triggerEvent($this,'timeout:'+type);
        },duration);
        
        triggerFunc(this,'timeout:clear',type);
        Obj.setRef(type,timeout,timeoutObj);
    })
    
    setFunc(this,'timeout:clear',function(type) {
        Evt.checkType(type,'timeout:clear');
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
        return Obj.get(type,getTimeoutObj.call(this));
    }
    
    
    // getTimeoutObj
    const getTimeoutObj = function() 
    {
        return Dom.getData(this,'timeout-obj',{});
    }
    
    return this;
}

// export
Component.Timeout = Timeout;