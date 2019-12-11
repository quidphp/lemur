/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validation
// component with functions related to validation (pattern and required)
const ComponentValidate = Component.Validate = function() 
{    
    // handler
    setHandler(this,'validate:isBinded',function() {
        return true;
    });
    
    setHandler(this,'validate:getValue',function() {
        return Dom.value(this,true);
    });
    
    setHandler(this,'validate:isRequired',function() {
        const dataRequired = trigHandler(this,'validate:getRequired');
        return (Num.is(dataRequired) && dataRequired > 0)? true:false;
    });
    
    setHandler(this,'validate:getRequired',function() {
        return $(this).attr("data-required");
    });
    
    setHandler(this,'validate:getPattern',function() {
        return $(this).attr("data-pattern");
    });
    
    setHandler(this,'validate:isEmpty',function() {
        return (Vari.isEmpty(trigHandler(this,'validate:getValue')))? true:false;
    });
    
    setHandler(this,'validate:validEmptyArray',function(type) {
        let r = [];
        let validate = null;
        const value = trigHandler(this,'validate:getValue');
        const empty = (Vari.isEmpty(value))? true:false;
        const required = trigHandler(this,'validate:getRequired');
        const pattern = trigHandler(this,'validate:getPattern');
        
        if(type === 'required')
        validate = Validate.required(value,required);
        
        else if(type === 'pattern')
        validate = Validate.pattern(value,pattern);
        
        else
        validate = Validate.trigger(value,required,pattern);
        
        return [validate,empty];
    });
    
    setHandler(this,'validate:isValid',function(type) {
        return Arr.valueFirst(trigHandler(this,'validate:validEmptyArray',type));
    });
    
    setHandler(this,'validate:isNotEmptyAndValid',function(type) {
        return (!trigHandler(this,'validate:isEmpty') && trigHandler(this,'validate:isValid',type))? true:false;
    });
    
    setHandler(this,'validate:process',function() {
        return trigHandler(this,trigHandler(this,'validate:isEmpty')? 'validate:pattern':'validate:trigger');
    });
    
    setHandler(this,'validate:required',function() {
        return trigHandler(this,'validate:trigger','required');
    });
    
    setHandler(this,'validate:pattern',function() {
        return trigHandler(this,'validate:trigger','pattern');
    });
    
    setHandler(this,'validate:trigger',function(type) {
        const validEmpty = trigHandler(this,'validate:validEmptyArray',type);
        const r = validEmpty[0];
        const empty = validEmpty[1];
        
        trigEvt(this,(r === true)? 'validate:valid':'validate:invalid');
        trigEvt(this,(empty === true)? 'validate:empty':'validate:notEmpty');
        
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