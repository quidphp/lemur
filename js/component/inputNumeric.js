"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumeric
// script with logic for an input containing a number
(function ($, document, window) {
	
	// inputNumeric
	// gère les comportements pour un input numérique comme page ou limit
	$.fn.inputNumeric = function()
	{
		$(this).block('change').timeout('keyup').fieldValidateFull()
		.on('focus', function() {
			$(this).val("");
		})
        .on('focusout', function(event) {
            event.stopImmediatePropagation();
            $(this).trigger('inputNumeric:reset');
        })
        .on('change', function() {
			$(this).trigger('inputNumeric:reset');
		})
        .on('keyup:onTimeout', function() {
			$(this).trigger('change');
		})
		.on('validate:invalid', function() {
			var current = String($(this).data("current"));
			$(this).val(current);
			$(this).trigger('validate:valid');
		})
        .on('inputNumeric:reset', function(event) {
            if(!$(this).inputValue(true))
			$(this).trigger('validate:invalid');
			$(this).trigger('inputNumeric:redirect');
        })
		.on('inputNumeric:redirect', function() {
			var val = $(this).inputValue(true);
			var current = String($(this).data("current"));
			var max = $(this).data('max');
			
			if($(this).triggerHandler('validate:isValid') && val !== current)
			{
				if($.isNumeric(max) && val > max)
				val = max;
				
				var href = $(this).dataHrefReplaceChar(val);
				if($.isStringNotEmpty(href))
				{
					$(this).trigger('block');
					$(document).trigger('navigation:push',[href])
				}
			}
		});
		
		return this;
	}
	
}(jQuery, document, window));