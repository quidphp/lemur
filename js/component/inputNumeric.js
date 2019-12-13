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
    const $option = Pojo.replace({
        timeout: 500,
        timeoutHandler: 'inputNumeric:process'
    },option);
    
    
    // bindings
    Component.Timeout.call(this,'keyup',$option.timeout);
    Component.ValidatePrevent.call(this,'inputNumeric:change');
    

    // handler
    setHdlr(this,'inputNumeric:getCurrent',function() {
        return Integer.cast(getAttr(this,"data-current"));
    });
    
    setHdlr(this,'inputNumeric:setCurrent',function(value) {
        setAttr(this,"data-current",value);
    });
    
    setHdlr(this,'inputNumeric:getMax',function() {
        return Integer.cast(getAttr(this,'data-max'));
    });
    
    setHdlr(this,'inputNumeric:validate',function() {
        let r = false;
        let val = trigHdlr(this,'input:getValueInt');
        const max = trigHdlr(this,'inputNumeric:getMax');
        const current = trigHdlr(this,'inputNumeric:getCurrent');
        
        if(!val)
        trigEvt(this,'validate:invalid');
        
        else
        {
            if(val > max)
            {
                trigHdlr(this,'input:setValue',max);
                val = max;
            }
            
            if(trigHdlr(this,'validate:isValid') && val !== current)
            r = true;
        }
        
        return r;
    });
    
    setHdlr(this,'inputNumeric:process',function() {
        const validate = trigHdlr(this,'inputNumeric:validate');
        
        if(validate === true)
        {
            trigHdlr(this,'input:valueRemember');
            trigEvt(this,'inputNumeric:change');
        }
    });
    
    
    // event
    ael(this,'timeout:keyup',function() {
        if($(this).is(":focus"))
        {
            trigHdlr(this,'input:valueRemember');
            trigHdlr(this,$option.timeoutHandler);
        }
    });
    
    ael(this,'validate:invalid',function() {
        const current = trigHdlr(this,'inputNumeric:getCurrent');
        trigHdlr(this,'input:setValue',current);
        trigEvt(this,'validate:valid');
    });
    
    ael(this,'focus',function() {
        trigHdlr(this,'input:setEmpty');
    });
    
    ael(this,'focusout',function() {
        trigHdlr(this,'inputNumeric:process');
    });
    
    ael(this,'change',function() {
        if(trigHdlr(this,'input:isRealChange'))
        trigHdlr(this,'inputNumeric:process');
    });
    
    ael(this,'inputNumeric:change',function() {
        trigHdlr(this,'timeout:clear','keyup');
    });
    
    
    return this;
}