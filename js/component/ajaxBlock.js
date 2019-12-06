/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ajaxBlock
// intègre la logique ajax, block et loading via une même méthode
const AjaxBlock = function(type)
{
    // nodes
    const $nodes = this;
    
    
    // type
    type = type || 'click';
    
    
    // blockEvent + ajax
    Component.BlockEvent.call(this,type);
    Component.Ajax.call(this,type);
    
    
    // func
    setFunc(this,'ajaxBlock:isReady',function() {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        return ($(node).attr("data-status") === 'ready')? true:false;
    });
    
    setFunc(this,'ajaxBlock:getStatusNode',function() {
        return this;
    });
    
    setFunc(this,'ajaxBlock:getContentNode',function() {
        return triggerFunc(this,'ajaxBlock:getStatusNode');
    });
    
    setFunc(this,'ajaxBlock:setContent',function(html,isError) {
        const node = triggerFunc(this,'ajaxBlock:getContentNode');
        $(node).html(html);
    });
    
    setFunc(this,'ajaxBlock:bindContent',function() {
        const node = triggerFunc(this,'ajaxBlock:getContentNode');
        triggerEvent(document,'doc:mountCommon',node);
    });
    
    setFunc(this,'ajax:before',function(jqXHR,setting) {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        $(node).attr('data-status','loading');
        triggerFunc(this,'blockEvent:block',type);
        triggerEvent(this,'ajaxBlock:before',jqXHR,setting);
    });
    
    setFunc(this,'ajax:error',function(parsedError,jqXHR,textStatus,errorThrown) {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        $(node).attr("data-status",'error');
        triggerFunc(this,'ajaxBlock:setContent',parsedError,true);
        triggerEvent(this,'ajaxBlock:error',parsedError,jqXHR,textStatus,errorThrown);
    });
    
    setFunc(this,'ajax:success',function(data,textStatus,jqXHR) {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        $(node).attr("data-status",'ready');
        triggerFunc(this,'ajaxBlock:setContent',data,false);
        triggerFunc(this,'ajaxBlock:bindContent');
        triggerEvent(this,'ajaxBlock:success',data,textStatus,jqXHR);
    });
    
    setFunc(this,'ajax:complete',function(jqXHR,textStatus) {
        triggerFunc(this,'blockEvent:unblock',type);
        triggerEvent(this,'ajaxBlock:complete',jqXHR,textStatus);
    });
    
    return this;
}

// export
Component.AjaxBlock = AjaxBlock;