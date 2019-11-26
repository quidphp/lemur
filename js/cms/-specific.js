"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specific
// script of behaviours for the specific form page of the CMS
$(document).ready(function() {
	
    // specificForm mount
    // permet de faire tous les bindings des champs (simples et complexes)
    $(this).on('specificForm:mount', function(event,node) {
        $(this).trigger('specificForm:bindMount',[node]);
        $(this).trigger('specificForm:bindView',[node]);
    })
    
    // bindMount
    // permet de faire les bindings des champs
    // ces champs sont bindés dès que le formulaire s'affiche
    .on('specificForm:bindMount', function(event,node) { })
    
    // bindView
    // permet de faire les bindings de champs
    // ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
    .on('specificForm:bindView', function(event,node) {
        var date = node.find("[data-group='date'] .specific-component");
        var enumSet = node.find("[data-tag='search'] .specific-component");
        var checkboxSortable = node.find("[data-group='relation'][data-sortable='1'] .specific-component");
        var files = node.find("[data-group='media'] .specific-component");
        var addRemove = node.find("[data-tag='add-remove'] .specific-component");
        var textarea = node.find("[data-tag='textarea'] .specific-component");
        var anchorCorner = node.find("[data-anchor-corner]");
        
        // date
        quid.core.calendarInput.call(date);
        
        // enumSet
        quid.core.enumSetFull.call(enumSet);
        
        // checkboxSortable
        quid.core.verticalSorter.call(checkboxSortable,".choice",'.choice-in');
        
        // files
        quid.component.inputFiles.call(files).trigger('component:setup');
        
        // addRemove
        quid.component.addRemove.call(addRemove).trigger('component:setup');
        
        // textarea
        quid.component.textarea.call(textarea).trigger('component:setup');
        
        // anchorCorner
        anchorCorner.trigger('anchorCorner:refresh');
    })
    
    // specificForm unmount
    // permet démonter les champs du formulaire
    $(this).on('specificForm:unmount', function(event,node) {
        var textarea = node.find("[data-tag='textarea'] .specific-component");
        textarea.trigger('component:teardown');
    })
    
	// specific
    // comportement communs pour les pages spécifiques
	.on('group:specific', function(event,routeWrap) {
        var form = routeWrap.find("main .inner > form.specific-form");
        var panel = form.find("> .form-inner > .panel");
        var submitConfirm = form.find("button[type='submit'][data-confirm]");
        
		// submitConfirm
        quid.main.window.confirm.call(submitConfirm,'click');
		
        // champs simples
        $(this).trigger('specificForm:bindMount',[form]);
        
        // avec panel
        if(panel.length > 1)
        quid.cms.specificPanel.call(form);
        
        else
        $(this).trigger('specificForm:bindView',[form]);
	})
	
    // unmount
    // comportements communs pour démonter la page spécifique
    .on('group:specific:unmount', function(event,routeWrap) {
        var form = routeWrap.find("main .inner > form.specific-form");
        $(this).trigger('specificForm:unmount',[form]);
    })
    
    // specificMulti
    // comportement pour la page de modification multiple
	.on('route:specificMulti', function(event) {
        var form = $(this).find("main .inner > form.specific-form");
        var formElement = form.find(".form-element");
        
        formElement.on('specificMulti:isActive', function(event) {
            return $(this).triggerHandler('specificMulti:getCheckbox').is(':checked');
        })
        .on('specificMulti:getCheckbox',function(event) {
            return $(this).find(".disabler input[type='checkbox']");
        })
        .on('specificMulti:getInputs', function(event) {
            return $(this).find("> .right :inputReal");
        })
        .on('specificMulti:refresh', function(event) {
            var isActive = $(this).triggerHandler('specificMulti:isActive');
            var inputs = $(this).triggerHandler('specificMulti:getInputs');
            $(this).attr('data-disabled',(isActive === true)? 0:1);
            inputs.prop('disabled',(isActive === true)? false:true);
        })
        .on('specificMulti:setup', function(event) {
            var $this = $(this);
            var checkbox = $(this).triggerHandler('specificMulti:getCheckbox');
            checkbox.on('change', function(event) {
                $this.trigger('specificMulti:refresh');
            });
            $(this).trigger('specificMulti:refresh');
        })
        .trigger('specificMulti:setup');
        
        form.trigger('form:prepare');
	});
});