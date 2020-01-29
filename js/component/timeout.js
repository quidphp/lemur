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
    setHdlrs(this,'timeout:',{
        
        duration: function(type) {
            return timeout || getData(this,'timeout-'+type) || 500;
        },
        
        getObj: function() {
            return Pojo.copy(getTimeoutObj.call(this));
        },
        
        set: function(type) {
            Str.check(type,true);
            const duration = trigHdlr(this,'timeout:duration',type);
            const timeoutObj = getTimeoutObj.call(this);
            const timeout = Func.timeout(duration,function() {
                trigEvt(this,'timeout:'+type);
            },this);
            
            trigHdlr(this,'timeout:clear',type);
            Pojo.setRef(type,timeout,timeoutObj);
        },
        
        validateEvent: function(event) {
            return true;
        },
        
        clear: function(type) {
            Str.check(type,true);
            const oldTimeout = getTimeout.call(this,type);
            
            if(oldTimeout != null)
            clearTimeout(oldTimeout);
        }
    });

    
    // event
    ael(this,type,function(event) {
        if(trigHdlr(this,'timeout:validateEvent',event) === true)
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