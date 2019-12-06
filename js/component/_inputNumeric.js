/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumeric
// script with logic for an input containing a number
Component.inputNumeric = function(option)
{
    // option
    option = Object.assign({timeout: 500},option);
    
    
    // bindings
    Component.BlockEvent.call(this,'change');
    Component.Timeout.call(this,'keyup',option.timeout);
    Component.inputValidate.call(this);


    // func
    setFunc(this,'inputNumeric:getValue',function() {
        return parseInt(triggerFunc(this,'input:getValue'));
    });
    
    setFunc(this,'inputNumeric:getValue',function() {
        return triggerFunc(this,'input:getValueInt');
    });
    
    setFunc(this,'inputNumeric:getCurrent',function() {
        return parseInt($(this).data("current"));
    });
    
    setFunc(this,'inputNumeric:getMax',function() {
        return parseInt($(this).data('max'));
    });
    
    
    // custom
    ael(this,'keyup:onTimeout',function() {
        triggerEvent(this,'validate:process');
        refresh.call(this);
    });
    
    ael(this,'validate:invalid',function() {
        const current = triggerFunc(this,'inputNumeric:getCurrent');
        triggerFunc(this,'input:setValue',current);
        triggerEvent(this,'validate:valid');
    });
    
    // event
    ael(this,'focus',function() {
        triggerFunc(this,'input:setEmpty');
    });
    
    ael(this,'focusout',function(event) {
        refresh.call(this);
        event.stopImmediatePropagation();
    });
    
    ael(this,'change',function() {
        triggerEvent(this,'inputNumeric:refresh');
    });
    
    
    // refresh
    const refresh = function() {
        const val = triggerFunc(this,'inputNumeric:getValue');
        const max = triggerFunc(this,'inputNumeric:getMax');
        const current = triggerFunc(this,'inputNumeric:getCurrent');
        
        if(!val)
        triggerEvent(this,'validate:invalid');
        
        else
        {
            if(val > max)
            {
                triggerFunc(this,'input:setValue',max);
                val = max;
            }
            
            if(triggerFunc(this,'validate:isValid') && val !== current)
            redirect.call(this);
        }
    };
    
    
    // redirect
    const redirect = function() {
        const val = triggerFunc(this,'inputNumeric:getValue');
        const href = Dom.dataHrefReplaceChar(this,val);
        
        if(Str.isNotEmpty(href))
        {
            triggerEvent(this,'block');
            triggerEvent(document,'doc:go',href)
        }
    };
    
    return this;
}