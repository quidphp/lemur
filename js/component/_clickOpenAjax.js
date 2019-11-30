/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjax
// gère un click open qui s'ouvre lors d'un événement et déclenche une requête ajax
quid.component.clickOpenAjax = function(triggerEvent,closeOnOpen,target)
{
    triggerEvent = quid.str.isNotEmpty(triggerEvent)? triggerEvent:"click";

    $(this).on(triggerEvent, function(event) {
        if($(this).triggerHandler('clickOpen:isOpen') && closeOnOpen === true)
        {
            event.preventDefault();
            event.stopImmediatePropagation();
            $(this).trigger('clickOpen:close');
        }
    })
    .on('ajax:before', function(event) {
        event.stopPropagation();
        $(this).trigger('block');
        $(this).trigger('clickOpen:open');
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:setTargetContent',[data]);
        $(this).trigger('clickOpen:ready');
    })
    .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:setTargetContent',[parsedError]);
    })
    .on('ajax:complete', function(event) {
        event.stopPropagation();
        $(this).trigger('unblock');
        $(this).attr("data-status",'ready');
    })
    .on('clickOpen:open', function(event) {
        event.stopPropagation();
        $(this).attr("data-status",'loading');
        $(this).triggerHandler('clickOpen:unsetTargetContent');
    })
    .on('clickOpen:close', function(event) {
        event.stopPropagation();
        $(this).removeAttr('data-status');
        $(this).triggerHandler('clickOpen:unsetTargetContent');
    });
    
    quid.component.block.call(this,triggerEvent);
    quid.component.ajax.call(this,triggerEvent);    
    quid.component.clickOpen.call(this,target);
    
    return this;
}