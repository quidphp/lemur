/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjaxAnchor
// clickOpen component which opens by an anchor click and triggers an ajax calls
const ClickOpenAjaxAnchor = function(option) 
{
    // nodes
    const $nodes = this;
    
    
    // components
    Component.ClickOpenTriggerBase.call(this,option);
    Component.ClickOpenAjax.call(this,option);
    
    
    // func
    setFunc(this,'ajax:getNodeConfig',function(triggerEvent,config,tag) {
        return triggerFunc(this,'clickOpen:getTrigger');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const trigger = triggerFunc(this,'clickOpen:getTrigger');
        
        ael(trigger,'click',function(event) {
            triggerCustom($this,'ajax:init');
            event.preventDefault();
        });
    });
    
    return this;
}

// export
Component.ClickOpenAjaxAnchor = ClickOpenAjaxAnchor;