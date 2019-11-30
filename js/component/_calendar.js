/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// calendar
// script for the calendar component
Quid.Component.calendar = function()
{
    // block + ajax
    Quid.Component.block.call(this,'calendar:load');
    Quid.Component.ajax.call(this,'calendar:load');
    
    // triggerHandler
    $(this).on('calendar:isEmpty', function(event) {
        return (!$(this).html())? true:false;
    })
    .on('calendar:getHead',  function() {
        return $(this).find(".head");
    })
    .on('calendar:getPrevNext', function() {
        return $(this).triggerHandler('calendar:getHead').find(".prev,.next");
    })
    .on('calendar:getCells',  function() {
        return $(this).find(".body td");
    })
    .on('calendar:getSelected',  function() {
        return $(this).triggerHandler('calendar:getCells').filter(".selected");
    })
    .on('calendar:getCurrent', function() {
        return $(this).data('current');
    })
    .on('calendar:getFormat', function() {
        return $(this).data('format');
    })
    .on('ajax:getHref', function() {
        return Quid.Node.dataHrefReplaceChar(this,$(this).triggerHandler('calendar:getCurrent'));
    })
    
    // trigger
    .on('ajax:before', function() {
        $(this).find("> *").hide();
        $(this).trigger('block');
        $(this).trigger('calendar:loading');
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        $(this).html(data);
        $(this).trigger('calendar:loaded');
        $(this).trigger('calendar:bind');
        $(this).trigger('calendar:ready');
    })
    .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).html(parsedError);
        $(this).trigger('calendar:removeSelected');
        $(this).trigger('calendar:loaded');
    })
    .on('calendar:loaded', function(event) {
        $(this).trigger('unblock');
    })
    .on('calendar:bind', function() {
        bindNav.call(this);
    })
    .on('calendar:removeSelected',  function() {
        $(this).triggerHandler('calendar:getSelected').removeClass('selected');
    })
    .on('calendar:select', function(event,value,reload) {
        $(this).trigger('calendar:removeSelected');
        var tds = $(this).triggerHandler('calendar:getCells');
        var td = null;
        value = prepareValue.call(this,value);
        
        if(isValueValid.call(this,value))
        {
            if(Quid.Number.is(value))
            td = tds.filter("[data-timestamp='"+value+"']").not(".out");
            
            else if(Quid.Str.isNotEmpty(value))
            td = tds.filter("[data-format^='"+value+"']").not(".out");
            
            if(td != null && td.length)
            td.addClass('selected');
            
            else if(reload === true)
            {
                $(this).data('current',value);
                $(this).triggerHandler('ajax:trigger');
            }
        }
    })
    
    // isValueValid
    var isValueValid = function(value) {
        var r = false;
        
        if(Quid.Str.isNotEmpty(value) && !Quid.Number.is(value) && Quid.Validate.isNumericDash(value))
        {
            var format = $(this).triggerHandler('calendar:getFormat');
            if(value.length == format.length)
            r = true;
        }
        
        return r;
    };
    
    // prepareValue
    var prepareValue = function(value) {
        var r = null;
        
        if(Quid.Str.isNotEmpty(value))
        {
            value = Quid.Str.trim(value);
            value = Quid.Str.explodeIndex(0," ",value);
            var split = value.split('-');
            for (var i = 0; i < split.length; i++) 
            {
                if(split[i].length === 1)
                split[i] = "0"+split[i];
            }
            r = split.join('-');
        }
        
        return r;
    };
    
    // bindNav
    var bindNav = function() {
        var $this = $(this);
        var prevNext = $(this).triggerHandler('calendar:getPrevNext');
        
        Quid.Component.block.call(prevNext,'click');
        Quid.Component.ajax.call(prevNext,'click');

        prevNext.on('ajax:before', function() {
            $this.trigger('ajax:before');
            $(this).trigger('block');
        })
        .on('ajax:success', function(event,data,textStatus,jqXHR) {
            $this.trigger('ajax:success',[data,textStatus,jqXHR]);
            $(this).trigger('unblock');
        })
        .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
            $this.trigger('ajax:error',[parsedError,jqXHR,textStatus,errorThrown]);
        });
    };
    
    return this;

}