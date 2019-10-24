"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// window
// script containing logic related to window and scrolling
(function ($, document, window) {
	
    // smallWindow
	// permet l'ouverture d'une smallWindow
	// tous les paramètres de la window sont dans la balise
	$.fn.smallWindow = function()
	{
		$(this).addIds('smallWindow');
		$(this).on('click', function(event) {
			var win = window;
			var href = $(this).attr('href');
			var id = $(this).prop('id');
			var width = $(this).data('width') || 1000;
			var height = $(this).data('height') || 1000;
			var x = $(this).data('x') || 0;
			var y = $(this).data('y') || 0;
			
			if($.isNumeric(width) && $.isNumeric(height) && $.isNumeric(x) && $.isNumeric(y))
			{
				event.preventDefault();
				var param = "toolbar=no ,left="+x+",top="+y+",width="+width+",height="+height+",location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no";
				var child = win.open(href,id,param);
				child.focus();
				win.blur();
				return false;
			}
		});
		
		return this;
	}
    
    
    // resizeChange
	// permet de notifier un objet jQuery du redimensionnement de l'écran
	$.fn.resizeChange = function()
	{
		var $this = $(this);
		$(window).on('scroll', function(event) {
			$this.trigger('resize:change');
		});
		
		return this;
	}
	
	
	// scrollChange
	// permet de notifier un objet jQuery du changement de scroll
	$.fn.scrollChange = function()
	{
		var $this = $(this);
		$(window).on('scroll', function(event) {
			$this.trigger('scroll:change');
		});
		
		return this;
	}
	
    
    // hashchange
	// renvoie l'événement haschange aux objets jquerys
	$.fn.hashchange = function()
	{
		var $this = $(this);
		$(window).on('hashchange', function(event,sourceEvent) {
			$this.trigger('hash:change',[$.fragment(),sourceEvent]);
		});
		
		return this;
	}
    
    
    // alert
	// lance un message d'alerte lorsqu'un événement est triggé
	$.fn.alert = function(type)
	{
		if($.isStringNotEmpty(type))
		{
			$(this).on(type, function(event) {
				var alertText = $(this).data('alert');
				
				if($.isStringNotEmpty(alertText))
				alert(alertText);
			});
		}
		
		return this;
	}
	
	
	// confirm
	// demande une confirmation avant d'envoyer le formulaire
	// empêche le submit si confirm est faux
	$.fn.confirm = function(type) 
	{
		if($.isStringNotEmpty(type))
		{
			$(this).on(type, function(event) {
				var confirmText = $(this).data('confirm');
				
				if($.isStringNotEmpty(confirmText) && !confirm(confirmText))
				{
					event.stopImmediatePropagation();
					event.preventDefault();
					$(this).trigger('notConfirmed',[event]);
					return false;
				}
				
				else
				$(this).trigger('confirmed',[event]);
			});
		}
		
		return this;
	}
    
    
    // fragment
	// gère les changements de fragment
	$.fn.fragment = function() 
	{
		$(this).on('fragment:get', function(event) {
			return $(this).data('fragment');
		})
		.on('fragment:update', function(event) {
			var current = $.fragment();
			var fragment = $(this).triggerHandler('fragment:get');
			
			if(current !== fragment)
			{
				if($.isStringNotEmpty(fragment))
				window.location.hash = '#'+fragment;
				else
				$(this).trigger('fragment:remove');
				
				$(this).trigger('fragment:updated',[fragment]);
			}
		})
		.on('fragment:remove', function(event) {
			window.location.hash = '';
		});
		
		return this;
	}
    
}(jQuery, document, window));