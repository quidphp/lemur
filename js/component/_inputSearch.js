/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearch
// script containing logic for a search input which redirects
Quid.Component.inputSearch = function(option)
{
    // settings
    var $option = Quid.Obj.replace({
        timeout: 100
    },option);
    
    // bindings
    Quid.Component.block.call(this,'change');
    Quid.Component.keyboardEnter.call(this,true,'keyup');
    Quid.Component.timeout.call(this,'keyup',$option.timeout);
    Quid.Component.inputValidate.call(this);
    
    // triggerHandler
    $(this).on('inputSearch:getValue', function(event) {
        return Quid.Str.cast($(this).val());
    })
    .on('inputSearch:getCurrent',  function() {
        return Quid.Str.cast($(this).data("current"));
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
        
        if(Quid.Str.isNotEmpty(val))
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