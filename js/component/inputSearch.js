/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearchHref
// script containing logic for a search input with a button
const InputSearch = Component.InputSearch = function(option)
{
    // option
    const $option = Object.assign({
        timeout: 500,
        keyEvent: 'keyup',
        timeoutEvent: 'inputSearch:process'
    },option);
    
    
    // components
    Component.KeyboardEnter.call(this,true,$option.keyEvent);
    Component.Timeout.call(this,$option.keyEvent,$option.timeout);
    Component.ValidatePrevent.call(this,'inputSearch:change');
    
    
    // handler
    setHandler(this,'inputSearch:getCurrent',function() {
        return $(this).data("current");
    });
    
    setHandler(this,'inputSearch:setCurrent',function(value) {
        $(this).data("current",value);
    });
    
    setHandler(this,'inputSearch:getButton',function() {
        return $(this).next("button[type='button']").get(0);
    });
    
    setHandler(this,'inputSearch:validate',function() {
        let r = trigHandler(this,'validate:process');
        const val = trigHandler(this,'input:getValueTrim');
        const current = trigHandler(this,'inputSearch:getCurrent');
        
        if(r === true && Str.isEqual(val,current))
        {
            r = false;
            trigEvt(this,'validate:invalid');
        }
        
        return r;
    });
    
    setHandler(this,'inputSearch:process',function() {
        const validate = trigHandler(this,'inputSearch:validate');
        
        if(validate === true)
        trigEvt(this,'inputSearch:change');
    });
    
    setHandler(this,'inputSearch:buttonClick',function() {
        trigHandler(this,'inputSearch:process');
    });
    
    
    // event
    ael(this,'keyboardEnter:blocked',function() {
        trigHandler(this,'inputSearch:process');
    });
        
    ael(this,'timeout:'+$option.keyEvent,function() {
        trigHandler(this,$option.timeoutEvent);
    });
    
    ael(this,'change',function() {
        trigHandler(this,'inputSearch:process');
    });
    
    ael(this,'inputSearch:change',function() {
        trigHandler(this,'timeout:clear',$option.keyEvent);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindButton.call(this);
    });
    
    
    // bindButton
    const bindButton = function() 
    {
        const $this = this;
        const button = trigHandler(this,'inputSearch:getButton');
        
        ael(button,'click',function() {
            trigHandler($this,'inputSearch:buttonClick');
        });
    }
    
    return this;
}