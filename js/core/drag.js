"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// drag
// script with drag and drop related functionnalities

// dragScroll
// permet de faire un scroll dans un élément au clic (dragging)
// possible d'activer le scroll seulement si le mousedown a lieu sur un type de tag
quid.core.dragScroll = $.fn.dragScroll = function(targetTag)
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
            var target = $(event.target);
            
            if(event.which === 1 && target.length)
            {
                if(targetTag == null || target.tagName() === targetTag)
                {
                    curDown = true;
                    curYPos = event.pageY;
                    curXPos = event.pageX;
                    $this.attr('data-status','grabbing');
                }
            }
        });

        $(this).on('mouseup mouseout', function() {
            curDown = false;
            $this.removeAttr('data-status');
        });
    });

    return this;
}


// verticalSorting
// active le verticalSorting sur un élément
// nécessite jqueryUi
quid.core.verticalSorting = $.fn.verticalSorting = function(items,handle,containment)
{
    containment = (containment != null)? containment:'parent';
    if(quid.base.isStringNotEmpty(items) && quid.base.isStringNotEmpty(handle))
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