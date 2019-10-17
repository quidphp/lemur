"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// general
// script of behaviours for the general navigation page of the CMS
$(document).ready(function() {
	
	// generalCols
	// function pour gérer la gestion des colonnes à afficher
	$.fn.generalCols = function()
	{
		var colsPopup = $(this).find(".popup");
		var colsCheckboxes = colsPopup.find("input[type='checkbox']");
		var colsButton = colsPopup.find("button[name='cols']");
		
        // clickOpen
        $(this).clickOpen(".toggler");
        
		// colsPopup
		colsPopup.on('invalid', function() {
			$(this).trigger('reset').addClass('invalid');
		})
		.on('valid', function() {
			$(this).trigger('reset');
			
			if(!colsButton.triggerHandler('isCurrent'))
			$(this).addClass('valid');
		})
		.on('reset', function() {
			$(this).removeClass("valid invalid");
		});
		
		// colsCheckboxes
		colsCheckboxes.fieldValidate().on('invalid', function() {
			colsPopup.trigger('invalid');
		})
		.on('valid', function() {
			colsPopup.trigger('valid');
		});
		
		// colsButton
		colsButton.block('click').on('getCheckboxSet',function() {
			if(colsCheckboxes.triggerHandlerFalse('isValid'))
			return colsCheckboxes.filter(":checked").valSet(colsButton.data("separator"),true);
		})
		.on('isCurrent',function() {
			return (colsButton.triggerHandler('getCheckboxSet') === colsButton.data('current'))? true:false;
		})
		.on('click', function() {
			$(this).trigger('redirect');
		})
		.on('redirect', function() {
			var href = $(this).dataHrefReplaceChar($(this).triggerHandler('getCheckboxSet'));
			
			if($.isStringNotEmpty(href) && href !== $.currentRelativeUri())
			{
				$(this).trigger('block');
				$(document).trigger('navigation:push',[href]);
			}
		});
		
		return this;
	}
	
	
	// generalRows
	// function pour gérer les actions reliés aux checkboxes de rows
	$.fn.generalRows = function()
	{
		var rowsCheckboxes = $(this);
		var rowsToggleAll = $(document).find("main table th.rows .toggleAll");
		var rowsTool = $(document).find("main .tool");
		var rowsInNotIn = $(document).find("main .tool .in,main .tool .notIn");

		// rowsToggleAll
		rowsToggleAll.on('click', function() {
			$(this).trigger('toggleAll');
		})
		.on('toggleAll', function() {
			var allChecked = rowsCheckboxes.triggerHandlerFalse('isChecked');
			$(this).trigger((allChecked === true)? 'uncheck':'check');
		})
		.on('check', function() {
			rowsCheckboxes.trigger('check');
		})
		.on('uncheck', function() {
			rowsCheckboxes.trigger('uncheck');
		})
		.on('allChecked', function() {
			$(this).addClass('all-checked');
		})
		.on('notAllChecked', function() {
			$(this).removeClass('all-checked');
		});
		
		// rowsTool
		rowsTool.on('show', function() {
			$(this).css('visibility','visible');
		})
		.on('hide', function() {
			$(this).css('visibility','hidden');
		});
		
		// rowsIn + notIn
		rowsInNotIn.block('click').on('getCheckboxSet',function() {
			var separator = $(this).data("separator");
			return rowsCheckboxes.filter(":checked").valSet(separator,true);
		})
		.on('click', function() {
			$(this).trigger('redirect');
		})
		.on('redirect', function() {
			var href = $(this).dataHrefReplaceChar($(this).triggerHandler('getCheckboxSet'));
			
			if($.isStringNotEmpty(href) && href !== $.currentRelativeUri())
			{
				$(this).trigger('block');
				$(document).trigger('navigation:push',[href]);
			}
		});
		
		// rowsCheckboxes
		rowsCheckboxes.on('isChecked',function() {
			return $(this).is(":checked");
		})
		.on('change', function() {
			$(this).trigger(($(this).triggerHandler('isChecked') === true)? 'check':'uncheck');
		})
		.on('check', function() {
			$(this).parents("tr").addClass('selected');
			$(this).prop('checked',true).trigger('update');
		})
		.on('uncheck', function() {
			$(this).parents("tr").removeClass('selected');
			$(this).prop('checked',false).trigger('update');
		})
		.on('update', function() {
			var oneChecked = rowsCheckboxes.triggerHandlerTrue('isChecked');
			var allChecked = rowsCheckboxes.triggerHandlerFalse('isChecked');
			rowsTool.trigger((oneChecked === true)? 'show':'hide');
			rowsToggleAll.trigger((allChecked === true)? 'allChecked':'notAllChecked');
		});
		
		return this;
	}
	
	
	// general
    // comportement pour la page de navigation
	$(this).on('route:general', function() {
		
		var search = $(this).find("main .left > .search");
		var pageLimit = $(this).find("main input[name='limit'],input[name='page']");
		var generalCols = $(this).find("main th.action");
		var rowsCheckboxes = $(this).find("main table td.rows input[type='checkbox']");
		var formTruncate = $(this).find("main .truncate form");
		var multiDelete = $(this).find("main .tool .multi-delete form");
		var multiDeletePrimaries = multiDelete.find("input[name='primaries']");
		var filter = $(this).find("main th.filterable .filter-outer");
		
		// search
		if(search.length)
		{
			var searchInput = search.find(".form input[type='text']");
			var searchButton = search.find(".form button");
			var searchSlide = search.find(".in");
			searchInput.searchGeneralInput(searchButton).searchSlide(searchSlide);
		}
		
		// page + limit
		if(pageLimit.length)
		pageLimit.numericGeneralInput();
		
		// cols
		if(generalCols.length)
		generalCols.generalCols();
		
		// rows
		if(rowsCheckboxes.length)
		rowsCheckboxes.generalRows();
		
		// formTruncate
		if(formTruncate.length)
		{
			formTruncate.block('submit').confirm('submit').on('confirmed', function() {
				$(this).trigger('block');
			});
		}
		
		// multiDelete
		if(multiDelete.length)
		{
			multiDelete.block('submit').confirm('submit').on('confirmed', function(event,submit) {
				var separator = $(this).data('separator');
				var set = rowsCheckboxes.filter(":checked").valSet(separator,true);
				if($.isStringNotEmpty(set))
				{
					multiDeletePrimaries.val(set);
					$(this).trigger('block');
				}
				
				else
				submit.preventDefault();
			});
		}
		
		// filter
		if(filter.length)
		filter.filterGeneralFull(true,true)
	});
});