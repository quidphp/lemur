/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// input
// script with behaviours for an input component
const Input = Component.Input = function() 
{    
    // components
    Component.Validate.call(this);
    
    
    // handler
    setHdlr(this,'input:isBinded',function() {
        return true;
    });
    
    setHdlr(this,'input:isControlled',function() {
        return getAttr(this,'data-controlled') === '1';
    });
    
    // handler    
    setHdlr(this,'input:isGroup',function() {
        return trigHdlr(this,'input:isRadioCheckbox');
    });
    
    setHdlr(this,'input:isEmpty',function() {
        const value = trigHdlr(this,'input:getValue');
        return Str.isEmpty(value,true);
    });
    
    setHdlr(this,'input:isDisabled',function() {
        return ($(this).prop('disabled') === true)? true:false;
    });
    
    setHdlr(this,'input:allowMultiple',function() {
        return ($(this).prop('multiple') === true)? true:false;
    });
    
    setHdlr(this,'input:isRealChange',function() {
        const value = trigHdlr(this,'input:getValue');
        const remember = getData(this,'input-remember');

        return (Str.isEqual(value,remember)) ? false:true;
    });
    
    setHdlr(this,'input:getValue',function(trim) {
        return Dom.value(this,trim);
    });
    
    setHdlr(this,'input:getValueTrim',function() {
        return trigHdlr(this,'input:getValue',true);
    });
    
    setHdlr(this,'input:getValueEncoded',function(trim) {
        let r = trigHdlr(this,'input:getValue',trim);
        
        if(Str.isNotEmpty(r))
        r = encodeURIComponent(r);
        
        return r;
    });
    
    setHdlr(this,'input:getValueInt',function() {
        return Integer.cast(trigHdlr(this,'input:getValue',true));
    });
    
    setHdlr(this,'input:getValueJson',function() {
        let r = trigHdlr(this,'input:getValue');
        
        if(Str.is(r))
        r = Json.decode(r);
        
        return r;
    });
    
    setHdlr(this,'input:valueRemember',function() {
        const value = trigHdlr(this,'input:getValue');
        setData(this,'input-remember',value);
    });
    
    setHdlr(this,'input:getId',function() {
        return $(this).prop('id');
    });
    
    setHdlr(this,'input:getName',function() {
        return $(this).prop('name');
    });
    
    setHdlr(this,'input:getType',function() {
        return ($(this).is("input"))? $(this).prop('type'):null;
    });
    
    setHdlr(this,'input:getTag',function() {
        return Dom.tag(this);
    });
    
    setHdlr(this,'input:isRadioCheckbox',function() {
        return Arr.in(trigHdlr(this,'input:getType'),['radio','checkbox']);
    });
    
    setHdlr(this,'input:isSelect',function() {
        return trigHdlr(this,'input:getType') === 'select';
    });
    
    setHdlr(this,'input:setValue',function(value) {
        if(Obj.is(value))
        value = Json.encode(value);
        
        $(this).val(value);
    });
    
    setHdlr(this,'input:setEmpty',function() {
        $(this).val('');
    });
    
    setHdlr(this,'validate:getValue',function() {
        return trigHdlr(this,'input:getValue');
    });
    
    setHdlr(this,'input:isSystem',function() {
        return $(this).is("[name^='-']");
    });
    
    setHdlr(this,'input:isTarget',function() {
        return (!trigHdlr(this,'input:isDisabled') && !trigHdlr(this,'input:isSystem') && $(this).is("[name]"))? true:false;
    });
    
    setHdlr(this,'input:isTargetVisible',function() {
        return (trigHdlr(this,'input:isTarget') && $(this).is(":visible"))? true:false;
    });
    
    setHdlr(this,'input:isValidate',function() {
        return (trigHdlr(this,'input:isTarget') && $(this).is("[data-required],[data-pattern]"))? true:false;
    });
    
    setHdlr(this,'input:isFile',function() {
        return $(this).is("input[type='file']");
    });
    
    setHdlr(this,'input:isCsrf',function() {
        return (trigHdlr(this,'input:isSystem') && $(this).is("[data-csrf='1']"))? true:false;
    });
    
    setHdlr(this,'input:isGenuine',function() {
        return (trigHdlr(this,'input:isSystem') && $(this).is("[data-genuine='1']"))? true:false;
    });
    
    setHdlr(this,'input:isSubmit',function() {
        return $(this).is("[type='submit'],[type='image']");
    });
    
    setHdlr(this,'input:isClickedSubmit',function() {
        return (trigHdlr(this,'input:isSubmit') && $(this).is("[data-submit-click]"))? true:false;
    });
    
    setHdlr(this,'input:getParent',function() {
        let r = $(this).parents("form").get(0);
        
        if(r == null)
        r = document;
        
        return r;
    });
    
    setHdlr(this,'input:getLabels',function() {
        const parent = trigHdlr(this,'input:getParent');
        const id = trigHdlr(this,'input:getId');
        
        if(Str.isNotEmpty(id))
        return qsa(parent,"label[for='"+id+"']");
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