/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjax
// manages a clickOpen component which triggers an ajax request when open
const ClickOpenAjax = function(option)
{
    // nodes
    const $nodes = this;
    
    
    // option
    const $option = Object.assign({
        ajaxEvent: 'ajax:init',
    },option);
    
    
    // components
    Component.AjaxBlock.call(this,$option.ajaxEvent);    
    Component.ClickOpen.call(this,$option);
    
    
    // func
    setFunc(this,'ajaxBlock:before',function() {
        triggerCustom(this,'clickOpen:open');
    });
    
    setFunc(this,'ajaxBlock:setContent',function(html,isError) {
        triggerFunc(this,'clickOpen:setTargetContent',html);
    });
    
    setFunc(this,'ajaxBlock:success',function(data,textStatus,jqXHR) {
        triggerCustom(this,'clickOpen:loaded');
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

// export
Component.ClickOpenAjax = ClickOpenAjax;