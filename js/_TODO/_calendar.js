/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// calendar
// script for the calendar component
Component.calendar = function()
{
    // block + ajax
    Component.BlockEvent.call(this,'calendar:load');
    Component.Ajax.call(this,'calendar:load');
    
    // triggerHandler
    $(this).on('calendar:isEmpty',function(event) {
        return (!$(this).html())? true:false;
    })
    .on('calendar:getHead',  function() {
        return $(this).find(".head");
    })
    .on('calendar:getPrevNext',function() {
        return trigHandler(this,'calendar:getHead').find(".prev,.next");
    })
    .on('calendar:getCells',  function() {
        return $(this).find(".body td");
    })
    .on('calendar:getSelected',  function() {
        return trigHandler(this,'calendar:getCells').filter(".selected");
    })
    .on('calendar:getCurrent',function() {
        return $(this).data('current');
    })
    .on('calendar:getFormat',function() {
        return $(this).data('format');
    })
    .on('ajax:getHref',function() {
        return Dom.dataHrefReplaceChar(this,trigHandler(this,'calendar:getCurrent'));
    })
    
    // trigger
    .on('ajax:before',function() {
        $(this).find("> *").hide();
        trigEvt(this,'block');
        trigEvt(this,'calendar:loading');
    })
    .on('ajax:success',function(event,data,textStatus,jqXHR) {
        $(this).html(data);
        trigEvt(this,'calendar:loaded');
        trigEvt(this,'calendar:bind');
        trigEvt(this,'calendar:ready');
    })
    .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).html(parsedError);
        trigEvt(this,'calendar:removeSelected');
        trigEvt(this,'calendar:loaded');
    })
    .on('calendar:loaded',function(event) {
        trigEvt(this,'unblock');
    })
    .on('calendar:bind',function() {
        bindNav.call(this);
    })
    .on('calendar:removeSelected',  function() {
        trigHandler(this,'calendar:getSelected').removeClass('selected');
    })
    .on('calendar:select',function(event,value,reload) {
        trigEvt(this,'calendar:removeSelected');
        const tds = trigHandler(this,'calendar:getCells');
        const td = null;
        value = prepareValue.call(this,value);
        
        if(isValueValid.call(this,value))
        {
            if(Num.is(value))
            td = tds.filter("[data-timestamp='"+value+"']").not(".out");
            
            else if(Str.isNotEmpty(value))
            td = tds.filter("[data-format^='"+value+"']").not(".out");
            
            if(td != null && td.length)
            td.addClass('selected');
            
            else if(reload === true)
            {
                $(this).data('current',value);
                trigHandler(this,'ajax:trigger');
            }
        }
    })
    
    // isValueValid
    const isValueValid = function(value) {
        let r = false;
        
        if(Str.isNotEmpty(value) && !Num.is(value) && Validate.isNumericDash(value))
        {
            const format = trigHandler(this,'calendar:getFormat');
            if(value.length == format.length)
            r = true;
        }
        
        return r;
    };
    
    // prepareValue
    const prepareValue = function(value) {
        let r = null;
        
        if(Str.isNotEmpty(value))
        {
            value = Str.trim(value);
            value = Str.explodeIndex(0," ",value);
            const split = value.split('-');
            
            Arr.each(split,function(value,key) {
                if(value.length === 1)
                split[key] = "0"+value;
            });
            
            r = split.join('-');
        }
        
        return r;
    };
    
    // bindNav
    const bindNav = function() {
        const $this = $(this);
        const prevNext = trigHandler(this,'calendar:getPrevNext');
        
        Component.BlockEvent.call(prevNext,'click');
        Component.Ajax.call(prevNext,'click');

        prevNext.on('ajax:before',function() {
            trigEvt($this,'ajax:before');
            trigEvt(this,'block');
        })
        .on('ajax:success',function(event,data,textStatus,jqXHR) {
            trigEvt($this,'ajax:success',[data,textStatus,jqXHR]);
            trigEvt(this,'unblock');
        })
        .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
            trigEvt($this,'ajax:error',[parsedError,jqXHR,textStatus,errorThrown]);
        });
    };
    
    return this;

}