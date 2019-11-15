"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validate
// script with behaviours related to form and field validation
quid.main.validate = new function() {
    
    // trigger
    // validate un élément de formulaire
    // utilise required et pattern
    this.trigger = $.fn.validate = function() 
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
    this.required = $.fn.required = function() 
    {
        var r = false;
        
        if($(this).length)
        {
            r = true;
            
            $(this).each(function(index) {
                var name = $(this).prop('name');
                var disabled = $(this).prop('disabled');
                var required = $(this).attr("data-required");
                
                if(!disabled && quid.base.number.is(required) && required > 0)
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
    this.pattern = $.fn.pattern = function() 
    {
        var r = false;
        
        if($(this).length)
        {
            r = true;
            
            $(this).each(function(index) {
                var disabled = $(this).prop('disabled');
                var pattern = $(this).attr("data-pattern");
                var val = $(this).inputValue(true);
                
                if(!disabled && quid.base.str.isNotEmpty(pattern) && val.length)
                {
                    pattern = new RegExp(pattern);
                    r = pattern.test(val);
                }
                
                return r;
            });
        }
        
        return r;
    }


    // field
    // gère les événements relatifs à la validation d'un champ
    this.field = $.fn.fieldValidate = function() 
    {
        $(this).on('change', function(event) {
            $(this).trigger('validate:process');
        })
        .on('focus', function(event) {
            $(this).trigger("validate:valid");
        })
        .on('focusout', function(event) {
            $(this).trigger('validate:process');
        })
        .on('validate:process', function(event) {
            $(this).trigger($(this).inputValue(true)? 'validate:trigger':'validate:pattern validate:empty');
        })
        .on('validate:binded', function(event) {
            return true;
        })
        .on('validate:isEmpty',function(event) {
            return (!$(this).inputValue(true))? true:false;
        })
        .on('validate:isValid',function(event) {
            return ($(this).validate() === true)? true:false;
        })
        .on('validate:isNotEmptyAndValid',function(event) {
            return (!$(this).triggerHandler('validate:isEmpty') && $(this).triggerHandler('validate:isValid'))? true:false;
        })
        .on('validate:required', function(event) {
            event.stopPropagation();
            $(this).trigger(($(this).required() === true)? 'validate:valid':'validate:invalid');
        })
        .on('validate:pattern', function(event) {
            event.stopPropagation();
            $(this).trigger(($(this).pattern() === true)? 'validate:valid':'validate:invalid');
        })
        .on('validate:trigger', function(event) {
            var r = $(this).validate();
            event.stopPropagation();
            $(this).trigger((r === true)? 'validate:valid':'validate:invalid');
            $(this).trigger(($(this).inputValue(true))? 'validate:notEmpty':'validate:empty');
            
            return r;
        })
        .on('validate:valid', function(event) {
            if($(this).is("[type='checkbox'],[type='radio']"))
            $(this).inputGroup().not($(this)).attr('data-validate','valid');

            $(this).attr('data-validate','valid');
        })
        .on('validate:invalid', function(event) {
            $(this).attr('data-validate','invalid');
        });
        
        return this;
    }


    // prevent
    // valide l'élément ou tous les éléments contenus dans le formulaire lors d'un événement
    // bloque l'événement si la validation échoue
    this.prevent = $.fn.validatePrevent = function(type) 
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
            
            $(this).triggerHandler('validatePrevent:getFields').each(function(index, el) {
                var val = $(this).triggerHandler("validate:trigger");
                
                if(val === false)
                r = val;
            });
            
            return r;
        })
        .on('validatePrevent:getFields', function(event) {
            var r = $(this).find(":input").not("[name^='-']").filter("[data-required],[data-pattern]");
            
            r.each(function(index, el) {
                if(!$(this).triggerHandler('validate:binded'))
                $(this).fieldValidate();
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
}