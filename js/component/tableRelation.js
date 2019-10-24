"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tableRelation
// script for a component to search and insert content within a textarea
(function ($, document, window) {
	
	// tableRelation
	// permet de gérer des menus de sélection tableRelation dont le contenu peut être inséré dans un textarea
	$.fn.tableRelation = function()
	{
		$(this).each(function(index, el) {
			var filters = $(this).find(".table-relation");
			var textarea = $(this).find("textarea").first();
			
			textarea.on('textarea:insert', function(event,html) {
				var r = false;
				
				if($.isStringNotEmpty(html))
				{
					r = true;
					var current = $(this).val();
					textarea.val(current+html);
				}
				
				return r;
			});
			
			filters.filterGeneralFull().each(function(index, el) {
                var clickOpen = $(this).triggerHandler('clickOpen:getPopup');
				$(this).triggerHandler('filter:getResult').on('click', '.insert', function(event) {
					var html = $(this).data('html');
					textarea.triggerHandler('textarea:insert',html);
					clickOpen.trigger('clickOpen:close');
					event.stopPropagation();
				});
			});
		});
		
		return this;
	}
    
}(jQuery, document, window));