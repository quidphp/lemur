/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumeric
// script with logic for an input containing a number
const InputNumeric = function(option)
{
    // nodes
    const $nodes = this;
    
    
    // option
    const $option = Object.assign({
        timeout: 500
    },option);
    
    
    // bindings
    Component.Timeout.call(this,'keyup',$option.timeout);


    // func
    setFunc(this,'inputNumeric:getCurrent',function() {
        return Integer.cast($(this).data("current"));
    });
    
    setFunc(this,'inputNumeric:getMax',function() {
        return Integer.cast($(this).data('max'));
    });
    
    
    // event
    ael(this,'timeout:keyup',function() {
        inputRefresh.call(this);
    });
    
    ael(this,'validate:invalid',function() {
        const current = triggerFunc(this,'inputNumeric:getCurrent');
        triggerFunc(this,'input:setValue',current);
        triggerEvent(this,'validate:valid');
    });
    
    ael(this,'focus',function() {
        triggerFunc(this,'input:setEmpty');
    });
    
    ael(this,'focusout',function() {
        inputRefresh.call(this);
    });
    
    ael(this,'change',function() {
        inputRefresh.call(this);
    });
    
    
    // refresh
    const inputRefresh = function() {
        let val = triggerFunc(this,'input:getValueInt');
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
    }
    
    
    // redirect
    const redirect = function() 
    {
        const val = triggerFunc(this,'input:getValueInt');
        const href = Dom.dataHrefReplaceChar(this,val);
        
        if(Str.isNotEmpty(href))
        triggerFunc(document,'doc:go',href);
    }
    
    return this;
}

// export
Component.InputNumeric = InputNumeric;