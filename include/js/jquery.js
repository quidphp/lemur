"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// jquery
// script containing special expressions and events for jQuery
quid.main.jquery = new function() {
    
    // internal
    // expression qui retourne vrai si l'uri est interne
    $.expr[':'].internal = function(obj,index,meta,stack)
    {
        var r = false;
        
        if($(obj).is("[href]"))
        r = quid.base.uri.isInternal($(obj).attr("href"));
        
        return r;
    };


    // external
    // expression qui retourne vrai si l'uri est externe
    // ne tient pas compte de target _blank
    $.expr[':'].external = function(obj,index,meta,stack)
    {
        var r = false;
        
        if($(obj).is("[href]"))
        r = quid.base.uri.isExternal($(obj).attr("href"));
        
        return r;
    };

    
    // inputReal
    // retourne les inputs réel avec un nom valide
    // exclus les button type button
    $.expr[':'].inputReal = function(obj,index,meta,stack)
    {
        var r = false;
        obj = $(obj);
        
        if(obj.is("input,select,textarea,button[type='submit']"))
        r = true;
        
        return r;
    };
    
    
    // scrollStart
    // gère l'événement scrollStart dans jQuery
    $.event.special.scrollstart = {
        uid: quid.uniqueInt(),
        latency: 250,
        setup: function(data) {
            var current = $.event.special.scrollstart;
            var timer;
            var data = quid.base.obj.replace({latency: current.latency}, data);

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
        uid: quid.uniqueInt(),
        latency: 250,
        setup: function(data) {
            var current = $.event.special.scrollstop;
            var timer;
            var data = quid.base.obj.replace({latency: current.latency}, data);
            
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
}