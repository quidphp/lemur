/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// input
// script with behaviours for an input component
Component.Input = function() 
{    
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.Validate.call(this);
    
    
    // handler
    setHdlrs(this,'input:',{
        
        isBinded: function() {
            return true;
        },
        
        isValidateSetup: function() {
            return false;
        },
        
        isControlled: function() {
            return getAttr(this,'data-controlled','int') === 1;
        },
        
        isGroup: function() {
            return trigHdlr(this,'input:isRadioCheckbox');
        },
        
        isEmpty: function() {
            const value = trigHdlr(this,'input:getValue');
            return Str.isEmpty(value,true);
        },
        
        isDisabled: function() {
            return (getProp(this,'disabled') === true)? true:false;
        },
        
        allowMultiple: function() {
            return (getProp(this,'multiple') === true)? true:false;
        },
        
        isRealChange: function() {
            const value = trigHdlr(this,'input:getValue');
            const remember = getData(this,'input-remember');

            return (Str.isEqual(value,remember)) ? false:true;
        },
        
        getValue: function(trim) {
            return Ele.getValue(this,trim);
        },
        
        getValueTrim: function() {
            return trigHdlr(this,'input:getValue',true);
        },
        
        getValueEncoded: function(trim) {
            let r = trigHdlr(this,'input:getValue',trim);
            
            if(Str.isNotEmpty(r))
            r = encodeURIComponent(r);
            
            return r;
        },
        
        getValueInt: function() {
            return Integer.cast(trigHdlr(this,'input:getValue',true));
        },
        
        getValueJson: function() {
            let r = trigHdlr(this,'input:getValue');
            
            if(Str.is(r))
            r = Json.decode(r);
            
            return r;
        },
        
        valueRemember: function() {
            const value = trigHdlr(this,'input:getValue');
            setData(this,'input-remember',value);
        },
        
        getId: function() {
            return getProp(this,'id');
        },
        
        getName: function() {
            return getProp(this,'name');
        },
        
        getType: function() {
            return (Nod.match(this,"input"))? getProp(this,'type'):null;
        },
        
        getTag: function() {
            return Ele.tag(this);
        },
        
        isRadioCheckbox: function() {
            return Arr.in(trigHdlr(this,'input:getType'),['radio','checkbox']);
        },
        
        isSelect: function() {
            return trigHdlr(this,'input:getType') === 'select';
        },
        
        setValue: function(value) {
            Ele.setValue(this,value);
        },
        
        setEmpty: function() {
            trigHdlr(this,'input:setValue','');
        },
        
        appendValue: function(value) {
            const current = trigHdlr(this,'input:getVal') || '';
            const newVal = (current + value);
            trigHdlr(this,'input:setValue',newVal);
        },
        
        isSystem: function() {
            return Nod.match(this,"[name^='-']");
        },
        
        isTarget: function() {
            return (!trigHdlr(this,'input:isDisabled') && !trigHdlr(this,'input:isSystem') && Nod.match(this,"[name]"))? true:false;
        },
        
        isTargetVisible: function() {
            return (trigHdlr(this,'input:isTarget') && Ele.isVisible(this))? true:false;
        },
        
        isValidate: function() {
            return (trigHdlr(this,'input:isTarget') && Nod.match(this,"[data-required],[data-pattern]"))? true:false;
        },
        
        isFile: function() {
            return Nod.match(this,"input[type='file']");
        },
        
        isCsrf: function() {
            return (trigHdlr(this,'input:isSystem') && Nod.match(this,"[data-csrf='1']"))? true:false;
        },
        
        isGenuine: function() {
            return (trigHdlr(this,'input:isSystem') && Nod.match(this,"[data-genuine='1']"))? true:false;
        },
        
        isSubmit: function() {
            return Nod.match(this,"[type='submit'],[type='image']");
        },
        
        isClickedSubmit: function() {
            return (trigHdlr(this,'input:isSubmit') && Nod.match(this,"[data-submit-click]"))? true:false;
        },
        
        getParent: function() {
            let r = Nod.closest(this,"form");
            
            if(r == null)
            r = document;
            
            return r;
        },
        
        getLabels: function() {
            const parent = trigHdlr(this,'input:getParent');
            const id = trigHdlr(this,'input:getId');
            
            if(Str.isNotEmpty(id))
            return qsa(parent,"label[for='"+id+"']");
        },
        
        // handlers qui renvoie vers event, car ie11 n'envoie pas de custom event aux nodes disabled
        enable: function() {
            setProp(this,'disabled',false);
            trigEvt(this,'input:enable');
        },
        
        disable: function() {
            trigEvt(this,'input:disable');
            setProp(this,'disabled',true);
        }
    });
    
    setHdlr(this,'validate:getValue',function() {
        return trigHdlr(this,'input:getValue');
    });
    
    
    // setup
    aelOnce(this,'input:setupGroup',function() {
        const isGroup = trigHdlr(this,'input:isGroup');
        
        // isGroup
        if(isGroup === true)
        Component.InputGroup.call(this);
        
        // handler
        setHdlr(this,'validate:getValue',function() {
            return trigHdlr(this,(isGroup === true)? 'inputGroup:getValue':'input:getValue');
        });
    });
    
    aelOnce(this,'input:setupValidate',function() {
        
        if(!trigHdlr(this,'validate:isBinded'))
        Component.Validate.call(this);
        
        setHdlr(this,'input:isValidateSetup',function() {
            return true;
        });
        
        ael(this,'focusout',function() {
            trigHdlr(this,'validate:process');
        });
        
        ael(this,'focus',function() {
            trigEvt(this,"validate:valid");
        });
                
        ael(this,'change',function() {
            const isGroup = trigHdlr(this,'input:isGroup');
            const target = (isGroup === true)? trigHdlr(this,'inputGroup:get'):this;
            trigHdlrs(target,(isGroup === true)? 'validate:trigger':'validate:process');
        });
    });
    
    aelOnce(this,'component:setup',function() {
        trigEvt(this,'input:setupGroup');
        trigEvt(this,'input:setupValidate');
    });
    
    return this;
}