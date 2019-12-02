/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ajaxBlock
// intègre la logique ajax, block et loading via une même méthode
Component.ajaxBlock = function(type)
{
    type = type || 'click';
    
    Component.block.call(this,type);
    Component.Ajax.call(this,type);
    
    $(this).on('ajaxBlock:getStatusNode',function(event) {
        return $(this);
    })
    .on('ajax:before',function(event) {
        triggerFunc(this,'ajaxBlock:getStatusNode').attr('data-status','loading');
        triggerCustom(this,'block');
    })
    .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
        triggerFunc(this,'ajaxBlock:getStatusNode').attr("data-status",'error');
    })
    .on('ajax:success',function(event,data,textStatus,jqXHR) {
        triggerFunc(this,'ajaxBlock:getStatusNode').attr("data-status",'ready');
    })
    .on('ajax:complete',function(event) {
        triggerCustom(this,'unblock');
    });
    
    return this;
}