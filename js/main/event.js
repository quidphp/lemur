"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// event
// script containing event management functions
quid.main.event = new function() {
    
    // triggerHandlerEqual
    // appel un événement triggerHandler
    // retourne vrai si tous les éléments retourne la valeur donné en argument
    this.triggerHandlerEqual = $.fn.triggerHandlerEqual = function(equal,type)
    {
        var r = false;
        
        if(quid.base.str.isNotEmpty(type))
        {
            $(this).each(function(index) {
                var result = $(this).triggerHandler(type);
                r = (result === equal);
                
                if(r === false)
                return false;
            });
        }
        
        return r;
    }

    
    // block
    // bloque l'événement sur le ou les éléments s'il y a la data blocked
    this.block = $.fn.block = function(type) 
    {
        if(quid.base.str.isNotEmpty(type))
        {
            $(this).on(type, function(event) 
            {
                if($(this).data("blocked") != null)
                {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    $(this).trigger('blocked');
                    return false;
                }
            })
            .on('block', function(event) {
                event.stopImmediatePropagation();
                $(this).data("blocked",true);
            })
            .on('unblock', function(event) {
                event.stopImmediatePropagation();
                $(this).removeData("blocked");
            });
        }
        
        return this;
    }


    // timeout
    // permet d'appliquer un timeout sur un événement
    this.timeout = $.fn.timeout = function(type,timeout)
    {
        if(quid.base.str.isNotEmpty(type))
        {
            $(this).each(function(index) 
            {
                var delay = timeout || $(this).data(type+"Delay");
                
                if(quid.base.number.is(delay))
                {
                    $(this).on(type+':setTimeout',function() {
                        var $this = $(this);
                        var $type = type;
                        $(this).trigger(type+':clearTimeout');
                        $(this).data(type+"Timeout",setTimeout(function() {
                            $this.trigger($type+':onTimeout');
                        },delay));
                    })
                    .on(type+':clearTimeout',function() {
                        var oldTimeout = $(this).data(type+"Timeout");
                        
                        if(oldTimeout != null)
                        clearTimeout(oldTimeout);
                    })
                    .on(type, function() {
                        $(this).trigger(type+':setTimeout');
                    });
                }
            });
        }
        
        return this;
    }
}