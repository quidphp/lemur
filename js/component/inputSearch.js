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
        useCurrent: true,
        timeoutHandler: 'inputSearch:process'
    },option);
    
    
    // components
    Component.KeyboardEnter.call(this,true,$option.keyEvent);
    Component.Timeout.call(this,$option.keyEvent,$option.timeout);
    Component.ValidatePrevent.call(this,'inputSearch:change');
    
    
    // handler
    setHdlrs(this,'inputSearch:',{
        
        getCurrent: function() {
            return $(this).data("current");
        },
        
        setCurrent: function(value) {
            $(this).data("current",value);
        },
        
        unsetCurrent: function() {
            $(this).removeData("current");
        },
        
        getButton: function() {
            return $(this).next("button[type='button']").get(0);
        },
        
        validate: function() {
            let r = trigHdlr(this,'validate:process');
            const val = trigHdlr(this,'input:getValueTrim');
            const current = trigHdlr(this,'inputSearch:getCurrent');
            const isCurrent = Str.isEqual(val,current);
            
            if(r === true && ($option.useCurrent && isCurrent === true))
            {
                r = false;
                trigEvt(this,'validate:invalid');
            }
            
            return r;
        },
        
        process: function() {
            const validate = trigHdlr(this,'inputSearch:validate');
            
            if(validate === true)
            {
                trigHdlr(this,'input:valueRemember');
                trigEvt(this,'inputSearch:change');
            }
        },
        
        success: function() {
            const value = trigHdlr(this,'input:getValueTrim');
            
            if($option.useCurrent === true)
            trigHdlr(this,'inputSearch:setCurrent',value);
            
            trigHdlr(this,'timeout:clear',$option.keyEvent);
        },
        
        buttonClick: function() {
            trigHdlr(this,'inputSearch:process');
        }
    });
    
    
    // event
    ael(this,'keyboardEnter:blocked',function() {
        trigHdlr(this,'inputSearch:buttonClick');
    });
        
    ael(this,'timeout:'+$option.keyEvent,function() {
        if($(this).is(":focus"))
        {
            trigHdlr(this,'input:valueRemember');
            trigHdlr(this,$option.timeoutHandler);
        }
    });
    
    ael(this,'click',function(event) {
        event.stopPropagation();
    });
    
    ael(this,'change',function() {
        if(trigHdlr(this,'input:isRealChange'))
        trigHdlr(this,'inputSearch:process');
    });
    
    ael(this,'inputSearch:change',function() {
        trigHdlr(this,'timeout:clear',$option.keyEvent);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindButton.call(this);
    });
    
    
    // bindButton
    const bindButton = function() 
    {
        const $this = this;
        const button = trigHdlr(this,'inputSearch:getButton');
        
        ael(button,'click',function(event) {
            trigHdlr($this,'inputSearch:buttonClick');
            
            event.stopPropagation();
            event.preventDefault();
        });
    }
    
    return this;
}