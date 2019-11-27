"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumeric
// script with logic for an input containing a number
quid.component.inputNumeric = function(option)
{
    // settings
    var $settings = quid.base.obj.replace({
        timeout: 500
    },option);
    
    // bindings
    quid.main.event.block.call(this,'change');
    quid.main.event.timeout.call(this,'keyup',$settings.timeout);
    quid.main.validate.field.call(this);
    
    // triggerHandler
    $(this).on('inputNumeric:getValue', function() {
        return parseInt($(this).val());
    })
    .on('inputNumeric:getCurrent',  function() {
        return parseInt($(this).data("current"));
    })
    .on('inputNumeric:getMax', function() {
        return parseInt($(this).data('max'));
    })
    
    // trigger
    .on('keyup:onTimeout', function() {
        $(this).trigger('validate:process');
        refresh.call(this);
    })
    .on('validate:invalid', function() {
        var current = $(this).triggerHandler('inputNumeric:getCurrent');
        $(this).val(current);
        $(this).trigger('validate:valid');
    })
    
    // event
    .on('focus', function() {
        $(this).val('');
    })
    .on('focusout', function(event) {
        event.stopImmediatePropagation();
        refresh.call(this);
    })
    .on('change', function() {
        $(this).trigger('inputNumeric:refresh');
    })
    
    // refresh
    var refresh = function() {
        var val = $(this).triggerHandler('inputNumeric:getValue');
        var max = $(this).triggerHandler('inputNumeric:getMax');
        var current = $(this).triggerHandler('inputNumeric:getCurrent');
        
        if(!val)
        $(this).trigger('validate:invalid');
        
        else
        {
            if(val > max)
            {
                $(this).val(max);
                val = max;
            }
            
            if($(this).triggerHandler('validate:isValid') && val !== current)
            redirect.call(this);
        }
    };
    
    // redirect
    var redirect = function() {
        var val = $(this).triggerHandler('inputNumeric:getValue');
        var href = $(this).dataHrefReplaceChar(val);
        
        if(quid.base.str.isNotEmpty(href))
        {
            $(this).trigger('block');
            $(document).trigger('document:go',[href])
        }
    };
    
    return this;
}