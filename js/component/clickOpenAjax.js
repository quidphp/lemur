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
        closeUnsetContent: true
    },option);
    

    // components
    Component.AjaxBlock.call(this,{ajaxEvent: $option.ajaxEvent});    
    Component.ClickOpen.call(this,$option);
    
    
    // handler
    setHandler(this,'ajaxBlock:getContentNode',function() {
        return trigHandler(this,'clickOpen:getTargetContent');
    });
    
    
    // ael
    ael(this,'ajaxBlock:before',function() {
        trigEvt(this,'clickOpen:open');
    });
    
    ael(this,'ajaxBlock:success',function() {
        trigEvt(this,'clickOpen:loaded');
    });
    
    return this;
}