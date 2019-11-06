"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// event
// script containing event management functions and custom events for jQuery

// triggerHandlerTrue
// appel un événement via triggerHandler
// retourne true si un des éléments retourne true
quid.core.triggerHandlerTrue = $.fn.triggerHandlerTrue = function(type)
{
    var r = false;
    
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).each(function(index) 
        {
            if($(this).triggerHandler(type))
            {
                r = true;
                return false;
            }
        });
    }
    
    return r;
}


// triggerHandlerFalse
// appel un événement
// retourne faux si un des éléments retourne faux
quid.core.triggerHandlerFalse = $.fn.triggerHandlerFalse = function(type)
{
    var r = false;
    
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).each(function(index) {
            return r = $(this).triggerHandler(type);
        });
    }
    
    return r;
}


// block
// bloque l'événement sur le ou les éléments s'il y a la data blocked
quid.core.block = $.fn.block = function(type) 
{
    if(quid.base.isStringNotEmpty(type))
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
quid.core.timeout = $.fn.timeout = function(type,timeout)
{
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).each(function(index) 
        {
            var delay = timeout || $(this).data(type+"Delay");
            
            if($.isNumeric(delay))
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


// scrollStart
// gère l'événement scrollStart dans jQuery
$.event.special.scrollstart = {
    uid: quid.base.uniqueInt(),
    latency: 250,
    setup: function(data) {
        var current = $.event.special.scrollstart;
        var timer;
        var data = $.extend({latency: current.latency}, data);

        var handler = function(event) {
            var $this = this;
            var args = arguments;
            var dispatch = $.event.dispatch || $.event.handle;
            
            if(timer)
            clearTimeout(timer);
            
            else 
            {
                event.type = 'scrollstart';
                dispatch.apply($this,args);
            }

            timer = setTimeout(function() {
                timer = null;
            },data.latency);
        };

        $(this).bind('scroll',handler).data(current.uid,handler);
    },
    teardown: function() {
        var current = $.event.special.scrollstart;
        $(this).unbind('scroll',$(this).data(current.uid));
    }
};


// scrollStop
// gère l'événement scrollStop dans jQuery
$.event.special.scrollstop = {
    uid: quid.base.uniqueInt(),
    latency: 250,
    setup: function(data) {
        var current = $.event.special.scrollstop;
        var timer;
        var data = $.extend({latency: current.latency}, data);
        
        var handler = function(event) 
        {
            var $this = this;
            var args = arguments;
            var dispatch = $.event.dispatch || $.event.handle;
            
            if(timer)
            clearTimeout(timer);

            timer = setTimeout(function() {
                timer = null;
                event.type = 'scrollstop';
                dispatch.apply($this, args);
            },data.latency);
        };

        $(this).bind('scroll',handler).data(current.uid,handler);
    },
    teardown: function() {
        var current = $.event.special.scrollstop;
        $(this).unbind('scroll',$(this).data(current.uid));
    }
};