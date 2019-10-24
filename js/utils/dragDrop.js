"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// dragDrop
// script with drag and drop related functionnalities
(function ($, document, window) {
	
    // dragScroll
    // permet de faire un scroll dans un élément au clic (dragging)
    $.fn.dragScroll = function()
    {
        $(this).each(function(index, el) {
            var $this = $(this);
            var curDown = false;
            var curYPos = 0;
            var curXPos = 0;
            
            $(this).on('mousemove', function(event) {
                if(curDown === true)
                {
                    $this.scrollTop($this.scrollTop() + (curYPos - event.pageY)); 
                    $this.scrollLeft($this.scrollLeft() + (curXPos - event.pageX));
                }
            });

            $(this).on('mousedown', function(event) {
                curDown = true;
                curYPos = event.pageY;
                curXPos = event.pageX;
                $this.attr('data-status','grabbing');
            });

            $(this).on('mouseup', function() {
                curDown = false;
                $this.removeAttr('data-status');
            });
        });

        return this;
    }
    
    
	// verticalSorting
	// active le verticalSorting sur un élément
	// nécessite jqueryUi
	$.fn.verticalSorting = function(items,handle,containment)
	{
        containment = (containment != null)? containment:'parent';
		if($.isStringNotEmpty(items) && $.isStringNotEmpty(handle))
		{
			$(this).each(function() {
				$(this).sortable({
					axis: "y",
					handle: handle,
					items: items,
					cursor: "move",
					tolerance: 'pointer',
					opacity: 0.5,
					containment: containment,
                    stop: function() {
                        $(this).trigger('verticalSorting:stop')
                    }
				});
			});
		}
		
		return this;
	}
    
}(jQuery, document, window));