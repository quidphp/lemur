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
	$(this).on('route:general', function(event,routeWrap) {
		
        var main = routeWrap.find("main");
        var scroller = main.find(".scroller");
		var search = main.find(".left > .search");
        var formTruncate = main.find(".truncate form");
		var pageLimit = main.find("input[name='limit'],input[name='page']");
        var table = scroller.find("table").first();
        var filter = table.find("th.filterable .filter-outer");
		var colsSorter = table.find("th.action");
		var filesSlider = table.find("td[data-group='media'] .slider");
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        var highlight = table.find("tr.highlight");
        
        // dragScroll
        quid.core.dragScroll.call(scroller,'tbody','div');
        
        // page + limit
        quid.core.inputNumeric.call(pageLimit);
		
        // rowsChecker
        quid.component.rowsChecker.call(main).trigger('component:setup');
        
		// colsSorter
		quid.component.colsSorter.call(colsSorter).trigger('component:setup');
		
        // filter
		quid.core.filterGeneralFull.call(filter).trigger('component:setup');
        
		// search
		if(search.length)
		{
			var searchInput = search.find(".form input[type='text']");
			var searchButton = search.find(".form button");
			var searchSlide = search.find(".in");
			quid.core.inputSearch.call(searchInput,searchButton);
            quid.main.input.focusSlide.call(searchInput,searchSlide);
		}
		
		// formTruncate
		if(formTruncate.length)
		{
            quid.main.event.block.call(formTruncate,'submit');
            quid.main.window.confirm.call(formTruncate,'submit');
			formTruncate.on('confirmed', function() {
				$(this).trigger('block');
			});
		}
        
        // filesSlider
        quid.core.slider.call(filesSlider,null,null,'.slider-element',false);
        
        // quickEdit
        quid.component.quickEdit.call(quickEdit).trigger('component:setup');
        
        // highlight 
        highlight.on('mouseover', function(event) {
            $(this).removeClass('highlight');
        });
	})
    
    // unmount
    .on('route:general:unmount', function(event,routeWrap) {
        var table = routeWrap.find("main .scroller table").first();
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        
        // quickEdit
        quickEdit.trigger('quickEdit:revert');
    });
});