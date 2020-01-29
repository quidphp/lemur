/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearchHref
// script containing logic for a search input with a button
Component.InputSearch = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        timeout: 500,
        keyEvent: 'keydown',
        useCurrent: true,
        button: "button[type='button']",
        timeoutHandler: 'inputSearch:process'
    },option);
    
    
    // components
    Component.KeyboardEnter.call(this,true,$option.keyEvent);
    Component.Timeout.call(this,$option.keyEvent,$option.timeout);
    Component.ValidatePrevent.call(this,'inputSearch:change');
    
    
    // handler
    setHdlrs(this,'inputSearch:',{
        
        getCurrent: function() {
            return getAttr(this,'data-current');
        },
        
        setCurrent: function(value) {
            setAttr(this,"data-current",value);
        },
        
        unsetCurrent: function() {
            Ele.removeAttr(this,"data-current");
        },
        
        getButton: function() {
            return (Str.is($option.button))? Nod.next(this,$option.button):undefined;
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
                trigHdlr(this,'input:rememberValue');
                trigEvt(this,'inputSearch:change');
            }
        },
        
        success: function() {
            const value = trigHdlr(this,'input:getValueTrim');
            
            if($option.useCurrent === true)
            trigHdlr(this,'inputSearch:setCurrent',value);
            
            trigHdlr(this,'inputSearch:clearTimeout');
        },
        
        buttonClick: function() {
            trigHdlr(this,'inputSearch:process');
        },
        
        clearTimeout: function() {
            trigHdlr(this,'timeout:clear',$option.keyEvent);
        }
    });
    
    setHdlr(this,'timeout:validateEvent',function(event) {
        return !Evt.isSpecialKeyCode(event);
    });
    
    
    // event
    ael(this,'keyboardEnter:blocked',function() {
        trigHdlr(this,'inputSearch:buttonClick');
    });
    
    ael(this,'timeout:'+$option.keyEvent,function(event,keyEvent) {
        if(Nod.match(this,":focus"))
        {
            trigHdlr(this,'input:rememberValue');
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
        trigHdlr(this,'inputSearch:clearTimeout');
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
            Evt.preventStop(event);
        });
    }
    
    return this;
}