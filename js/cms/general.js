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
        var filter = main.find("table th.filterable .filter-outer");
		var colsSorter = main.find("table th.action");
		var rowsChecker = main.find("table td.rows input[type='checkbox']");
		var filesSlider = main.find("table td[data-group='media'] .slider");
        
        // dragScroll
        scroller.dragScroll();
        
        // page + limit
		pageLimit.inputNumeric();
		
		// colsSorter
		colsSorter.colsSorter();
		
		// rowsChecker
		rowsChecker.rowsChecker(main);
		
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
	});
});