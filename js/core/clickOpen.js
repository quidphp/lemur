"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// script with some clickOpen-related components

// clickOpen
// gère les comportements pour un élément clickOpen y compris le escape et outside click
quid.core.clickOpen = $.fn.clickOpen = function(target)
{   
    $(this).outsideClick('clickOpen:close').escapeCatch().clickOpenBase(target)
    .on('clickOpen:open', function(event) {
        if($(this).is('[tabindex]'))
        $(this).focus();
    })
    .on('clickOpen:prepare', function(event) {
        event.stopPropagation();
        var $this = $(this);
        var container = $(this).triggerHandler('clickOpen:getTarget');
        
        container.enterCatch()
        .on('click', 'a', function(event) {
            event.stopPropagation();
            $(document).trigger('document:clickEvent',[event]);
        })
        .on('click', function(event) {
            event.stopPropagation();
            var attr = $this.triggerHandler('clickOpen:getAttr');
            $(this).find("["+attr+"='1']").trigger('clickOpen:close');
        });
    })
    .on('escape:prevent', function(event) {
        return ($(this).triggerHandler('clickOpen:isOpen'))? true:false;
    })
    .on('escape:blocked', function(event) {
        event.stopPropagation();
        $(this).trigger('clickOpen:close');
    })
    .trigger('clickOpen:prepare');
    
    return this;
}

// clickOpenBase
// gère les comportements basique pour un élément clickOpen
quid.core.clickOpenBase = $.fn.clickOpenBase = function(target)
{
    $(this).on('clickOpen:isInit', function(event) {
        return ($(this).data('clickOpen:init') === true)? true:false;
    })
    .on('clickOpen:isOpen', function(event) {
        return $(this).hasClass("active");
    })
    .on('clickOpen:isClose', function(event) {
        return (!$(this).triggerHandler('clickOpen:isOpen'))? true:false;
    })
    .on('clickOpen:isEmpty', function(event) {
        return $(this).triggerHandler('clickOpen:getTarget').is(":empty");
    })
    .on('clickOpen:getTarget', function(event) {
        var r = target;
        
        if(r == null)
        r = '.popup';
        
        else if(r == true)
        r = $(this);
        
        if(quid.base.isStringNotEmpty(r))
        r = $(this).find(r).first();
        
        return r;
    })
    .on('clickOpen:getAttr', function(event) {
        return 'data-click-open';
    })
    .on('clickOpen:allowMultiple', function(event) {
        return false;
    })
    .on('clickOpen:getBackgroundFrom', function(event) {
        return 'clickOpen';
    })
    .on('clickOpen:getParentContainer', function(event) {
        var attr = $(this).triggerHandler('clickOpen:getAttr');
        var r = $(this).parents("["+attr+"='1']").first();
        r = (!r.length)? $(document):r;
        return r;
    })
    .on('clickOpen:getAll', function(event) {
        var attr = $(this).triggerHandler('clickOpen:getAttr');
        return $(this).triggerHandler('clickOpen:getParentContainer').find("["+attr+"='1']");
    })
    .on('clickOpen:setTargetContent', function(event,data) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getTarget').html(data);
    })
    .on('clickOpen:unsetTargetContent', function(event) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getTarget').html('');
    })
    .on('clickOpen:toggle', function(event) {
        event.stopPropagation();
        var isOpen = $(this).triggerHandler('clickOpen:isOpen');
        $(this).trigger(((isOpen === false))? 'clickOpen:open':'clickOpen:close');
    })
    .on('clickOpen:open', function(event) {
        event.stopPropagation();
        
        if(!$(this).triggerHandler('clickOpen:allowMultiple'))
        $(this).trigger('clickOpen:closeOthers');
        
        if($(this).triggerHandler('clickOpen:isOpen') !== true)
        {
            if($(this).triggerHandler('clickOpen:isInit') !== true)
            {
                $(this).triggerHandler('clickOpen:firstOpen');
                $(this).data('clickOpen:init',true);
            }
            
            var attr = $(this).triggerHandler('clickOpen:getAttr');
            $(this).addClass('active');
            $(this).attr(attr,1);
        }
        
        var bgFrom = $(this).triggerHandler('clickOpen:getBackgroundFrom');
        $(document).trigger('document:setBackground',[bgFrom,false]);
    })
    .on('clickOpen:close', function(event) {
        event.stopPropagation();
        if($(this).triggerHandler('clickOpen:isOpen') === true)
        {
            var attr = $(this).triggerHandler('clickOpen:getAttr');
            $(this).removeClass('active');
            $(this).removeAttr(attr);
            
            $(document).trigger('document:unsetBackground',[$(this).triggerHandler('clickOpen:getBackgroundFrom')]);
        }
    })
    .on('clickOpen:closeOthers', function(event) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getAll').not($(this)).trigger('clickOpen:close');
    })
    .on('clickOpen:closeAll', function(event) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getAll').trigger('clickOpen:close');
    });
    
    return this;
}

// clickOpenTrigger
// gère les comportements pour le trigger d'un élément clickOpen
quid.core.clickOpenTrigger = $.fn.clickOpenTrigger = function(trigger,triggerEvent)
{
    triggerEvent = quid.base.isStringNotEmpty(triggerEvent)? triggerEvent:"click";

    $(this).on('clickOpen:getTrigger', function(event) {
        event.stopPropagation();
        var r = $(this);
        
        if(quid.base.isStringNotEmpty(trigger))
        r = $(this).find(trigger);
        
        return r;
    })
    .on('clickOpen:prepare', function(event) {
        event.stopPropagation();
        var $this = $(this);
        var trigger = $(this).triggerHandler('clickOpen:getTrigger');
        
        if(trigger.length)
        {
            trigger.on('click', 'a', function(event) {
                event.stopPropagation();
                $(document).trigger('document:clickEvent',[event]);
            })
            .on(triggerEvent, function(event) {
                event.stopPropagation();
                event.preventDefault();
                $this.trigger('clickOpen:toggle');
            });
        }
    });
    
    return this;
}


// clickOpenWithTrigger
// gère les comportements pour un click open avec un trigger
quid.core.clickOpenWithTrigger = $.fn.clickOpenWithTrigger = function(trigger,triggerEvent,target)
{
    $(this).clickOpenTrigger(trigger,triggerEvent).clickOpen(target);
    
    return this;
}


// clickOpenAjax
// gère un click open qui s'ouvre lors d'un événement et déclenche une requête ajax
quid.core.clickOpenAjax = $.fn.clickOpenAjax = function(triggerEvent,closeOnOpen,target)
{
    triggerEvent = quid.base.isStringNotEmpty(triggerEvent)? triggerEvent:"click";

    $(this).on(triggerEvent, function(event) {
        if($(this).triggerHandler('clickOpen:isOpen') && closeOnOpen === true)
        {
            event.preventDefault();
            event.stopImmediatePropagation();
            $(this).trigger('clickOpen:close');
        }
    })
    .on('ajax:confirm', function(event) {
        return ($(document).triggerHandler('document:isLoading') === true)? false:true;
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
    .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:setTargetContent',[quid.core.parseError(jqXHR,textStatus)]);
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
    }).block(triggerEvent).ajax(triggerEvent).clickOpen(target);
    
    return this;
}