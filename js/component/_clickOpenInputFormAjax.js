/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenInputFormAjax
// gère un formulaire à un champ qui s'envoie via ajax et dont le résultat s'affiche dans un clickOpen
Component.clickOpenInputFormAjax = function(target)
{
    Component.clickOpenAjax.call(this,'submit',false,target);
    
    $(this).on('ajax:complete',function(event) {
        const field = triggerFunc(this,'form:getValidateField');
        field.trigger('keyup:clearTimeout');
    })
    .on('clickOpenform:setup',function(event) {
        const form = $(this);
        const field = triggerFunc(this,'form:getValidateField');
        const submit = triggerFunc(this,'form:getSubmit');
        
        Component.keyboardEnter.call(field,true,'keyup');
        Component.keyboardEscape.call(field,true,'keyup');
        Component.Timeout.call(this,'keyup');
        
        field.on('validate:invalid',function(event) {
            form.trigger('clickOpen:close');
        })
        .on('validate:empty',function(event) {
            form.triggerHandler('inputForm:empty');
        })
        .on('validate:notEmpty',function(event) {
            form.triggerHandler('inputForm:notEmpty');
        })
        .on('click',function(event) {
            event.stopPropagation();
            form.trigger('clickOpen:closeOthers');
            
            if(triggerFunc(this,'validate:isEmpty'))
            form.triggerHandler('inputForm:empty');
            
            else if(triggerFunc(this,'validate:isNotEmptyAndValid') && !form.triggerHandler('clickOpen:isOpen'))
            form.trigger('submit');
        })
        .on('keyup:onTimeout',function() {
            triggerCustom(this,'validate:trigger');
            
            if(!$(this).val())
            triggerCustom(this,'validate:valid');
            
            else if($(this).is(":focus"))
            form.trigger('submit');
        })
        .on('escape:blocked',function(event) {
            form.trigger('clickOpen:close');
        });
        
        submit.on('click',function(event) {
            event.stopPropagation();
        });
    })
    .trigger('clickOpenform:setup');
    
    return this;
}