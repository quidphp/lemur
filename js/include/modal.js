"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// modal
// script with behaviours for a modal widget (popup in a fixed div)
(function ($, document, window) {
	
	// modal
	// gère les comportents pour une l'ouverture et la fermeture d'un overlay modal
	$.fn.modal = function()
	{
		if($(this).length === 1)
		{
			var modal = $(this);
			
			$(this).block('modal:get').escapeCatch().on('modal:getInner', function(event) {
				return $(this).find(".inner");
			})
			.on('click', '.close', function(event) {
				modal.trigger('modal:close');
				event.stopImmediatePropagation();
			})
			.on('modal:isEmpty', function(event) {
				return ($(this).triggerHandler('modal:getInner').html().length > 0)? false:true;
			})
			.on('modal:hasText', function(event) {
				return ($(this).triggerHandler('modal:getInner').text().length > 0)? true:false;
			})
			.on('modal:getOpenPromise', function(event) {
				if($(this).data('modal-promise') == null)
				$(this).trigger('modal:open');
				return $(this).data('modal-promise')
			})
			.on('modal:open', function(event,route) {
				$(this).attr('data-status','loading');
				if($.isStringNotEmpty(route))
				$(this).attr('data-route',route);
				
				var promise = $(this).fadeIn(500).delay(250).promise();
				$(this).data('modal-promise',promise);
			})
			.on('modal:opened', function(event) {
				$(this).attr('data-status','ready');
				$(this).removeData('promise');
			})
			.on('modal:html', function(event,data,callback) {
				var promise = $(this).triggerHandler('modal:getOpenPromise');
				promise.done(function() {
					$(this).trigger('modal:opened');
					$(this).triggerHandler('modal:getInner').html(data);
					
					if($.isFunction(callback))
					callback.call();
				});
			})
			.on('modal:close', function(event) {
				$(this).fadeOut(500, function() {
					$(this).triggerHandler('modal:getInner').html("");
                    $(this).removeAttr('data-route');
                    $(this).attr('data-status','inactive');
				});
			})
			.on('modal:openSelf', function(event,route) {
				$(this).trigger('modal:open',[route]);
				$(this).trigger('modal:opened');
			})
			.on('modal:get', function(event,href,args,route) {
				if($.isStringNotEmpty(href))
				{
					$(this).trigger('block');
					$(this).trigger('modal:open',[route]);
					$.ajax(href,{
						data: args,
						method: 'get',
						success: function(data,textStatus,jqXHR) {
							var callback = function() {
								modal.trigger('modal:route');
								modal.trigger('modal:success',[modal]);
							};
							modal.trigger('modal:html',[data,callback]);
							modal.trigger('unblock');
						},
						error: function(jqXHR,textStatus,errorThrown) {
							modal.trigger('modal:html', [$.parseError(jqXHR,textStatus)]);
							modal.trigger('unblock');
						}
					});
				}
			})
			.on('modal:route', function(event) {
				var route = $(this).data('route');
				if($.isStringNotEmpty(route))
				$(document).trigger('modal:'+route,[$(this)]);
			})
			.on('escape:catched', function(event) {
				$(this).trigger('modal:close');
			})
			.on('click', function(event) {
				$(this).trigger('modal:close');
			});
			
			// inner
			$(this).triggerHandler('modal:getInner').on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', '.close', function(event) {
				modal.trigger('modal:close');
				event.stopPropagation();
			});
		}
		
		return this;
	}
	
	
	// modalAjax
	// gère les comportements pour les éléments qui ouvre le modal et y injecte du contenu via ajax
	$.fn.modalAjax = function(modal)
	{
		$(this).block('click').ajax('click')
		.on('ajax:beforeSend', function() {
			$(this).trigger('block');
			modal.trigger('modal:open',[$(this).data('modal')]);
		})
		.on('ajax:success', function(event,data,textStatus,jqXHR) {
			var $this = $(this);
			var callback = function() {
				modal.trigger('modal:route');
				$this.trigger('modal:success',[modal]);
			};
			modal.trigger('modal:html',[data,callback]);
			$(this).trigger('unblock');
		})
		.on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
			modal.trigger('modal:html', [$.parseError(jqXHR,textStatus)]);
			$(this).trigger('unblock');
		});
		
		return this;
	}
	
	
	// externalModal
	// permet de gérer l'ouverture du modal lors du clique sur un lien externe
	$.fn.externalModal = function(modal,href,route)
	{
		if($.isStringNotEmpty(href))
		{
			$(this).find("a:external:not(.external)").off('click').on('click', function(event) {
				event.preventDefault();
				var uri = $(this).attr('href');
				modal.trigger('modal:get',[href,{v: uri},route]);
			});
		}
		
		return this;
	}
	
	
	// mailtoModal
	// permet de gérer l'ouverture du modal lors du clique sur un lien mailto
	$.fn.mailtoModal = function(modal,href,route)
	{
		if($.isStringNotEmpty(href))
		{
			$(this).find("a[href^='mailto:']:not(.mailto)").off('click').on('click', function(event) {
				event.preventDefault();
				var email = $.mailto($(this).attr('href'));
				modal.trigger('modal:get',[href,{v: email},route])
			});
		}
		
		return this;
	}
	
}(jQuery, document, window));