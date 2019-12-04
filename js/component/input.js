/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// input
// script with behaviours for an input component
const Input = function() 
{    
    // nodes
    const $nodes = this;
    
    
    // func
    setFunc(this,'input:isBinded',function() {
        return true;
    });
    
    setFunc(this,'input:isEmpty',function() {
        const value = triggerFunc(this,'input:getValue');
        return Str.isEmpty(value,true);
    });
    
    setFunc(this,'input:isDisabled',function() {
        return ($(this).prop('disabled') === true)? true:false;
    });
    
    setFunc(this,'input:getValue',function(trim) {
        return Dom.value(this,trim);
    });
    
    setFunc(this,'input:getValueInt',function() {
        return Num.castInt(triggerFunc(this,'input:getValue',true));
    });
    
    setFunc(this,'input:getName',function() {
        return $(this).prop('name');
    });
    
    setFunc(this,'input:setValue',function(value) {
        $(this).val(value);
    });
    
    setFunc(this,'input:setEmpty',function() {
        $(this).val('');
    });
    
    
    // custom
    ael(this,'input:enable',function() {
        $(this).prop('disabled',false);
    });
    
    ael(this,'input:disable',function() {
        $(this).prop('disabled',true);
    });
    
    
    // setup form
    aelOnce(this,'input:form:setup',function() {
        
        setFunc(this,'input:isSystem',function() {
            return $(this).is("[name^='-']");
        });
        
        setFunc(this,'input:isTarget',function() {
            return (!triggerFunc(this,'input:isDisabled') && $(this).is("[name]"))? true:false;
        });
        
        setFunc(this,'input:isTargetVisible',function() {
            return (triggerFunc(this,'input:isTarget') && $(this).is(":visible"))? true:false;
        });
        
        setFunc(this,'input:isValidate',function() {
            return (triggerFunc(this,'input:isTarget') && $(this).is("[data-required],[data-pattern]"))? true:false;
        });
        
        setFunc(this,'input:isFile',function() {
            return $(this).is("input[type='file']");
        });
        
        setFunc(this,'input:isCsrf',function() {
            return (triggerFunc(this,'input:isSystem') && $(this).is("[data-csrf='1']"))? true:false;
        });
        
        setFunc(this,'input:isGenuine',function() {
            return (triggerFunc(this,'input:isSystem') && $(this).is("[data-genuine='1']"))? true:false;
        });
        
        setFunc(this,'input:isSubmit',function() {
            return $(this).is("[type='submit'],[type='image']");
        });
        
        setFunc(this,'input:isClickedSubmit',function() {
            return (triggerFunc(this,'input:isSubmit') && $(this).is("[data-submit-click]"))? true:false;
        });
    });
    
    // setup validate
    aelOnce(this,'input:validate:setup',function() {
        
        Component.Validate.call(this);
        
        setFunc(this,'validate:getValue',function() {
            return triggerFunc(this,'input:getValue');
        });
        
        triggerCustom(this,'validate:setup');
    });
    
    return this;
};

// export
Component.Input = Input;