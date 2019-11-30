/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumeric
// script with logic for an input containing a number
quid.component.inputNumeric = function(option)
{
    // alias
    var setFunc = quid.event.setFunc;
    var triggerFunc = quid.event.triggerFunc;
    var ael = quid.event.addEventListener;
    var triggerCustom = quid.event.triggerCustom;
    
    
    // option
    option = Object.assign({timeout: 500},option);
    
    
    // bindings
    quid.component.block.call(this,'change');
    quid.component.timeout.call(this,'keyup',option.timeout);
    quid.component.inputValidate.call(this);


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
        triggerCustom(this,'validate:process');
        refresh.call(this);
    });
    
    ael(this,'validate:invalid',function() {
        var current = triggerFunc(this,'inputNumeric:getCurrent');
        triggerFunc(this,'input:setValue',current);
        triggerCustom(this,'validate:valid');
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
        triggerCustom(this,'inputNumeric:refresh');
    });
    
    
    // refresh
    var refresh = function() {
        var val = triggerFunc(this,'inputNumeric:getValue');
        var max = triggerFunc(this,'inputNumeric:getMax');
        var current = triggerFunc(this,'inputNumeric:getCurrent');
        
        if(!val)
        triggerCustom(this,'validate:invalid');
        
        else
        {
            if(val > max)
            {
                triggerFunc(this,'input:setValue',max);
                val = max;
            }
            
            if($(this).triggerHandler('validate:isValid') && val !== current)
            redirect.call(this);
        }
    };
    
    
    // redirect
    var redirect = function() {
        var val = triggerFunc(this,'inputNumeric:getValue');
        var href = quid.node.dataHrefReplaceChar(this,val);
        
        if(quid.str.isNotEmpty(href))
        {
            triggerCustom(this,'block');
            triggerCustom(document,'document:go',href)
        }
    };
    
    return this;
}