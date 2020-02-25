/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumericRange
// script with for an numeric input, linked to a range (with plus and minus buttons)
Component.InputNumericRange = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        zero: false
    },option);
    
    
    // handler
    setHdlrs(this,'inputNumericRange:',{
        
        isValid: function(value) {
            const range = trigHdlr(this,'inputNumericRange:getRange');
            return (Integer.is(value) && Arr.in(value,range));
        },
        
        getInput: function() {
            return qs(this,"input[type='text']");
        },
        
        getButtons: function() {
            const prev = trigHdlr(this,'inputNumericRange:getButtonPrev');
            const next = trigHdlr(this,'inputNumericRange:getButtonNext');
            return [prev,next];
        },
        
        getButtonPrev: function() {
            return qs(this,"button[data-range='prev']");;
        },
        
        getButtonNext: function() {
            return qs(this,"button[data-range='next']");;
        },
        
        getRangeAttr: function() {
            const input = trigHdlr(this,'inputNumericRange:getInput');
            
            return {
                min: getAttr(input,'data-min','int'),
                max: getAttr(input,'data-max','int'),
                inc: getAttr(input,'data-inc','int')
            }
        },
        
        getRange: function() {
            const attr = trigHdlr(this,'inputNumericRange:getRangeAttr');
            const r = Integer.range(attr.min,attr.max,attr.inc);
            const firstValue = Arr.valueFirst(r);
            
            if($option.zero === true && firstValue !== 0)
            r.unshift(0);
            
            return r;
        },
        
        refresh: function() {
            refreshButtons.call(this);
        }
    });
    

    // setup
    aelOnce(this,'component:setup',function() {
        bindInput.call(this);
        bindButtons.call(this);
        trigHdlr(this,'inputNumericRange:refresh');
    });
    
    
    // bindInput
    const bindInput = function()
    {
        const $this = this;
        const input = trigHdlr(this,'inputNumericRange:getInput');
        Component.InputNumeric.call(input,option);
        
        setHdlrs(input,'inputNumeric:',{
            
            getPrev: function() {
                return getPrevNext.call($this,'prev');
            },
            
            getNext: function() {
                return getPrevNext.call($this,'next');
            },
            
            getMax: function() {
                const range = trigHdlr($this,'inputNumericRange:getRange');
                return Arr.valueLast(range);
            },
            
            validateReplace: function(val) {
                let r = null;
                const range = trigHdlr($this,'inputNumericRange:getRange');
                const min = Arr.valueFirst(range);
                const max = Arr.valueLast(range);
                
                if(val > max)
                r = max;
                
                else if(val < min)
                r = min;
                
                else if(!Arr.in(val,range))
                r = getClosest.call(this,val,range);
                
                return r;
            }
        });
        
        ael(input,'inputNumeric:change',function() {
            trigHdlr($this,'inputNumericRange:refresh');
            trigEvt($this,'inputNumericRange:change');
        });
    }
    
    
    // bindButtons
    const bindButtons = function()
    {
        const prev = trigHdlr(this,'inputNumericRange:getButtonPrev');
        const input = trigHdlr(this,'inputNumericRange:getInput');
        
        ael(prev,'click',function() {
            trigHdlr(input,'inputNumeric:setPrev');
        });
        
        const next = trigHdlr(this,'inputNumericRange:getButtonNext');
        ael(next,'click',function() {
            trigHdlr(input,'inputNumeric:setNext');
        });
    }
    
    
    // refreshButtons
    const refreshButtons = function()
    {
        const range = trigHdlr(this,'inputNumericRange:getRange');
        const input = trigHdlr(this,'inputNumericRange:getInput');
        const value = trigHdlr(input,'input:getValueInt');
        
        const prev = trigHdlr(this,'inputNumericRange:getButtonPrev');
        const isFirst = Arr.valueFirst(range) === value;
        setProp(prev,'disabled',isFirst);
        
        const next = trigHdlr(this,'inputNumericRange:getButtonNext');
        const isLast = Arr.valueLast(range) === value;
        setProp(next,'disabled',isLast);
    }
    
    
    // getClosest
    const getClosest = function(value,range)
    {
        let r = null;
        
        let lastVal;
        Arr.each(range,function(v) {
            if(v > value)
            {
                r = lastVal || v;
                return false;
            }
            
            lastVal = v;
        });
        
        return r;
    }
    
    
    // getPrevNext
    const getPrevNext = function(type)
    {
        let r = null;
        const attr = trigHdlr(this,'inputNumericRange:getRangeAttr');
        const input = trigHdlr(this,'inputNumericRange:getInput');
        let value = trigHdlr(input,'inputNumeric:getValueRestore');
        const range = trigHdlr(this,'inputNumericRange:getRange');
        let newKey = (type === 'prev')? Arr.keyLast(range):Arr.keyFirst(range);
        
        if(Arr.in(value,range))
        {
            const key = Arr.search(value,range);
            newKey = (type === 'prev')? (key-1):(key+1);
        }
        
        r = Arr.get(newKey,range);
        
        return r;
    }
    
    return this;
}