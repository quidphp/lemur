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
    setFunc(this,'ajaxBlock:getStatusNode',function() {
        return this;
    });
    
    setFunc(this,'ajaxBlock:setContent',function(html,isError) {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        $(node).html(html);
    });
    
    setFunc(this,'ajax:before',function(jqXHR,setting) {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        $(node).attr('data-status','loading');
        triggerFunc(this,'blockEvent:block',type);
        triggerCustom(this,'ajaxBlock:before',jqXHR,setting);
    });
    
    setFunc(this,'ajax:error',function(parsedError,jqXHR,textStatus,errorThrown) {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        $(node).attr("data-status",'error');
        triggerFunc(this,'ajaxBlock:setContent',parsedError,true);
        triggerCustom(this,'ajaxBlock:error',parsedError,jqXHR,textStatus,errorThrown);
    });
    
    setFunc(this,'ajax:success',function(data,textStatus,jqXHR) {
        const node = triggerFunc(this,'ajaxBlock:getStatusNode');
        $(node).attr("data-status",'ready');
        triggerFunc(this,'ajaxBlock:setContent',data,false);
        triggerCustom(this,'ajaxBlock:success',data,textStatus,jqXHR);
    });
    
    setFunc(this,'ajax:complete',function(jqXHR,textStatus) {
        triggerFunc(this,'blockEvent:unblock',type);
        triggerCustom(this,'ajaxBlock:complete',jqXHR,textStatus);
    });
    
    return this;
}

// export
Component.AjaxBlock = AjaxBlock;