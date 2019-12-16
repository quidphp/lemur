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
        
        isControlled: function() {
            return getAttr(this,'data-controlled') === '1';
        },
        
        isGroup: function() {
            return trigHdlr(this,'input:isRadioCheckbox');
        },
        
        isEmpty: function() {
            const value = trigHdlr(this,'input:getValue');
            return Str.isEmpty(value,true);
        },
        
        isDisabled: function() {
            return ($(this).prop('disabled') === true)? true:false;
        },
        
        allowMultiple: function() {
            return ($(this).prop('multiple') === true)? true:false;
        },
        
        isRealChange: function() {
            const value = trigHdlr(this,'input:getValue');
            const remember = getData(this,'input-remember');

            return (Str.isEqual(value,remember)) ? false:true;
        },
        
        getValue: function(trim) {
            return Dom.value(this,trim);
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
            return $(this).prop('id');
        },
        
        getName: function() {
            return $(this).prop('name');
        },
        
        getType: function() {
            return ($(this).is("input"))? $(this).prop('type'):null;
        },
        
        getTag: function() {
            return Dom.tag(this);
        },
        
        isRadioCheckbox: function() {
            return Arr.in(trigHdlr(this,'input:getType'),['radio','checkbox']);
        },
        
        isSelect: function() {
            return trigHdlr(this,'input:getType') === 'select';
        },
        
        setValue: function(value) {
            if(Obj.is(value))
            value = Json.encode(value);
            
            $(this).val(value);
        },
        
        setEmpty: function() {
            $(this).val('');
        },
        
        appendValue: function(value) {
            const current = trigHdlr(this,'input:getVal') || '';
            const newVal = (current + value);
            trigHdlr(this,'input:setValue',newVal);
        },
        
        isSystem: function() {
            return $(this).is("[name^='-']");
        },
        
        isTarget: function() {
            return (!trigHdlr(this,'input:isDisabled') && !trigHdlr(this,'input:isSystem') && $(this).is("[name]"))? true:false;
        },
        
        isTargetVisible: function() {
            return (trigHdlr(this,'input:isTarget') && $(this).is(":visible"))? true:false;
        },
        
        isValidate: function() {
            return (trigHdlr(this,'input:isTarget') && $(this).is("[data-required],[data-pattern]"))? true:false;
        },
        
        isFile: function() {
            return $(this).is("input[type='file']");
        },
        
        isCsrf: function() {
            return (trigHdlr(this,'input:isSystem') && $(this).is("[data-csrf='1']"))? true:false;
        },
        
        isGenuine: function() {
            return (trigHdlr(this,'input:isSystem') && $(this).is("[data-genuine='1']"))? true:false;
        },
        
        isSubmit: function() {
            return $(this).is("[type='submit'],[type='image']");
        },
        
        isClickedSubmit: function() {
            return (trigHdlr(this,'input:isSubmit') && $(this).is("[data-submit-click]"))? true:false;
        },
        
        getParent: function() {
            let r = $(this).parents("form").get(0);
            
            if(r == null)
            r = document;
            
            return r;
        },
        
        getLabels: function() {
            const parent = trigHdlr(this,'input:getParent');
            const id = trigHdlr(this,'input:getId');
            
            if(Str.isNotEmpty(id))
            return qsa(parent,"label[for='"+id+"']");
        }
    });
    
    setHdlr(this,'validate:getValue',function() {
        return trigHdlr(this,'input:getValue');
    });
    
    
    // event
    ael(this,'input:enable',function() {
        $(this).prop('disabled',false);
    });
    
    ael(this,'input:disable',function() {
        $(this).prop('disabled',true);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        
        const isGroup = trigHdlr(this,'input:isGroup');
        
        // isGroup
        if(isGroup === true)
        Component.InputGroup.call(this);
        
        
        // handler
        setHdlr(this,'validate:getValue',function() {
            return trigHdlr(this,(isGroup === true)? 'inputGroup:getValue':'input:getValue');
        });
        
        
        // ael
        ael(this,'focusout',function() {
            trigHdlr(this,'validate:process');
        });
        
        ael(this,'focus',function() {
            trigEvt(this,"validate:valid");
        });
                
        ael(this,'change',function() {
            const target = (isGroup === true)? trigHdlr(this,'inputGroup:get'):this;
            trigHdlrs(target,(isGroup === true)? 'validate:trigger':'validate:process');
        });
    });
    
    return this;
}