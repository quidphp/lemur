/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAjax
// gère un click open qui s'ouvre lors d'un événement et déclenche une requête ajax
Component.clickOpenAjax = function(triggerEvent,closeOnOpen,target)
{
    triggerEvent = Str.isNotEmpty(triggerEvent)? triggerEvent:"click";

    $(this).on(triggerEvent, function(event) {
        if(triggerFunc(this,'clickOpen:isOpen') && closeOnOpen === true)
        {
            event.preventDefault();
            event.stopImmediatePropagation();
            triggerCustom(this,'clickOpen:close');
        }
    })
    .on('ajax:before', function(event) {
        event.stopPropagation();
        triggerCustom(this,'block');
        triggerCustom(this,'clickOpen:open');
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        event.stopPropagation();
        triggerFunc(this,'clickOpen:setTargetContent',[data]);
        triggerCustom(this,'clickOpen:ready');
    })
    .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
        event.stopPropagation();
        triggerFunc(this,'clickOpen:setTargetContent',[parsedError]);
    })
    .on('ajax:complete', function(event) {
        event.stopPropagation();
        triggerCustom(this,'unblock');
        $(this).attr("data-status",'ready');
    })
    .on('clickOpen:open', function(event) {
        event.stopPropagation();
        $(this).attr("data-status",'loading');
        triggerFunc(this,'clickOpen:unsetTargetContent');
    })
    .on('clickOpen:close', function(event) {
        event.stopPropagation();
        $(this).removeAttr('data-status');
        triggerFunc(this,'clickOpen:unsetTargetContent');
    });
    
    Component.block.call(this,triggerEvent);
    Component.ajax.call(this,triggerEvent);    
    Component.clickOpen.call(this,target);
    
    return this;
}