/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumeric
// script with logic for an input containing a number
Component.InputNumeric = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        timeout: 500,
        keyEvent: 'keydown',
        timeoutHandler: 'inputNumeric:process'
    },option);
    
    
    // bindings
    Component.Timeout.call(this,$option.keyEvent,$option.timeout);
    Component.ValidatePrevent.call(this,'inputNumeric:change');
    Component.KeyboardArrow.call(this,'vertical');


    // handler
    setHdlrs(this,'inputNumeric:',{
        
        getValueRestore: function() {
            return trigHdlr(this,'input:getValueRemember','int') || trigHdlr(this,'input:getValueInt');
        },
        
        setValue: function(value,change) {
            trigHdlr(this,'input:setValue',value);
            
            if(change === true)
            trigEvt(this,'inputNumeric:change');
            
            else
            trigHdlr(this,'input:rememberValue');
        },
        
        getMin: function() {
            return getAttr(this,'data-min','int') || 1;
        },
        
        getMax: function() {
            return getAttr(this,'data-max','int');
        },
        
        getPrev: function() {
            let r = null;
            const val = trigHdlr(this,'input:getValueRemember','int');
            const min = trigHdlr(this,'inputNumeric:getMin');
            
            if(Integer.is(val))
            {
                const newVal = (val-1);
                if(newVal >= min)
                r = newVal;
            }
            
            return r;
        },
        
        getNext: function() {
            let r = null;
            const val = trigHdlr(this,'input:getValueRemember','int');
            const max = trigHdlr(this,'inputNumeric:getMax');
            
            if(Integer.is(val))
            {
                const newVal = (val+1);
                if(newVal <= max)
                r = newVal;
            }
            
            return r;
        },
        
        setPrev: function() {
            const value = trigHdlr(this,'inputNumeric:getPrev');
            if(value != null)
            trigHdlr(this,'inputNumeric:setValue',value,true);
        },
        
        setNext: function() {
            const value = trigHdlr(this,'inputNumeric:getNext');
            if(value != null)
            trigHdlr(this,'inputNumeric:setValue',value,true);
        },
        
        validateReplace: function(val) {
            let r = null;
            const min = trigHdlr(this,'inputNumeric:getMin');
            const max = trigHdlr(this,'inputNumeric:getMax');
            
            if(val > max)
            r = max;
            
            else if(val < min)
            r = min;
            
            return r;
        },
        
        validate: function() {
            let r = false;
            let val = trigHdlr(this,'input:getValueInt');

            if(Integer.is(val))
            {
                const newVal = trigHdlr(this,'inputNumeric:validateReplace',val);
                
                if(newVal != null)
                trigHdlr(this,'inputNumeric:setValue',newVal);
                
                if(trigHdlr(this,'validate:isValid'))
                r = true;
            }
            
            else
            trigEvt(this,'validate:invalid');
            
            return r;
        },
        
        shouldChange: function() {
            return true;
        },
        
        process: function() {
            const value = trigHdlr(this,'inputNumeric:getValueRestore');
            const validate = trigHdlr(this,'inputNumeric:validate');
            const shouldChange = trigHdlr(this,'inputNumeric:shouldChange');
            const newValue = trigHdlr(this,'input:getValueInt');
            
            if(validate === true && shouldChange === true && value !== newValue)
            trigEvt(this,'inputNumeric:change');
        }
    });
    
    setHdlr(this,'timeout:validateEvent',function(event) {
        return !Evt.isSpecialKeyCode(event);
    });
    
    
    // event
    ael(this,'timeout:'+$option.keyEvent,function() {
        if(Nod.match(this,":focus"))
        trigHdlr(this,$option.timeoutHandler);
    });
    
    ael(this,'validate:invalid',function() {
        const value = trigHdlr(this,'inputNumeric:getValueRestore');
        trigHdlr(this,'inputNumeric:setValue',value);
        trigEvt(this,'validate:valid');
    });
    
    ael(this,'focus',function() {
        trigHdlr(this,'input:rememberValue');
        trigHdlr(this,'input:setEmpty');
    });
    
    ael(this,'focusout',function() {
        if(trigHdlr(this,'input:isRealChange'))
        trigHdlr(this,'inputNumeric:process');
    });
    
    ael(this,'change',function() {
        if(trigHdlr(this,'input:isRealChange'))
        trigHdlr(this,'inputNumeric:process');
    });
    
    ael(this,'inputNumeric:change',function() {
        trigHdlr(this,'input:rememberValue');
        trigHdlr(this,'timeout:clear',$option.keyEvent);
    });
    
    ael(this,'keyboardArrow:up',function() {
        trigHdlr(this,'inputNumeric:setNext');
    });
    
    ael(this,'keyboardArrow:down',function() {
        trigHdlr(this,'inputNumeric:setPrev');
    });
    
    return this;
}