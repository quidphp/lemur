"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// script with some clickOpen-related components
(function ($, document, window) {
	
	// clickOpen
	// gère les comportements de base pour un élément clickOpen
	$.fn.clickOpen = function()
	{        
		$(this).outsideClick('clickOpen:close').on('clickOpen:isOpen', function(event) {
			return $(this).hasClass("active");
		})
		.on('clickOpen:isInit', function(event) {
			return ($(this).data('clickOpen:init') === true)? true:false;
		})
		.on('clickOpen:getPopup', function(event) {
			return $(this).find(".popup").first();
		})
		.on('clickOpen:getParentContainer', function(event) {
			var r = $(this).parents(".popup").first();
			r = (!r.length)? $(document):r;
			return r;
		})
		.on('clickOpen:open', function(event) {
			event.stopPropagation();
            $(this).trigger('clickOpen:closeOthers');
			if($(this).triggerHandler('clickOpen:isOpen') !== true)
			{
				if($(this).triggerHandler('clickOpen:isInit') !== true)
				{
					$(this).triggerHandler('clickOpen:firstOpen');
					$(this).data('clickOpen:init',true);
				}
				$(this).addClass('active with-click-open');
			}
		})
		.on('clickOpen:close', function(event) {
			event.stopPropagation();
			if($(this).triggerHandler('clickOpen:isOpen') === true)
			$(this).removeClass('active with-click-open');
		})
        .on('clickOpen:closeOthers', function(event) {
            var parent = $(this).triggerHandler('clickOpen:getParentContainer');
            parent.find(".with-click-open").not($(this)).trigger('clickOpen:close');
        })
        .on('clickOpen:closeAll', function(event) {
            var parent = $(this).triggerHandler('clickOpen:getParentContainer');
            parent.find(".with-click-open").trigger('clickOpen:close');
        })
		.on('clickOpen:prepare', function(event) {
			event.stopPropagation();
			var container = $(this).triggerHandler('clickOpen:getPopup');
			
			container.on('click', 'a', function(event) {
				event.stopPropagation();
				$(document).trigger('navigation:clickEvent',[event]);
			})
			.on('click', function(event) {
				event.stopPropagation();
				$(this).find(".with-click-open").trigger('clickOpen:close');
			});
		})
		.trigger('clickOpen:prepare');
		
		return this;
	}
	
	
    // clickOpenTrigger
    // gère les comportements pour le trigger d'un élément clickOpen
    $.fn.clickOpenTrigger = function(trigger,triggerEvent)
    {
        triggerEvent = $.isStringNotEmpty(triggerEvent)? triggerEvent:"click";

        $(this).on('clickOpen:getTrigger', function(event) {
            var r = $(this);
            
            if($.isStringNotEmpty(trigger))
            r = $(this).find(trigger);
            
            return r;
		})
        .on('clickOpen:prepare', function(event) {
			var $this = $(this);
			var trigger = $(this).triggerHandler('clickOpen:getTrigger');
			
			if(trigger.length)
			{
                trigger.on('click', 'a', function(event) {
                    event.stopPropagation();
    				$(document).trigger('navigation:clickEvent',[event]);
                })
                .on(triggerEvent, function(event) {
					event.stopPropagation();
                    event.preventDefault();
                    
					var isOpen = $this.triggerHandler('clickOpen:isOpen');
                    $(this).trigger('clickOpen:closeAll');
					if(isOpen === false)
					$this.trigger('clickOpen:open');
				});
			}
		});
        
        return this;
    }
    
    
    // clickOpenWithTrigger
    // gère les comportements pour un click open avec un trigger
    $.fn.clickOpenWithTrigger = function(trigger,triggerEvent)
    {
        $(this).clickOpenTrigger(trigger,triggerEvent).clickOpen();
        
        return this;
    }
    
    
    // clickOpenAjax
    // gère un click open qui s'ouvre lors d'un événement et déclenche une requête ajax
    $.fn.clickOpenAjax = function(triggerEvent,closeOnOpen)
    {
        triggerEvent = $.isStringNotEmpty(triggerEvent)? triggerEvent:"click";

        $(this).on(triggerEvent, function(event) {
            if($(this).triggerHandler('clickOpen:isOpen') && closeOnOpen === true)
            {
                event.preventDefault();
                event.stopImmediatePropagation();
                $(this).trigger('clickOpen:close');
            }
        })
        .on('ajax:before', function() {
            $(this).trigger('block');
            $(this).trigger('clickOpen:open');
        })
        .on('ajax:success', function(event,data,textStatus,jqXHR) {
            $(this).triggerHandler('clickOpen:getPopup').html(data);
            $(this).trigger('clickOpen:ready');
        })
        .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
            $(this).triggerHandler('clickOpen:getPopup').html($.parseError(jqXHR,textStatus));
        })
        .on('ajax:complete', function() {
            $(this).trigger('unblock');
            $(this).attr("data-status",'ready');
        })
        .on('clickOpen:open', function() {
            $(this).attr("data-status",'loading');
            $(this).triggerHandler('clickOpen:getPopup').html("");
        })
        .on('clickOpen:close', function(event) {
			$(this).removeAttr('data-status');
			$(this).triggerHandler('clickOpen:getPopup').html('');
		}).block(triggerEvent).ajax(triggerEvent).clickOpen();
        
        return this;
    }
	
}(jQuery, document, window));