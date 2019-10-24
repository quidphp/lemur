"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// form
// script with behaviours related to forms
(function ($, document, window) {
	
    // valSet
	// prend un set de input et textarea et crée un set avec les valeurs
	// un séparateur peut être fourni
	$.fn.valSet = function(separator,trim) 
	{
		var r = '';
		
		if($.isStringNotEmpty(separator))
		{
			$(this).each(function(index) {
				r += (r.length)? separator:"";
				r += $(this).inputValue(trim);
			});
		}
		
		return r;
	}
    
    
    // inputGroup
	// retourne un objet jQuery avec tous les inputs de même type et même nom
	$.fn.inputGroup = function()
	{
		var $this = $();
		
		$(this).each(function(index) {
			var name = $(this).prop("name");
			var type = $(this).prop("type");
			
			if($.isStringNotEmpty(name) && $.isStringNotEmpty(type))
			$this = $this.add($("[type='"+type+"'][name='"+name+"']"));
		});
		
		return $this;
	}
    
    
    // focusFirst
	// met le focus sur le premier input vide
	$.fn.focusFirst = function()
	{
		$(this).filter(function() {
			return !$(this).inputValue(true);
		}).first().focus();
		
		return this;
	}
    
    
    // labels
	// retourne le ou les labels liés à un élément de formulaire
	$.fn.labels = function()
	{
		var r = $();
		var id = $(this).prop('id');
		
		if($.isScalar(id))
		r = $(document).find("label[for='"+id+"']");
		
		return r;
	}
    
    
    // focusSlide
	// permet de slideDown/up une target lors du focus sur un input
	$.fn.focusSlide = function(target) 
	{
		if($(this).length === 1 && target instanceof jQuery)
		{
			$(this).on('focus', function() {
				target.slideDown("fast");
			})
			.on('focusout', function() {
				target.slideUp("fast");
			});
		}
		
		return this;
	}
    
    
    // inputValue
	// retourne la valeur pour un input ou un fakeinput
	// la valeur retourné peut être trim
	$.fn.inputValue = function(trim)
	{
		var r = null;

		if($(this).triggerHandler('isFakeInput') === true)
		r = $(this).triggerHandler('getValue');
		
		else
		r = $(this).val();
		
		if(r == null)
		r = '';
		
		if(trim === true)
		r = String(r).trim();
		
		return r;
	}
    
    
	// formHasChanged
	// permet de détecter si un formulaire a changé ou non
	$.fn.formHasChanged = function()
	{
		$(this).on('form:hasChanged', function(event) {
			var r = false;
			var target = $(this).triggerHandler('form:getTarget') || $(this);
			var serialize = target.serialize();
			var original = $(this).data('form:serialize');
			
			if(serialize !== original)
			r = true;
			
			return r;
		})
		.on('form:preparehasChanged', function(event) {
			var target = $(this).triggerHandler('form:getTarget') || $(this);
			var serialize = target.serialize();
			$(this).data('form:serialize',serialize);
		})
		.trigger('form:preparehasChanged');
		
		return this;
	}
	
	
	// formUnload
	// permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
	$.fn.formUnload = function()
	{
		var $this = $(this);
		$(this).formHasChanged().on('submit', function(event) {
			$(window).off('beforeunload');
		});;
		
		$(window).off('beforeunload').on('beforeunload', function() {
			if($this.triggerHandler('form:hasChanged'))
			return $this.data('unload');
		});
		
		return this;
	}
	
}(jQuery, document, window));