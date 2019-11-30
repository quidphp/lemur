/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ajaxBlock
// intègre la logique ajax, block et loading via une même méthode
Quid.Component.ajaxBlock = function(type)
{
    type = type || 'click';
    
    Quid.Component.block.call(this,type);
    Quid.Component.ajax.call(this,type);
    
    $(this).on('ajaxBlock:getStatusNode', function(event) {
        return $(this);
    })
    .on('ajax:before', function(event) {
        $(this).triggerHandler('ajaxBlock:getStatusNode').attr('data-status','loading');
        $(this).trigger('block');
    })
    .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).triggerHandler('ajaxBlock:getStatusNode').attr("data-status",'error');
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        $(this).triggerHandler('ajaxBlock:getStatusNode').attr("data-status",'ready');
    })
    .on('ajax:complete', function(event) {
        $(this).trigger('unblock');
    });
    
    return this;
}