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
quid.core.dragScroll = $.fn.dragScroll = function(targetTag,dividor)
{
    $(this).each(function(index, el) {
        var $this = $(this);
        var curDown = false;
        var curYPos = 0;
        var curXPos = 0;
        dividor = ($.isNumeric(dividor))? dividor:4;
        
        $(this).resizeChange()
        
        .on('resize:change', function(event) {
            $(this).trigger('dragScroll:prepare');
        })
        
        .on('dragScroll:can', function(event) {
            return ($(this).attr('data-grabbable') == 1)? true:false;
        })
        
        .on('dragScroll:required', function(event) {
            return (($(this).children().width() - $(this).width()) > 0)? true:false;
        })
        
        .on('dragScroll:prepare', function(event) {
            if($(this).triggerHandler('dragScroll:required'))
            $(this).attr('data-grabbable',1);
            else
            $(this).removeAttr('data-grabbable');
        })
        
        .on('dragScroll:stop', function(event) {
            curDown = false;
            $(this).removeAttr('data-status');
        })
        
        .on('mousemove', function(event) {
            if(curDown === true)
            {
                var newY = ((curYPos - event.pageY ) / dividor);
                var newX = ((curXPos - event.pageX ) / dividor);
                $(this).scrollTop($(this).scrollTop() + newY); 
                $(this).scrollLeft($(this).scrollLeft() + newX);
            }
        })

        .on('mousedown', function(event) {
            if($(this).triggerHandler('dragScroll:can') && $(this).triggerHandler('dragScroll:required') )
            {
                var target = $(event.target);
                
                if(event.which === 1 && target.length)
                {
                    if(targetTag == null || target.tagName() === targetTag)
                    {
                        curDown = true;
                        curYPos = event.pageY;
                        curXPos = event.pageX;
                        $(this).attr('data-status','grabbing');
                    }
                }
            }
        })

        .on('mouseup', function(event) {
            $(this).trigger('dragScroll:stop');
        })
        
        .on('mouseout', function(event) {
            event.stopPropagation();
        })
        
        .trigger('dragScroll:prepare');
        
        $(document).on('mouseout.document-mount', function(event) {
            $this.trigger('dragScroll:stop');
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