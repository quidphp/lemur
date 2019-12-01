/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validatePrevent
// valide toutes les nodes validables
// bloque l'événement si la validation échoue
Component.validatePrevent = function(type) 
{
    $(this).on(type, function(event) {
        let r = triggerFunc(this,'validatePrevent:validate')
        
        if(r !== true)
        {
            event.stopImmediatePropagation();
            event.preventDefault();
            triggerCustom(this,'validate:failed',[event]);
        }
        
        else
        triggerCustom(this,'validate:success',[event]);
        
        return r;
    })
    .on('validatePrevent:validate', function(event) {
        let r = true;
        const fields = triggerFunc(this,'validatePrevent:getFields');
        
        fields.each(function(index, el) {
            const val = triggerFunc(this,"validate:trigger");
            
            if(val === false)
            r = val;
        });
        
        return r;
    })
    .on('validatePrevent:getFields', function(event) {
        let r = $();
        
        if($(this).is(":input"))
        r = $(this);
        
        else if($(this).is("form"))
        r = triggerFunc(this,'form:getValidateFields');
        
        r.each(function(index, el) {
            if(!triggerFunc(this,'validate:binded'))
            Component.inputValidate.call(this);
        });
        
        return r;
    })
    .on('validatePrevent:prepare', function(event) {
        event.stopPropagation();
        const fields = triggerFunc(this,'validatePrevent:getFields');
        fields.trigger("validate:pattern");
    })
    .trigger('validatePrevent:prepare');
    
    return this;
}