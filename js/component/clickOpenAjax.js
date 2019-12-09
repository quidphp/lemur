/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjax
// manages a clickOpen component which triggers an ajax request when open
const ClickOpenAjax = Component.ClickOpenAjax = function(option)
{
    // option
    const $option = Object.assign({
        ajaxEvent: 'ajax:init',
    },option);
    

    // components
    Component.AjaxBlock.call(this,$option.ajaxEvent);    
    Component.ClickOpen.call(this,$option);
    
    
    // func
    setFunc(this,'ajaxBlock:getContentNode',function() {
        return triggerFunc(this,'clickOpen:getTargetContent');
    });
    
    
    // ael
    ael(this,'ajaxBlock:before',function() {
        triggerEvent(this,'clickOpen:open');
    });
    
    ael(this,'ajaxBlock:success',function() {
        triggerEvent(this,'clickOpen:loaded');
    });
    
    
    // event
    ael(this,'clickOpen:open',function() {
        triggerFunc(this,'clickOpen:unsetTargetContent');
    });
    
    ael(this,'clickOpen:close',function() {
        triggerFunc(this,'clickOpen:unsetTargetContent');
    });
    
    return this;
}