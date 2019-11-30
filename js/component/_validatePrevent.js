/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validatePrevent
// valide toutes les nodes validables
// bloque l'événement si la validation échoue
Quid.Component.validatePrevent = function(type) 
{
    $(this).on(type, function(event) {
        var r = $(this).triggerHandler('validatePrevent:validate')
        
        if(r !== true)
        {
            event.stopImmediatePropagation();
            event.preventDefault();
            $(this).trigger('validate:failed',[event]);
        }
        
        else
        $(this).trigger('validate:success',[event]);
        
        return r;
    })
    .on('validatePrevent:validate', function(event) {
        var r = true;
        var fields = $(this).triggerHandler('validatePrevent:getFields');
        
        fields.each(function(index, el) {
            var val = $(this).triggerHandler("validate:trigger");
            
            if(val === false)
            r = val;
        });
        
        return r;
    })
    .on('validatePrevent:getFields', function(event) {
        var r = $();
        
        if($(this).is(":input"))
        r = $(this);
        
        else if($(this).is("form"))
        r = $(this).triggerHandler('form:getValidateFields');
        
        r.each(function(index, el) {
            if(!$(this).triggerHandler('validate:binded'))
            Quid.Component.inputValidate.call(this);
        });
        
        return r;
    })
    .on('validatePrevent:prepare', function(event) {
        event.stopPropagation();
        var fields = $(this).triggerHandler('validatePrevent:getFields');
        fields.trigger("validate:pattern");
    })
    .trigger('validatePrevent:prepare');
    
    return this;
}