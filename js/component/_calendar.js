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
    Component.block.call(this,'calendar:load');
    Component.Ajax.call(this,'calendar:load');
    
    // triggerHandler
    $(this).on('calendar:isEmpty',function(event) {
        return (!$(this).html())? true:false;
    })
    .on('calendar:getHead',  function() {
        return $(this).find(".head");
    })
    .on('calendar:getPrevNext',function() {
        return triggerFunc(this,'calendar:getHead').find(".prev,.next");
    })
    .on('calendar:getCells',  function() {
        return $(this).find(".body td");
    })
    .on('calendar:getSelected',  function() {
        return triggerFunc(this,'calendar:getCells').filter(".selected");
    })
    .on('calendar:getCurrent',function() {
        return $(this).data('current');
    })
    .on('calendar:getFormat',function() {
        return $(this).data('format');
    })
    .on('ajax:getHref',function() {
        return Dom.dataHrefReplaceChar(this,triggerFunc(this,'calendar:getCurrent'));
    })
    
    // trigger
    .on('ajax:before',function() {
        $(this).find("> *").hide();
        triggerCustom(this,'block');
        triggerCustom(this,'calendar:loading');
    })
    .on('ajax:success',function(event,data,textStatus,jqXHR) {
        $(this).html(data);
        triggerCustom(this,'calendar:loaded');
        triggerCustom(this,'calendar:bind');
        triggerCustom(this,'calendar:ready');
    })
    .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).html(parsedError);
        triggerCustom(this,'calendar:removeSelected');
        triggerCustom(this,'calendar:loaded');
    })
    .on('calendar:loaded',function(event) {
        triggerCustom(this,'unblock');
    })
    .on('calendar:bind',function() {
        bindNav.call(this);
    })
    .on('calendar:removeSelected',  function() {
        triggerFunc(this,'calendar:getSelected').removeClass('selected');
    })
    .on('calendar:select',function(event,value,reload) {
        triggerCustom(this,'calendar:removeSelected');
        const tds = triggerFunc(this,'calendar:getCells');
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
                triggerFunc(this,'ajax:trigger');
            }
        }
    })
    
    // isValueValid
    const isValueValid = function(value) {
        let r = false;
        
        if(Str.isNotEmpty(value) && !Num.is(value) && Validate.isNumericDash(value))
        {
            const format = triggerFunc(this,'calendar:getFormat');
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
            var i;
            
            for (i = 0; i < split.length; i++) 
            {
                if(split[i].length === 1)
                split[i] = "0"+split[i];
            }
            
            r = split.join('-');
        }
        
        return r;
    };
    
    // bindNav
    const bindNav = function() {
        const $this = $(this);
        const prevNext = triggerFunc(this,'calendar:getPrevNext');
        
        Component.block.call(prevNext,'click');
        Component.Ajax.call(prevNext,'click');

        prevNext.on('ajax:before',function() {
            $this.trigger('ajax:before');
            triggerCustom(this,'block');
        })
        .on('ajax:success',function(event,data,textStatus,jqXHR) {
            $this.trigger('ajax:success',[data,textStatus,jqXHR]);
            triggerCustom(this,'unblock');
        })
        .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
            $this.trigger('ajax:error',[parsedError,jqXHR,textStatus,errorThrown]);
        });
    };
    
    return this;

}