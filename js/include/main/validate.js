"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validate
// script with behaviours related to form and field validation

// validate
// validate un élément de formulaire
// utilise required et pattern
quid.main.validate = $.fn.validate = function() 
{
    var r = false;
    
    if($(this).length)
    {
        r = $(this).required();
        
        if(r === true)
        r = $(this).pattern();
    }
    
    return r;
}


// required
// validate un élément de formulaire, uniquemment avec required
// required peut être numérique pour checkbox et radio, à ce moment c'est un min count
// les input disabled ne sont pas considéré
quid.main.required = $.fn.required = function() 
{
    var r = false;
    
    if($(this).length)
    {
        r = true;
        
        $(this).each(function(index) {
            var disabled = $(this).prop('disabled');
            var required = $(this).data("required");
            
            if(!disabled && required && $.isNumeric(required))
            {
                if($(this).is("[type='checkbox'],[type='radio']"))
                {
                    var checked = ($(this).prop("checked") === true)? 1:0;
                    var group = $(this).inputGroup();
                    var amount = group.filter(":checked").not($(this)).length;
                    
                    if((checked + amount) < required)
                    r = false;
                }
                
                else if(!$(this).inputValue(true).length)
                r = false;
            }
            
            return r;
        });
    }
    
    return r;
}


// pattern
// validate un élément de formulaire, uniquemment avec pattern
// les input disabled ne sont pas considéré
quid.main.pattern = $.fn.pattern = function() 
{
    var r = false;
    
    if($(this).length)
    {
        r = true;
        
        $(this).each(function(index) {
            var disabled = $(this).prop('disabled');
            var pattern = $(this).data("pattern");
            var val = $(this).inputValue(true);
            
            if(!disabled && quid.base.isStringNotEmpty(pattern) && val.length)
            {
                pattern = new RegExp(pattern);
                r = pattern.test(val);
            }
            
            return r;
        });
    }
    
    return r;
}


// fieldValidate
// gère les événements relatifs à la validation d'un champ
quid.main.fieldValidate = $.fn.fieldValidate = function() 
{
    $(this).on('change', function() {
        $(this).trigger($(this).inputValue(true)? 'validate:trigger':'validate:pattern validate:empty');
    })
    .on('focus', function() {
        $(this).trigger("validate:valid");
    })
    .on('focusout', function() {
        $(this).trigger($(this).inputValue(true)? 'validate:trigger':'validate:pattern');
    })
    .on('validate:isValid',function() {
        return ($(this).data('invalid') === true)? false:true;
    })
    .on('validate:isNotEmptyAndValid',function() {
        return ($(this).inputValue(true) && $(this).validate() === true)? true:false;
    })
    .on('validate:required', function() {
        $(this).trigger(($(this).required() === true)? 'validate:valid':'validate:invalid');
    })
    .on('validate:pattern', function() {
        $(this).trigger(($(this).pattern() === true)? 'validate:valid':'validate:invalid');
    })
    .on('validate:trigger', function() {
        $(this).trigger(($(this).validate() === true)? 'validate:valid':'validate:invalid');
        
        if(!$(this).inputValue(true))
        $(this).trigger('validate:empty');
    })
    .on('validate:valid', function() {
        if($(this).is("[type='checkbox'],[type='radio']"))
        $(this).inputGroup().not($(this)).removeData('invalid');
        
        $(this).removeData('invalid');
    })
    .on('validate:invalid', function() {
        $(this).data('invalid',true);
    })
    
    return this;
}


// fieldValidateFull
// gère les événements relatifs à la validation d'un champ, y compris l'ajout des classes
quid.main.fieldValidateFull = $.fn.fieldValidateFull = function() 
{
    $(this).fieldValidate().on('validate:invalid', function() {
        $(this).addClass('invalid');
    })
    .on('validate:valid', function() {
        if($(this).is("[type='checkbox'],[type='radio']"))
        $(this).inputGroup().not($(this)).removeClass('invalid');
        
        $(this).removeClass('invalid');
    });
    
    return this;
}


// validatePrevent
// valide l'élément ou tous les éléments contenus dans le formulaire lors d'un événement
// bloque l'événement si la validation échoue
quid.main.validatePrevent = $.fn.validatePrevent = function(type,fields) 
{
    $(this).on(type, function(event) {
        if(!(fields instanceof jQuery))
        {
            var pattern = "[data-required],[data-pattern]";
            if($(this).is(pattern))
            fields = $(this);
            else
            fields = $(this).find(pattern);
        }

        if(fields.length)
        {
            var validate = fields.validate();
            fields.trigger("validate:trigger");
            
            if(validate !== true)
            {
                event.stopImmediatePropagation();
                event.preventDefault();
                $(this).trigger('validate:failed',[event]);
                return false;
            }
            
            else
            $(this).trigger('validate:success',[event]);
        }
    });
    
    return this;
}