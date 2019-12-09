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
    
    setFunc(this,'input:getValueEncoded',function(trim) {
        let r = triggerFunc(this,'input:getValue',trim);
        
        if(Str.isNotEmpty(r))
        r = encodeURIComponent(r);
        
        return r;
    });
    
    setFunc(this,'input:getValueInt',function() {
        return Integer.cast(triggerFunc(this,'input:getValue',true));
    });
    
    setFunc(this,'input:getId',function() {
        return $(this).prop('id');
    });
    
    setFunc(this,'input:getName',function() {
        return $(this).prop('name');
    });
    
    setFunc(this,'input:getType',function() {
        return ($(this).is("input"))? $(this).prop('type'):null;
    });
        
    setFunc(this,'input:getTag',function() {
        return Dom.tag(this);
    });
    
    setFunc(this,'input:setValue',function(value) {
        $(this).val(value);
    });
    
    setFunc(this,'input:setEmpty',function() {
        $(this).val('');
    });
    
    setFunc(this,'validate:getValue',function() {
        return triggerFunc(this,'input:getValue');
    });
    
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
    
    setFunc(this,'input:getParent',function() {
        let r = $(this).parents("form").get(0);
        
        if(r == null)
        r = document;
        
        return r;
    });
    
    setFunc(this,'input:getLabels',function() {
        const parent = triggerFunc(this,'input:getParent');
        const id = triggerFunc(this,'input:getId');
        
        if(Str.isNotEmpty(id))
        return qsa(parent,"label[for='"+id+"']");
    });
    
    setFunc(this,'input:getGroup',function() {
        const parent = triggerFunc(this,'input:getParent');
        const name = triggerFunc(this,'input:getName');
        const type =triggerFunc(this,'input:getType');
        const tag =triggerFunc(this,'input:getTag');
        
        if(Str.isNotEmpty(name) && Str.isNotEmpty(tag))
        {
            const typeSearch = (Str.isNotEmpty(type))? "[type='"+type+"']":tag;
            return qsa(parent,typeSearch+"[name='"+name+"']");
        }
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

        ael(this,'change',function() {
            triggerFunc(this,'validate:process');
        });
        
        ael(this,'focusout',function() {
            triggerFunc(this,'validate:process');
        });
        
        ael(this,'focus',function() {
            triggerEvent(this,"validate:valid");
        });
    });
    
    return this;
}