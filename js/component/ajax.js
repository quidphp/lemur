/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// ajax
// script to activate ajax with an event on the nodes
Component.Ajax = function(type) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlrs(this,'ajax:',{
        
        confirm: function() {
            return (trigHdlr(document,'history:isLoading') === true)? false:true;
        },
        
        config: function(triggerEvent) {
            return this;
        },
        
        init: function(config) {
            trigEvt(this,type,config);
        },
        
        trigger: function(config,triggerEvent) {
            let r = null;
            
            if(!Str.is(config) && !Pojo.isNotEmpty(config))
            {
                config = trigHdlr(this,'ajax:config');
                
                if(Ele.is(config))
                config = Xhr.configFromNode(config);
            }
            
            if(Str.is(config))
            config = Xhr.configFromString(config);
            
            if(Pojo.isNotEmpty(config))
            {
                Xhr.configNodeEvents(this,config);
                r = Xhr.trigger(config);
            }
            
            if(r != null && triggerEvent != null)
            Evt.preventStop(triggerEvent,true);
            
            return r;
        }
    });
    
    
    // event
    ael(this,type,function(event,config) {
        trigHdlr(this,'ajax:trigger',config,event);
        Evt.preventStop(event);
    });
    
    return this;
}