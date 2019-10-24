"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpenInputFormAjax
// script with a form with an input which on submit opens a clickOpen
(function ($, document, window) {
	
    // clickOpenInputFormAjax
	// gère un formulaire à un champ qui s'envoie via ajax et dont le résultat s'affiche dans un clickOpen
	$.fn.clickOpenInputFormAjax = function()
	{
        $(this).each(function(index, el) {
            
            $(this).formValidate().clickOpenAjax('submit')
            .on('form:getField', function(event) {
                return $(this).find("[data-required],[data-pattern]").first();
            })
            .on('form:getSubmit', function(event) {
                return $(this).find("[type='submit']");
            })
			.on('ajax:getData', function(event) {
				var r = {};
                var field = $(this).triggerHandler('form:getField');
				r[field.data('query')] = field.inputValue(true);
				return r;
			})
            .on('ajax:complete', function(event) {
                var field = $(this).triggerHandler('form:getField');
                field.trigger('keyup:clearTimeout');
            })
            .on('form:prepare', function(event) {
                var form = $(this);
                var field = $(this).triggerHandler('form:getField');
                var submit = $(this).triggerHandler('form:getSubmit');
                
                field.enterBlock('keyup').timeout('keyup')
                .on('validate:invalid validate:empty', function(event) {
                    form.trigger('clickOpen:close');
                })
    			.on('click', function(event) {
                    event.stopPropagation();
                    form.trigger('clickOpen:closeOthers');
                    if($(this).triggerHandler('validate:isNotEmptyAndValid') && !form.triggerHandler('clickOpen:isOpen'))
                    form.trigger('submit');
    			})
    			.on('keyup:onTimeout', function() {
                    $(this).trigger('validate:trigger');
                    
                    if(!$(this).val())
                    $(this).trigger('validate:valid');
                    
                    else if($(this).is(":focus"))
    				form.trigger('submit');
    			});
                
                submit.on('click', function(event) {
                    event.stopPropagation();
                });
            })
            .trigger('form:prepare');
        });
		
		return this;
	}
	
}(jQuery, document, window));