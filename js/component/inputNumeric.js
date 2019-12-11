/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumeric
// script with logic for an input containing a number
const InputNumeric = Component.InputNumeric = function(option)
{
    // option
    const $option = Object.assign({
        timeout: 500
    },option);
    
    
    // bindings
    Component.Timeout.call(this,'keyup',$option.timeout);
    Component.ValidatePrevent.call(this,'inputNumeric:change');
    

    // handler
    setHandler(this,'inputNumeric:getCurrent',function() {
        return Integer.cast($(this).data("current"));
    });
    
    setHandler(this,'inputSearch:setCurrent',function(value) {
        $(this).data("current",value);
    });
    
    setHandler(this,'inputNumeric:getMax',function() {
        return Integer.cast($(this).data('max'));
    });
    
    setHandler(this,'inputNumeric:validate',function() {
        let r = false;
        let val = trigHandler(this,'input:getValueInt');
        const max = trigHandler(this,'inputNumeric:getMax');
        const current = trigHandler(this,'inputNumeric:getCurrent');
        
        if(!val)
        trigEvt(this,'validate:invalid');
        
        else
        {
            if(val > max)
            {
                trigHandler(this,'input:setValue',max);
                val = max;
            }
            
            if(trigHandler(this,'validate:isValid') && val !== current)
            r = true;
        }
        
        return r;
    });
    
    setHandler(this,'inputNumeric:process',function() {
        const validate = trigHandler(this,'inputNumeric:validate');
        
        if(validate === true)
        trigEvt(this,'inputNumeric:change');
    });
    
    
    // event
    ael(this,'timeout:keyup',function() {
        trigHandler(this,'inputNumeric:process');
    });
    
    ael(this,'validate:invalid',function() {
        const current = trigHandler(this,'inputNumeric:getCurrent');
        trigHandler(this,'input:setValue',current);
        trigEvt(this,'validate:valid');
    });
    
    ael(this,'focus',function() {
        trigHandler(this,'input:setEmpty');
    });
    
    ael(this,'focusout',function() {
        trigHandler(this,'inputNumeric:process');
    });
    
    ael(this,'change',function() {
        trigHandler(this,'inputNumeric:process');
    });
    
    ael(this,'inputNumeric:change',function() {
        trigHandler(this,'timeout:clear','keyup');
    });
    
    
    return this;
}