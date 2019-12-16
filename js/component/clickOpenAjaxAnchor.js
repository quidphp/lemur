/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjaxAnchor
// clickOpen component which opens by an anchor click and triggers an ajax calls
Component.ClickOpenAjaxAnchor = function(option) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.ClickOpenTriggerBase.call(this,option);
    Component.ClickOpenAjax.call(this,option);
    
    
    // handler
    setHdlr(this,'ajax:config',function() {
        return trigHdlr(this,'clickOpen:getTrigger');
    });
    
    setHdlr(this,'clickOpen:triggerClickOpen',function() {
        trigHdlr(this,'ajax:init');
    });
    
    return this;
}