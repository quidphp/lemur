"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearch
// script containing logic for a search input which redirects
quid.component.inputSearch = function(option)
{
    // settings
    var $settings = quid.base.obj.replace({
        timeout: 100
    },option);
    
    // bindings
    quid.main.event.block.call(this,'change');
    quid.main.keyboard.enter.call(this,true,'keyup');
    quid.main.event.timeout.call(this,'keyup',$settings.timeout);
    quid.main.validate.field.call(this);
    
    // triggerHandler
    $(this).on('inputSearch:getValue', function(event) {
        return quid.base.str.cast($(this).val());
    })
    .on('inputSearch:getCurrent',  function() {
        return quid.base.str.cast($(this).data("current"));
    })
    .on('inputSearch:getButton', function(event) {
        return $(this).parent().next("button[type='button']");
    })
    
    // event
    .on('change enter:blocked inputSeach:buttonClick', function() {
        $(this).trigger('validate:process');
        refresh.call(this);
    })
    .on('keyup:onTimeout', function() {
        $(this).trigger('validate:pattern');
    })
    
    // setup
    .on('component:setup', function(event) {
        bindButton.call(this);
    });
    
    // refresh
    var refresh = function() {
        var val = $(this).triggerHandler('inputSearch:getValue');
        var current = $(this).triggerHandler('inputSearch:getCurrent');
        
        if(val === current)
        $(this).trigger('validate:invalid');
        
        else if($(this).triggerHandler('validate:isValid'))
        redirect.call(this);
    };
    
    // redirect
    var redirect = function() {
        var val = $(this).triggerHandler('inputSearch:getValue');
        var href = $(this).attr("data-href");
        var char = $(this).attr("data-char");
        
        if(quid.base.str.isNotEmpty(val))
        {
            val = encodeURIComponent(val);
            href += "?"+char+"="+val;
        }
        
        $(this).trigger('block');
        $(document).trigger('document:go',[href])
    };
    
    // bindButton
    var bindButton = function() {
        var $this = $(this);
        var button = $(this).triggerHandler('inputSearch:getButton');
        
        if(button != null)
        {
            button.on('click', function(event) {
                $this.trigger('inputSeach:buttonClick');
            });
        }
    };
    
    return this;
}