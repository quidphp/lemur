"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// general
// script of behaviours for the general navigation page of the CMS
$(document).ready(function() {
	
	// general
    // comportement pour la page de navigation
	$(this).on('route:general', function() {
		
        var main = $(this).find("main");
        var scroller = main.find(".scroller");
		var search = main.find(".left > .search");
        var formTruncate = main.find(".truncate form");
		var pageLimit = main.find("input[name='limit'],input[name='page']");
        var table = scroller.find("table").first();
        var filter = table.find("th.filterable .filter-outer");
		var colsSorter = table.find("th.action");
		var filesSlider = table.find("td[data-group='media'] .slider");
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        
        // dragScroll
        scroller.dragScroll('div');
        
        // page + limit
		pageLimit.inputNumeric();
		
        // rowsChecker
        main.callThis(quid.cms.rowsChecker);
        
		// colsSorter
		colsSorter.callThis(quid.cms.colsSorter);
		
        // filter
		filter.filterGeneralFull();
        
		// search
		if(search.length)
		{
			var searchInput = search.find(".form input[type='text']");
			var searchButton = search.find(".form button");
			var searchSlide = search.find(".in");
			searchInput.inputSearch(searchButton).focusSlide(searchSlide);
		}
		
		// formTruncate
		if(formTruncate.length)
		{
			formTruncate.block('submit').confirm('submit').on('confirmed', function() {
				$(this).trigger('block');
			});
		}
        
        // filesSlider
        filesSlider.slider(null,null,'.slider-element',false);
        
        // quickEdit
        quickEdit.callThis(quid.cms.quickEdit);
	});
});