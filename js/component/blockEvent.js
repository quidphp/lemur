/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// blockEvent
// script of behaviours for a component which blocks event propagation
// this component can only block events added after the block was registered
const BlockEvent = function(type) 
{
    // nodes
    const $nodes = this;
    
    
    // func
    setFunc(this,'blockEvent:isRegistered',function(type) {
        return (Integer.is(getBlock.call(this,type)))? true:false;
    });
    
    setFunc(this,'blockEvent:isUnblocked',function(type) {
        return (getBlock.call(this,type) === 0)? true:false;
    });
    
    setFunc(this,'blockEvent:isBlocked',function(type) {
        return (getBlock.call(this,type) === 1)? true:false;
    });
    
    setFunc(this,'blockEvent:getObj',function() {
        return Pojo.copy(getBlockObj.call(this));
    });
    
    setFunc(this,'blockEvent:register',function(type) {
        if(!triggerFunc(this,'blockEvent:isRegistered',type))
        {
            const blockObj = getBlockObj.call(this);
            const handler = getHandler.call(this,type);
            Pojo.setRef(type,0,blockObj);
            ael(this,type,handler,'blockEvent-register-'+type);
        }
    });
    
    setFunc(this,'blockEvent:unregister',function(type) {
        if(triggerFunc(this,'blockEvent:isRegistered',type))
        {
            const blockObj = getBlockObj.call(this);
            Pojo.unsetRef(type,blockObj);
            rel(this,'blockEvent-register-'+type);
        }
    });
    
    setFunc(this,'blockEvent:block',function(type) {
        Str.check(type,true);
        const blockObj = getBlockObj.call(this);
        
        if(Evt.debug() > 0)
        console.log('blockEvent:block',type);
        
        if(Pojo.keyExists(type,blockObj))
        Pojo.setRef(type,1,blockObj);
    });
    
    setFunc(this,'blockEvent:block-all',function() {
        const $this = this;
        const blockObj = getBlockObj.call(this);
        
        Obj.each(blockObj,function(value,type) {
            triggerFunc($this,'blockEvent:block',type);
        });
    });
    
    setFunc(this,'blockEvent:unblock',function(type) {
        Str.check(type,true);
        const blockObj = getBlockObj.call(this);
        
        if(Evt.debug() > 0)
        console.log('blockEvent:unblock',type);
        
        if(Pojo.keyExists(type,blockObj))
        Pojo.setRef(type,0,blockObj);
    });
    
    setFunc(this,'blockEvent:unblock-all',function() {
        const $this = this;
        const blockObj = triggerFunc(this,'blockEvent:obj');
        
        Obj.each(blockObj,function(value,type) {
            triggerFunc($this,'blockEvent:unblock',type);
        });
    });
    
    
    // getHandler
    const getHandler = function(type) 
    {
        return function(event) {
            const status = getBlock.call(this,type);
            
            if(status === 1)
            {
                Evt.preventStop(event,true);
                triggerEvent(this,'blockEvent:'+type);
                
                return false;
            }
        };
    }
    
    
    // getBlock
    const getBlock = function(type)
    {
        return Pojo.get(type,getBlockObj.call(this));
    }
    
    
    // getBlockObj
    const getBlockObj = function() 
    {
        return Dom.getOrSetData(this,'blockEvent-obj',{});
    }


    // addType
    if(Str.isNotEmpty(type))
    triggerFunc(this,'blockEvent:register',type);
    
    
    return this;
}

// block
Component.BlockEvent = BlockEvent;