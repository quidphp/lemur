/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjaxAnchor
// clickOpen component which opens by an anchor click and triggers an ajax calls
const ClickOpenAjaxAnchor = Component.ClickOpenAjaxAnchor = function(option) 
{
    // option
    const $option = Object.assign({},option);
    
    
    // components
    Component.ClickOpenTriggerBase.call(this,$option);
    Component.ClickOpenAjax.call(this,$option);
    
    
    // handler
    setHandler(this,'ajax:config',function() {
        return trigHandler(this,'clickOpen:getTrigger');
    });
    
    setHandler(this,'clickOpen:triggerClickOpen',function() {
        trigHandler(this,'ajax:init');
    });
    
    return this;
}