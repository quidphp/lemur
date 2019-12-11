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
    setHandler(this,'input:isBinded',function() {
        return true;
    });
    
    setHandler(this,'input:isControlled',function() {
        return $(this).attr('data-controlled') === '1';
    });
    
    // handler    
    setHandler(this,'input:isGroup',function() {
        return trigHandler(this,'input:isRadioCheckbox');
    });
    
    setHandler(this,'input:isEmpty',function() {
        const value = trigHandler(this,'input:getValue');
        return Str.isEmpty(value,true);
    });
    
    setHandler(this,'input:isDisabled',function() {
        return ($(this).prop('disabled') === true)? true:false;
    });
    
    setHandler(this,'input:allowMultiple',function() {
        return ($(this).prop('multiple') === true)? true:false;
    });
    
    setHandler(this,'input:getValue',function(trim) {
        return Dom.value(this,trim);
    });
    
    setHandler(this,'input:getValueTrim',function() {
        return trigHandler(this,'input:getValue',true);
    });
    
    setHandler(this,'input:getValueEncoded',function(trim) {
        let r = trigHandler(this,'input:getValue',trim);
        
        if(Str.isNotEmpty(r))
        r = encodeURIComponent(r);
        
        return r;
    });
    
    setHandler(this,'input:getValueInt',function() {
        return Integer.cast(trigHandler(this,'input:getValue',true));
    });
    
    setHandler(this,'input:getId',function() {
        return $(this).prop('id');
    });
    
    setHandler(this,'input:getName',function() {
        return $(this).prop('name');
    });
    
    setHandler(this,'input:getType',function() {
        return ($(this).is("input"))? $(this).prop('type'):null;
    });
    
    setHandler(this,'input:getTag',function() {
        return Dom.tag(this);
    });
    
    setHandler(this,'input:isRadioCheckbox',function() {
        return Arr.in(trigHandler(this,'input:getType'),['radio','checkbox']);
    });
    
    setHandler(this,'input:isSelect',function() {
        return trigHandler(this,'input:getType') === 'select';
    });
    
    setHandler(this,'input:setValue',function(value) {
        $(this).val(value);
    });
    
    setHandler(this,'input:setEmpty',function() {
        $(this).val('');
    });
    
    setHandler(this,'validate:getValue',function() {
        return trigHandler(this,'input:getValue');
    });
    
    setHandler(this,'input:isSystem',function() {
        return $(this).is("[name^='-']");
    });
    
    setHandler(this,'input:isTarget',function() {
        return (!trigHandler(this,'input:isDisabled') && $(this).is("[name]"))? true:false;
    });
    
    setHandler(this,'input:isTargetVisible',function() {
        return (trigHandler(this,'input:isTarget') && $(this).is(":visible"))? true:false;
    });
    
    setHandler(this,'input:isValidate',function() {
        return (trigHandler(this,'input:isTarget') && $(this).is("[data-required],[data-pattern]"))? true:false;
    });
    
    setHandler(this,'input:isFile',function() {
        return $(this).is("input[type='file']");
    });
    
    setHandler(this,'input:isCsrf',function() {
        return (trigHandler(this,'input:isSystem') && $(this).is("[data-csrf='1']"))? true:false;
    });
    
    setHandler(this,'input:isGenuine',function() {
        return (trigHandler(this,'input:isSystem') && $(this).is("[data-genuine='1']"))? true:false;
    });
    
    setHandler(this,'input:isSubmit',function() {
        return $(this).is("[type='submit'],[type='image']");
    });
    
    setHandler(this,'input:isClickedSubmit',function() {
        return (trigHandler(this,'input:isSubmit') && $(this).is("[data-submit-click]"))? true:false;
    });
    
    setHandler(this,'input:getParent',function() {
        let r = $(this).parents("form").get(0);
        
        if(r == null)
        r = document;
        
        return r;
    });
    
    setHandler(this,'input:getLabels',function() {
        const parent = trigHandler(this,'input:getParent');
        const id = trigHandler(this,'input:getId');
        
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
        
        const isGroup = trigHandler(this,'input:isGroup');
        
        // isGroup
        if(isGroup === true)
        Component.InputGroup.call(this);
        
        
        // handler
        setHandler(this,'validate:getValue',function() {
            return trigHandler(this,(isGroup === true)? 'inputGroup:getValue':'input:getValue');
        });
        
        
        // ael
        ael(this,'focusout',function() {
            trigHandler(this,'validate:process');
        });
        
        ael(this,'focus',function() {
            trigEvt(this,"validate:valid");
        });
                
        ael(this,'change',function() {
            const target = (isGroup === true)? trigHandler(this,'inputGroup:get'):this;
            trigHandlers(target,(isGroup === true)? 'validate:trigger':'validate:process');
        });
    });
    
    return this;
}