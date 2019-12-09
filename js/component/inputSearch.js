/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearch
// script containing logic for a search input which redirects
const InputSearch = Component.InputSearch = function(option)
{
    // option
    const $option = Object.assign({
        timeout: 500
    },option);
    
    
    // components
    Component.KeyboardEnter.call(this,true,'keyup');
    Component.Timeout.call(this,'keyup',$option.timeout);
    
    
    // func
    setFunc(this,'inputSearch:getCurrent',function() {
        return Str.cast($(this).data("current"));
    });
    
    setFunc(this,'inputSearch:getButton',function() {
        return $(this).parent().next("button[type='button']").get(0);
    });
    
    setFunc(this,'inputSearch:validate',function() {
        let r = triggerFunc(this,'validate:process');
        const val = triggerFunc(this,'input:getValue',true);
        const current = triggerFunc(this,'inputSearch:getCurrent');
        
        if(r === true && val === current)
        {
            r = false;
            triggerEvent(this,'validate:invalid');
        }
        
        return r;
    });
    
    
    // event
    ael(this,'keyboardEnter:blocked',function() {
        refresh.call(this);
    });
        
    ael(this,'timeout:keyup',function() {
        triggerFunc(this,'inputSearch:validate');
    });
    
    ael(this,'inputSeach:buttonClick',function() {
        refresh.call(this);
    });
    
    ael(this,'change',function() {
        refresh.call(this);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindButton.call(this);
    });
    
    
    // bindButton
    const bindButton = function() 
    {
        const $this = this;
        const button = triggerFunc(this,'inputSearch:getButton');
        
        ael(button,'click',function() {
            triggerEvent($this,'inputSeach:buttonClick');
        });
    }
    
    
    // refresh
    const refresh = function() 
    {
        const validate = triggerFunc(this,'inputSearch:validate');
        
        if(validate === true)
        redirect.call(this);
    }
    
    
    // redirect
    const redirect = function() 
    {
        const char = $(this).attr("data-char");
        let val = triggerFunc(this,'input:getValueEncoded',true);
        let href = $(this).attr("data-href");
        
        if(Str.isNotEmpty(val))
        href += "?"+char+"="+val;
        
        triggerFunc(document,'doc:go',href);
    }
    
    return this;
}