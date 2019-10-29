"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// form
// script with behaviours related to forms

// form
// gère un formulaire, ajoute quelques custom events
// permet la validation et l'ajout de l'attribut chargement au document
quid.main.form = $.fn.form = function(validate)
{
    $(this).each(function(index, el) {
        
        $(this).on('form:getFields', function(event) {
            return $(this).find(":input");
        })
        .on('form:getValidateFields', function(event) {
            return $(this).find("[data-required],[data-pattern]");
        })
        .on('form:getTargetFields', function(event) {
			return $(this).triggerHandler('form:getFields').not("[name^='-']");
		})
        .on('form:hasFiles', function(event) {
            return ($(this).triggerHandler('form:getFields').filter("input[type='file']").length)? true:false;
        })
        .on('form:getSubmits', function(event) {
            return $(this).triggerHandler('form:getFields').filter("[type='submit'],[type='image']");
        })
        .on('form:getClickedSubmit', function(event) {
            return $(this).triggerHandler('form:getSubmits').filter("[data-submit-click]").first();
        })
        .on('form:hasChanged', function(event) {
            var r = false;
            var target = $(this).triggerHandler('form:getTargetFields') || $(this);
            var serialize = target.serialize();
            var original = $(this).data('form:serialize');
            
            if(serialize !== original)
            r = true;
            
            return r;
        })
        .on('form:preparehasChanged', function(event) {
            var target = $(this).triggerHandler('form:getTargetFields') || $(this);
            var serialize = target.serialize();
            $(this).data('form:serialize',serialize);
        })
        .trigger('form:preparehasChanged');
        
        // click sur submit, met un attribut data-clicked
        var submits = $(this).triggerHandler('form:getSubmits');
        submits.on('click', function(event) {
            submits.removeAttr('data-submit-click');
            $(this).attr('data-submit-click',true);
        });
        
        // validation
        if(!$(this).is("[data-validation='0']"))
        {
            var fields = $(this).triggerHandler('form:getValidateFields');
            fields.fieldValidateFull();
            $(this).validatePrevent('submit',fields);
        }
    });
    
    return this;
}


// formUnload
// permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
quid.main.formUnload = $.fn.formUnload = function()
{
    var $this = $(this);
    $(this).on('submit', function(event) {
        $(window).off('beforeunload');
    });;
    
    $(window).off('beforeunload').on('beforeunload', function() {
        if($this.triggerHandler('form:hasChanged'))
        return $this.data('unload');
    });
    
    return this;
}