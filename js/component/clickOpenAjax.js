/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjax
// manages a clickOpen component which triggers an ajax request when open
Component.ClickOpenAjax = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        ajaxEvent: 'ajax:init',
        closeUnsetContent: true
    },option);
    

    // components
    Component.AjaxBlock.call(this,{ajaxEvent: $option.ajaxEvent});    
    Component.ClickOpen.call(this,$option);
    
    
    // handler
    setHdlr(this,'ajaxBlock:getContentNode',function() {
        return trigHdlr(this,'clickOpen:getTargetContent');
    });
    
    
    // ael
    ael(this,'ajaxBlock:before',function() {
        trigEvt(this,'clickOpen:open');
    });
    
    ael(this,'ajaxBlock:success',function() {
        trigEvt(this,'clickOpen:ajaxSuccess');
    });
    
    return this;
}