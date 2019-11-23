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
        var tableRelation = node.find("[data-table-relation='1'] .specific-component");
        var tinymce = node.find("[data-group='tinymce'] .specific-component");
        var anchorCorner = node.find("[data-anchor-corner]");
        
        // date
        date.callThis(quid.core.calendarInput);
        
        // enumSet
        enumSet.callThis(quid.core.enumSetFull);
        
        // checkboxSortable
        checkboxSortable.verticalSorting(".choice",'.choice-in');
        
        // files
        files.callThis(quid.cms.inputFiles).trigger('component:setup');
        
        // addRemove
        addRemove.callThis(quid.core.addRemove);
        
        // tableRelation
        tableRelation.callThis(quid.cms.tableRelation).trigger('tableRelation:bind');
        
        // tinycme
        tinymce.callThis(quid.cms.tinymceWithTableRelation).trigger('component:setup');
        
        // anchorCorner
        anchorCorner.trigger('anchorCorner:refresh');
    })
    
    // specificForm unmount
    // permet démonter les champs du formulaire
    $(this).on('specificForm:unmount', function(event,node) {
        var tinymce = node.find("[data-group='tinymce'] .specific-component");
        tinymce.trigger('component:teardown');
    })
    
	// specific
    // comportement communs pour les pages spécifiques
	.on('group:specific', function(event,routeWrap) {
        var form = routeWrap.find("main .inner > form.specific-form");
        var panel = form.find("> .form-inner > .panel");
        
		// submitConfirm
		var submitConfirm = form.find("button[type='submit'][data-confirm]");
		submitConfirm.confirm('click');
		
		// block
		form.block('submit').on('submit', function() {
			$(this).trigger('block');
		});
        
        // champs simples
        $(this).trigger('specificForm:bindMount',[form]);
        
        // avec panel
        if(panel.length > 1)
        form.callThis(quid.cms.specificPanel);
        
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
            return $(this).find("> .right :input").filter("[name]").not("[name^='-']");
        })
        .on('specificMulti:refresh', function(event) {
            var isActive = $(this).triggerHandler('specificMulti:isActive');
            var inputs = $(this).triggerHandler('specificMulti:getInputs');
            $(this).attr('data-disabled',(isActive === true)? 0:1);
            inputs.prop('disabled',(isActive === true)? false:true);
        })
        .on('specificMulti:prepare', function(event) {
            var $this = $(this);
            var checkbox = $(this).triggerHandler('specificMulti:getCheckbox');
            checkbox.on('change', function(event) {
                $this.trigger('specificMulti:refresh');
            });
            $(this).trigger('specificMulti:refresh');
        })
        .trigger('specificMulti:prepare');
        
        form.trigger('form:prepare');
	});
});