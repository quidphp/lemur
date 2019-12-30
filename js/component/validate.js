/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validation
// component with functions related to validation (pattern and required)
Component.Validate = function() 
{    
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlr(this,'validate:isBinded',function() {
        return true;
    });
    
    setHdlr(this,'validate:getValue',function() {
        return Ele.getValue(this,true);
    });
    
    setHdlr(this,'validate:isRequired',function() {
        const dataRequired = trigHdlr(this,'validate:getRequired');
        return Num.isPositive(dataRequired);
    });
    
    setHdlr(this,'validate:getRequired',function() {
        return getAttr(this,"data-required");
    });
    
    setHdlr(this,'validate:getPattern',function() {
        return getAttr(this,"data-pattern");
    });
    
    setHdlr(this,'validate:isEmpty',function() {
        return (Vari.isEmpty(trigHdlr(this,'validate:getValue')))? true:false;
    });
    
    setHdlr(this,'validate:isEmptyAndRequired',function() {
        return (trigHdlr(this,'validate:isRequired') && trigHdlr(this,'validate:isEmpty'));
    });
    
    setHdlr(this,'validate:validEmptyArray',function(type) {
        let r = [];
        let validate = null;
        const value = trigHdlr(this,'validate:getValue');
        const empty = (Vari.isEmpty(value))? true:false;
        const required = trigHdlr(this,'validate:getRequired');
        const pattern = trigHdlr(this,'validate:getPattern');
        
        if(type === 'required')
        validate = Validate.required(value,required);
        
        else if(type === 'pattern')
        validate = Validate.pattern(value,pattern);
        
        else
        validate = Validate.trigger(value,required,pattern);
        
        return [validate,empty];
    });
    
    setHdlr(this,'validate:isValid',function(type) {
        return Arr.valueFirst(trigHdlr(this,'validate:validEmptyArray',type));
    });
    
    setHdlr(this,'validate:isNotEmptyAndValid',function(type) {
        return (!trigHdlr(this,'validate:isEmpty') && trigHdlr(this,'validate:isValid',type))? true:false;
    });
    
    setHdlr(this,'validate:process',function() {
        return trigHdlr(this,trigHdlr(this,'validate:isEmpty')? 'validate:pattern':'validate:trigger');
    });
    
    setHdlr(this,'validate:required',function() {
        return trigHdlr(this,'validate:trigger','required');
    });
    
    setHdlr(this,'validate:pattern',function() {
        return trigHdlr(this,'validate:trigger','pattern');
    });
    
    setHdlr(this,'validate:trigger',function(type) {
        const validEmpty = trigHdlr(this,'validate:validEmptyArray',type);
        const r = validEmpty[0];
        const empty = validEmpty[1];
        
        trigEvt(this,(r === true)? 'validate:valid':'validate:invalid');
        trigEvt(this,(empty === true)? 'validate:empty':'validate:notEmpty');
        
        return r;
    });
    
    
    // event
    ael(this,'validate:valid',function() {
        setAttr(this,'data-validate','valid');
    });
    
    ael(this,'validate:invalid',function() {
        setAttr(this,'data-validate','invalid');
    });
    
    ael(this,'validate:empty',function() {
        setAttr(this,'data-empty',1);
    });
    
    ael(this,'validate:notEmpty',function() {
        setAttr(this,'data-empty',0);
    });
    
    return this;
}