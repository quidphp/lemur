/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearch
// script containing logic for a search input which redirects
Component.inputSearch = function(option)
{
    // settings
    const $option = Obj.replace({
        timeout: 100
    },option);
    
    // bindings
    Component.block.call(this,'change');
    Component.keyboardEnter.call(this,true,'keyup');
    Component.timeout.call(this,'keyup',$option.timeout);
    Component.inputValidate.call(this);
    
    // triggerHandler
    $(this).on('inputSearch:getValue', function(event) {
        return Str.cast($(this).val());
    })
    .on('inputSearch:getCurrent',  function() {
        return Str.cast($(this).data("current"));
    })
    .on('inputSearch:getButton', function(event) {
        return $(this).parent().next("button[type='button']");
    })
    
    // event
    .on('change enter:blocked inputSeach:buttonClick', function() {
        triggerCustom(this,'validate:process');
        refresh.call(this);
    })
    .on('keyup:onTimeout', function() {
        triggerCustom(this,'validate:pattern');
    })
    
    // setup
    .on('component:setup', function(event) {
        bindButton.call(this);
    });
    
    // refresh
    let refresh = function() {
        const val = triggerFunc(this,'inputSearch:getValue');
        const current = triggerFunc(this,'inputSearch:getCurrent');
        
        if(val === current)
        triggerCustom(this,'validate:invalid');
        
        else if(triggerFunc(this,'validate:isValid'))
        redirect.call(this);
    };
    
    // redirect
    let redirect = function() {
        const val = triggerFunc(this,'inputSearch:getValue');
        const href = $(this).attr("data-href");
        const char = $(this).attr("data-char");
        
        if(Str.isNotEmpty(val))
        {
            val = encodeURIComponent(val);
            href += "?"+char+"="+val;
        }
        
        triggerCustom(this,'block');
        $(document).trigger('document:go',[href])
    };
    
    // bindButton
    const bindButton = function() {
        const $this = $(this);
        const button = triggerFunc(this,'inputSearch:getButton');
        
        if(button != null)
        {
            button.on('click', function(event) {
                $this.trigger('inputSeach:buttonClick');
            });
        }
    };
    
    return this;
}