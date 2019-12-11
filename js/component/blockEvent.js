/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// blockEvent
// script of behaviours for a component which blocks event propagation
// this component can only block events added after the block was registered
const BlockEvent = Component.BlockEvent = function(type) 
{
    // handler
    setHandler(this,'blockEvent:isRegistered',function(type) {
        return (Integer.is(getBlock.call(this,type)))? true:false;
    });
    
    setHandler(this,'blockEvent:isUnblocked',function(type) {
        return (getBlock.call(this,type) === 0)? true:false;
    });
    
    setHandler(this,'blockEvent:isBlocked',function(type) {
        return (getBlock.call(this,type) === 1)? true:false;
    });
    
    setHandler(this,'blockEvent:getObj',function() {
        return Pojo.copy(getBlockObj.call(this));
    });
    
    setHandler(this,'blockEvent:register',function(type) {
        if(!trigHandler(this,'blockEvent:isRegistered',type))
        {
            const blockObj = getBlockObj.call(this);
            const handler = getHandler.call(this,type);
            Pojo.setRef(type,0,blockObj);
            ael(this,type,handler,'blockEvent-register-'+type);
        }
    });
    
    setHandler(this,'blockEvent:unregister',function(type) {
        if(trigHandler(this,'blockEvent:isRegistered',type))
        {
            const blockObj = getBlockObj.call(this);
            Pojo.unsetRef(type,blockObj);
            rel(this,'blockEvent-register-'+type);
        }
    });
    
    setHandler(this,'blockEvent:block',function(type) {
        Str.check(type,true);
        const blockObj = getBlockObj.call(this);
        
        if(Debug.is('blockEvent'))
        console.log('blockEvent:block',type);
        
        if(Pojo.keyExists(type,blockObj))
        Pojo.setRef(type,1,blockObj);
    });
    
    setHandler(this,'blockEvent:block-all',function() {
        const $this = this;
        const blockObj = getBlockObj.call(this);
        
        Obj.each(blockObj,function(value,type) {
            trigHandler($this,'blockEvent:block',type);
        });
    });
    
    setHandler(this,'blockEvent:unblock',function(type) {
        Str.check(type,true);
        const blockObj = getBlockObj.call(this);
        
        if(Debug.is('blockEvent'))
        console.log('blockEvent:unblock',type);
        
        if(Pojo.keyExists(type,blockObj))
        Pojo.setRef(type,0,blockObj);
    });
    
    setHandler(this,'blockEvent:unblock-all',function() {
        const $this = this;
        const blockObj = trigHandler(this,'blockEvent:obj');
        
        Obj.each(blockObj,function(value,type) {
            trigHandler($this,'blockEvent:unblock',type);
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
                trigEvt(this,'blockEvent:'+type);
                
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
    trigHandlers(this,'blockEvent:register',type);
    
    return this;
}