"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// script with functions related to keyboard keys catching, blocking and handling

// enterCatch
// attrape la touche enter sur un événement, keypress par défaut
quid.core.enterCatch = $.fn.enterCatch = function(type)
{
    type = type || 'keydown';
    
    $(this).on(type, function(event) {
        if(event.keyCode === 10 || event.keyCode === 13)
        {
            $(this).trigger('enter:catched',[event]);
            
            if($(this).triggerHandler('enter:prevent',[event]) === true)
            {
                event.stopImmediatePropagation();
                event.preventDefault();
                $(this).trigger('enter:blocked',[event]);
                return false;
            }
        }
    })
    .on('enter:prevent', function(event,keyEvent) {
        return true;
    });
    
    return this;
}


// arrowCatch
// attrape les touches de flèche sur le clavier
quid.core.arrowCatch = $.fn.arrowCatch = function(type) 
{
    type = type || 'keydown';
    
    $(this).on(type, function(event) {
        if($.inArray(event.keyCode,[37,38,39,40]) !== -1)
        {
            $(this).trigger('arrow:catched',[event]);
            
            if(event.keyCode === 38)
            $(this).trigger('arrowUp:catched',[event]);
            
            else if(event.keyCode === 40)
            $(this).trigger('arrowDown:catched',[event]);
            
            else if(event.keyCode === 37)
            $(this).trigger('arrowLeft:catched',[event]);
            
            else if(event.keyCode === 39)
            $(this).trigger('arrowRight:catched',[event]);
            
            if($(this).triggerHandler('arrow:prevent',[event]) === true)
            {
                event.stopImmediatePropagation();
                event.preventDefault();
                $(this).trigger('arrow:blocked',[event]);
                return false;
            }
        }
    })
    .on('arrow:prevent', function(event,keyEvent) {
        return true;
    });
    
    return this;
}


// escapeCatch
// attrape la touche escape sur keyup, associé au document
quid.core.escapeCatch = $.fn.escapeCatch = function(type)
{
    type = type || 'keydown';
    
    $(this).on(type, function(event) {
        if(event.keyCode === 27)
        {
            $(this).trigger('escape:catched',[event]);
            
            if($(this).triggerHandler('escape:prevent',[event]) === true)
            {
                event.stopImmediatePropagation();
                event.preventDefault();
                $(this).trigger('escape:blocked',[event]);
                return false;
            }
        }
    })
    .on('escape:prevent', function(event,keyEvent) {
        return true;
    });
    
    return this;
}