/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// ajax
// script to activate ajax with an event on the nodes
const Ajax = Component.Ajax = function(type) 
{
    // handler
    setHandler(this,'ajax:confirm',function() {
        return (trigHandler(document,'doc:isLoading') === true)? false:true;
    });
    
    setHandler(this,'ajax:trigger',function(config,triggerEvent) {
        let r = null;
        
        if(!Pojo.isNotEmpty(config))
        {
            config = trigHandler(this,'ajax:config');
            
            if(Dom.isNode(config))
            config = Xhr.configFromNode(config);
            
            else if(Str.is(config))
            config = {url: config};
        }
        
        if(Pojo.isNotEmpty(config))
        {
            Xhr.configNodeEvents(this,config);
            r = Xhr.trigger(config);
        }
        
        if(r != null && triggerEvent != null)
        Evt.preventStop(triggerEvent,true);
        
        return r;
    });
    
    setHandler(this,'ajax:config',function(triggerEvent) {
        return this;
    });
    
    setHandler(this,'ajax:init',function(config) {
        trigEvt(this,type,config);
    });
    
    
    // event
    ael(this,type,function(event,config) {
        event.stopPropagation();
        trigHandler(this,'ajax:trigger',config,event);
    });
    
    return this;
}