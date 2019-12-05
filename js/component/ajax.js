/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// ajax
// script to activate ajax with an event on the nodes
const Ajax = function(type) 
{
    // nodes
    const $nodes = this;
    
    
    // func
    setFunc(this,'ajax:confirm',function() {
        return (triggerFunc(document,'doc:isLoading') === true)? false:true;
    });
    
    setFunc(this,'ajax:trigger',function(triggerEvent) {
        const configNode = triggerFunc(this,'ajax:getNodeConfig',triggerEvent);
        const config = Xhr.configFromNode(configNode);
        const r = Xhr.trigger(this,config);
        
        if(r !== false && triggerEvent != null)
        {
            triggerEvent.stopImmediatePropagation();
            triggerEvent.preventDefault();
        }
        
        return r;
    });
    
    setFunc(this,'ajax:getNodeConfig',function(triggerEvent) {
        return this;
    });
    
    
    // event
    ael(this,type,function(event) {
        event.stopPropagation();
        triggerFunc(this,'ajax:trigger',event);
    });
    
    return this;
}

// export
Component.Ajax = Ajax;