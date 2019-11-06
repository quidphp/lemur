"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearch
// script containing logic for a search input which redirects

// inputSearch
// gère les comportements pour un input search
quid.core.inputSearch = $.fn.inputSearch = function(button)
{
    $(this).block('change').enterBlock().timeout('keyup').fieldValidateFull()
    .on('change', function() {
        $(this).trigger('inputSearch:redirect');
    })
    .on('enter:blocked', function(event) {
        $(this).trigger('change');
    })
    .on('keyup:onTimeout', function() {
        $(this).trigger('validate:pattern');
    })
    .on('inputSearch:redirect', function() {
        var val = $(this).inputValue(true);
        var href = $(this).data("href");
        var current = $(this).data("current") || '';
        
        if($(this).triggerHandler('validate:isValid') && val !== current)
        {
            $(this).trigger('block');
            
            if(quid.base.isStringNotEmpty(val))
            {
                var char = $(this).data("char");
                val = encodeURIComponent(val);
                href += "?"+char+"="+val;
            }
            
            $(document).trigger('document:go',[href])
        }
    });
    
    if(button instanceof jQuery && button.length)
    {
        var $this = $(this);
        button.on('click', function(event) {
            $this.trigger('change');
        });
    }
    
    return this;
}