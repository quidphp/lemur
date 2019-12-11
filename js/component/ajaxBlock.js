/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ajaxBlock
// intègre la logique ajax, block et loading via une même méthode
const AjaxBlock = Component.AjaxBlock = function(option)
{
    // option
    const $option = Object.assign({
        ajaxEvent: 'click',
        autoUnbind: false
    },option);
    
    
    // blockEvent + ajax
    Component.BlockEvent.call(this,$option.ajaxEvent);
    Component.Ajax.call(this,$option.ajaxEvent);
    
    
    // handler
    setHandler(this,'ajaxBlock:isReady',function() {
        const node = trigHandler(this,'ajaxBlock:getStatusNode');
        return ($(node).attr("data-status") === 'ready')? true:false;
    });
    
    setHandler(this,'ajaxBlock:getStatusNode',function() {
        return this;
    });
    
    setHandler(this,'ajaxBlock:getContentNode',function() {
        return trigHandler(this,'ajaxBlock:getStatusNode');
    });
    
    setHandler(this,'ajaxBlock:isEmptyContentNode',function() {
        return $(trigHandler(this,'ajaxBlock:getContentNode')).is(":empty");
    });
    
    setHandler(this,'ajaxBlock:setContent',function(html,isError) {
        const node = trigHandler(this,'ajaxBlock:getContentNode');
        $(node).html(html);
    });
    
    setHandler(this,'ajaxBlock:unsetContent',function() {
        const node = trigHandler(this,'ajaxBlock:getContentNode');
        trigEvt(this,'ajaxBlock:unmountContent');
        $(node).html('');
    });
    
    setHandler(this,'ajax:before',function(jqXHR,setting) {
        const node = trigHandler(this,'ajaxBlock:getStatusNode');
        $(node).attr('data-status','loading');
        trigHandler(this,'blockEvent:block',$option.ajaxEvent);
        trigEvt(this,'ajaxBlock:before',jqXHR,setting);
    });
    
    setHandler(this,'ajax:error',function(parsedError,jqXHR,textStatus,errorThrown) {
        const node = trigHandler(this,'ajaxBlock:getStatusNode');
        $(node).attr("data-status",'error');
        
        if($option.autoUnbind === true && !trigHandler(this,'ajaxBlock:isEmptyContentNode'))
        trigEvt(this,'ajaxBlock:unmountContent');
        
        trigHandler(this,'ajaxBlock:setContent',parsedError,true);
        trigEvt(this,'ajaxBlock:beforeMount',data,true);
        trigEvt(this,'ajaxBlock:error',parsedError,jqXHR,textStatus,errorThrown);
    });
    
    setHandler(this,'ajax:success',function(data,textStatus,jqXHR) {
        const node = trigHandler(this,'ajaxBlock:getStatusNode');
        $(node).attr("data-status",'ready');
        
        if($option.autoUnbind === true && !trigHandler(this,'ajaxBlock:isEmptyContentNode'))
        trigEvt(this,'ajaxBlock:unmountContent');
        
        trigHandler(this,'ajaxBlock:setContent',data,false);
        trigEvt(this,'ajaxBlock:beforeMount',data,false);
        trigEvt(this,'ajaxBlock:mountContent');
        trigEvt(this,'ajaxBlock:success',data,textStatus,jqXHR);
    });
    
    setHandler(this,'ajax:complete',function(jqXHR,textStatus) {
        trigHandler(this,'blockEvent:unblock',$option.ajaxEvent);
        trigEvt(this,'ajaxBlock:complete',jqXHR,textStatus);
    });
    
    
    // event
    ael(this,'ajaxBlock:mountContent',function() {
        const node = trigHandler(this,'ajaxBlock:getContentNode');
        if(node != null)
        trigEvt(document,'doc:mountCommon',node);
    });
    
    ael(this,'ajaxBlock:unmountContent',function() {
        const node = trigHandler(this,'ajaxBlock:getContentNode');
        if(node != null)
        trigEvt(document,'doc:unmountCommon',node);
    });
    
    return this;
}