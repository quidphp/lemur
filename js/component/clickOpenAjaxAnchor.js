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
    
    
    // option
    const $option = Object.assign({
        triggerToggle: true
    },option);
    
    
    // components
    Component.ClickOpenTriggerBase.call(this,option);
    Component.ClickOpenAjax.call(this,option);
    
    
    // func
    setFunc(this,'ajax:getConfig',function(triggerEvent) {
        return triggerFunc(this,'clickOpen:getTrigger');
    });
    
    setFunc(this,'clickOpen:triggerClickOpen',function() {
        triggerEvent(this,'ajax:init');
    });
    
    return this;
}

// export
Component.ClickOpenAjaxAnchor = ClickOpenAjaxAnchor;