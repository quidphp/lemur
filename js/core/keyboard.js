"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// script with functions related to keyboard keys catching, blocking and handling

// enterBlock
// bloque la touche enter sur un événement, keypress par défaut
// associé à l'élément
quid.core.enterBlock = $.fn.enterBlock = function(type)
{
    type = type || 'keyup keypress';
    
    $(this).on(type, function(event) {
        $(this).trigger('enter:block',[event]);
    })
    .on('enter:block', function(event,keyEvent) {
        if(keyEvent.keyCode === 10 || keyEvent.keyCode === 13)
        {
            keyEvent.stopImmediatePropagation();
            keyEvent.preventDefault();
            $(this).trigger('enter:blocked');
        }
    });
    
    return this;
}


// arrowCatch
// attrape les touches de flèche sur le clavier
quid.core.arrowCatch = $.fn.arrowCatch = function(preventDefault) 
{
    $(this).each(function()
    {
        var $this = $(this);
        
        $(document).keydown(function(event) {
            if($.inArray(event.keyCode,[37,38,39,40]) !== -1)
            {
                if(event.keyCode === 38)
                $this.trigger('arrowUp:catched',[event]);
                
                else if(event.keyCode === 40)
                $this.trigger('arrowDown:catched',[event]);
                
                else if(event.keyCode === 37)
                $this.trigger('arrowLeft:catched',[event]);
                
                else if(event.keyCode === 39)
                $this.trigger('arrowRight:catched',[event]);
                
                if(preventDefault === true)
                {
                    event.preventDefault();
                    return false;
                }
            }
        });
        
        $(this).find("input,textarea").keydown(function(event) {
            if($.inArray(event.keyCode,[37,38,39,40]) !== -1)
            event.stopImmediatePropagation();
        });
    });
    
    return this;
}


// escapeCatch
// attrape la touche escape sur keyup, associé au document
quid.core.escapeCatch = $.fn.escapeCatch = function()
{
    $(this).each(function()
    {
        var $this = $(this);
        
        $(document).keyup(function(event) {
            if(event.keyCode === 27)
            $this.trigger('escape:catched',[event]);
        });
    });
    
    return this;
}