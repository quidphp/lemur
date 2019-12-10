/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validation
// component with functions related to validation (pattern and required)
const ComponentValidate = Component.Validate = function() 
{    
    // func
    setFunc(this,'validate:isBinded',function() {
        return true;
    });
    
    setFunc(this,'validate:getValue',function() {
        return Dom.value(this,true);
    });
    
    setFunc(this,'validate:isRequired',function() {
        const dataRequired = triggerFunc(this,'validate:getRequired');
        return (Num.is(dataRequired) && dataRequired > 0)? true:false;
    });
    
    setFunc(this,'validate:getRequired',function() {
        return $(this).attr("data-required");
    });
    
    setFunc(this,'validate:getPattern',function() {
        return $(this).attr("data-pattern");
    });
    
    setFunc(this,'validate:isEmpty',function() {
        return (Vari.isEmpty(triggerFunc(this,'validate:getValue')))? true:false;
    });
    
    setFunc(this,'validate:validEmptyArray',function(type) {
        let r = [];
        let validate = null;
        const value = triggerFunc(this,'validate:getValue');
        const empty = (Vari.isEmpty(value))? true:false;
        const required = triggerFunc(this,'validate:getRequired');
        const pattern = triggerFunc(this,'validate:getPattern');
        
        if(type === 'required')
        validate = Validate.required(value,required);
        
        else if(type === 'pattern')
        validate = Validate.pattern(value,pattern);
        
        else
        validate = Validate.trigger(value,required,pattern);
        
        return [validate,empty];
    });
    
    setFunc(this,'validate:isValid',function(type) {
        return Arr.valueFirst(triggerFunc(this,'validate:validEmptyArray',type));
    });
    
    setFunc(this,'validate:isNotEmptyAndValid',function(type) {
        return (!triggerFunc(this,'validate:isEmpty') && triggerFunc(this,'validate:isValid',type))? true:false;
    });
    
    setFunc(this,'validate:process',function() {
        return triggerFunc(this,triggerFunc(this,'validate:isEmpty')? 'validate:pattern':'validate:trigger');
    });
    
    setFunc(this,'validate:required',function() {
        return triggerFunc(this,'validate:trigger','required');
    });
    
    setFunc(this,'validate:pattern',function() {
        return triggerFunc(this,'validate:trigger','pattern');
    });
    
    setFunc(this,'validate:trigger',function(type) {
        const validEmpty = triggerFunc(this,'validate:validEmptyArray',type);
        const r = validEmpty[0];
        const empty = validEmpty[1];
        
        triggerEvent(this,(r === true)? 'validate:valid':'validate:invalid');
        triggerEvent(this,(empty === true)? 'validate:empty':'validate:notEmpty');
        
        return r;
    });
    
    
    // event
    ael(this,'validate:valid',function() {
        $(this).attr('data-validate','valid');
    });
    
    ael(this,'validate:invalid',function() {
        $(this).attr('data-validate','invalid');
    });
    
    ael(this,'validate:empty',function() {
        $(this).attr('data-empty',1);
    });
    
    ael(this,'validate:notEmpty',function() {
        $(this).attr('data-empty',0);
    });
    
    return this;
}