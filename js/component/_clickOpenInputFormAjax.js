/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenInputFormAjax
// gère un formulaire à un champ qui s'envoie via ajax et dont le résultat s'affiche dans un clickOpen
Quid.Component.clickOpenInputFormAjax = function(target)
{
    Quid.Component.clickOpenAjax.call(this,'submit',false,target);
    
    $(this).on('ajax:complete', function(event) {
        var field = $(this).triggerHandler('form:getValidateField');
        field.trigger('keyup:clearTimeout');
    })
    .on('clickOpenform:setup', function(event) {
        var form = $(this);
        var field = $(this).triggerHandler('form:getValidateField');
        var submit = $(this).triggerHandler('form:getSubmit');
        
        Quid.Component.keyboardEnter.call(field,true,'keyup');
        Quid.Component.keyboardEscape.call(field,true,'keyup');
        Quid.Component.timeout.call(this,'keyup');
        
        field.on('validate:invalid', function(event) {
            form.trigger('clickOpen:close');
        })
        .on('validate:empty', function(event) {
            form.triggerHandler('inputForm:empty');
        })
        .on('validate:notEmpty', function(event) {
            form.triggerHandler('inputForm:notEmpty');
        })
        .on('click', function(event) {
            event.stopPropagation();
            form.trigger('clickOpen:closeOthers');
            
            if($(this).triggerHandler('validate:isEmpty'))
            form.triggerHandler('inputForm:empty');
            
            else if($(this).triggerHandler('validate:isNotEmptyAndValid') && !form.triggerHandler('clickOpen:isOpen'))
            form.trigger('submit');
        })
        .on('keyup:onTimeout', function() {
            $(this).trigger('validate:trigger');
            
            if(!$(this).val())
            $(this).trigger('validate:valid');
            
            else if($(this).is(":focus"))
            form.trigger('submit');
        })
        .on('escape:blocked', function(event) {
            form.trigger('clickOpen:close');
        });
        
        submit.on('click', function(event) {
            event.stopPropagation();
        });
    })
    .trigger('clickOpenform:setup');
    
    return this;
}