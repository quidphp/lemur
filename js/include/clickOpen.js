"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// script with some basic logic for a clickOpen widget (click trigger to show, click body to hide)
(function ($, document, window) {
	
	// clickOpen
	// gère les comportements pour un élément clickOpen, clique sur un trigger et affiche un container
    // possible de spécifier un trigger et son event
	$.fn.clickOpen = function(trigger,triggerEvent)
	{
		var clickOpen = $(this);
        trigger = $.isStringNotEmpty(trigger)? trigger:"> .trigger";
        triggerEvent = $.isStringNotEmpty(triggerEvent)? triggerEvent:"click";
        
		$(this).outsideClick('clickOpen:close').on('clickOpen:isOpen', function(event) {
			return $(this).hasClass("active");
		})
		.on('clickOpen:isInit', function(event) {
			return ($(this).data('clickOpen:init') === true)? true:false;
		})
		.on('clickOpen:getTrigger', function(event) {
			return $(this).find(trigger).first();
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
		.on('clickOpen:prepare', function(event) {
			event.stopPropagation();
			var $this = $(this);
			var trigger = $(this).triggerHandler('clickOpen:getTrigger');
			var container = $(this).triggerHandler('clickOpen:getPopup');
			var parent = $(this).triggerHandler('clickOpen:getParentContainer');
			
			if(trigger.length)
			{
                trigger.on('click', 'a', function(event) {
                    event.stopPropagation();
    				$(document).trigger('navigation:clickEvent',[event]);
                })
                .on(triggerEvent, function(event) {
					event.stopPropagation();
					var isOpen = $this.triggerHandler('clickOpen:isOpen');
					parent.find(".with-click-open").trigger('clickOpen:close');
					if(isOpen === false)
					$this.trigger('clickOpen:open');
				});
			}
			
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
	
	
    // formClickOpen
	// gère un formulaire à un champ qui s'envoie via ajax et dont le résultat s'affiche dans un clickOpen
	$.fn.formClickOpen = function(field)
	{
		if(field instanceof jQuery && field.length === 1)
		{
			var $this = $(this);
			$(this).clickOpen().block('submit').validateBlock('submit').ajax('submit')
			.on('ajax:getData', function(event) {
				var r = {};
				r[field.data('query')] = field.inputValue(true);
				return r;
			})
			.on('ajax:before', function() {
				$(this).trigger('block');
				$(this).trigger('clickOpen:open');
			})
			.on('ajax:success', function(event,data,textStatus,jqXHR) {
				$(this).triggerHandler('clickOpen:getPopup').html(data);
			})
			.on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
				$(this).triggerHandler('clickOpen:getPopup').html($.parseError(jqXHR,textStatus));
			})
			.on('ajax:complete', function() {
				$(this).removeAttr("data-status");
				$(this).trigger('unblock');
			})
			.on('clickOpen:open', function() {
				$(this).attr("data-status",'loading');
				$(this).triggerHandler('clickOpen:getPopup').html("");
			});
			
			field.timeout('keyup').fieldValidateFull()
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('keyup:onTimeout', function() {
				$(this).trigger('pattern');
			});
		}
		
		return this;
	}
	
}(jQuery, document, window));