"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specific
// script of behaviours for the specific form page of the CMS
$(document).ready(function() {
	
    // formPrepare
    // permet de faire tous les bindings des champs (simples et complexes)
    $(this).on('specific:formPrepare', function(event,parent) {
        $(this).trigger('specific:formPrepareSimple',[parent]);
        $(this).trigger('specific:formPrepareViewable',[parent]);
    })
    
    // formPrepareSimple
    // permet de faire les bindings des champs simples
    // ces champs sont bindés dès que le formulaire s'affiche
    .on('specific:formPrepareSimple', function(event,parent) { })
    
    // formPrepareViewable
    // permet de faire les bindings de champs
    // ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
    .on('specific:formPrepareViewable', function(event,parent) {
        var date = parent.find("[data-group='date'] .specific-component");
        var enumSet = parent.find("[data-tag='search'] .specific-component");
        var checkboxSortable = parent.find("[data-group='relation'][data-sortable='1'] .specific-component");
        var files = parent.find("[data-group='media'] .specific-component");
        var addRemove = parent.find("[data-tag='add-remove'] .specific-component");
        var tableRelation = parent.find("[data-table-relation='1'] .specific-component");
        var tinymce = parent.find("[data-group='tinymce'] .specific-component");
        var anchorCorner = parent.find("[data-anchor-corner]");
        
        // date
        date.callThis(quid.core.calendarInput);
        
        // enumSet
        enumSet.callThis(quid.core.enumSetFull);
        
        // checkboxSortable
        checkboxSortable.verticalSorting(".choice",'.choice-in');
        
        // files
        files.callThis(quid.cms.inputFiles);
        
        // addRemove
        addRemove.callThis(quid.core.addRemove);
        
        // tableRelation
        tableRelation.callThis(quid.cms.tableRelation).trigger('tableRelation:bind');
        
        // tinycme
        tinymce.callThis(quid.cms.tinymceWithTableRelation);
        
        // anchorCorner
        anchorCorner.trigger('anchorCorner:refresh');
    })
    
	// specific
    // comportement pour la page de modification spécifique
	.on('route:specific', function() {
		$(this).trigger('route:specificCommon');
		$(this).trigger('route:specificTrigger');
	})
	
	// specificAdd
    // comportement pour la page d'ajout spécifique
	.on('route:specificAdd', function(event) {
		$(this).trigger('route:specificCommon');
		$(this).trigger('route:specificTrigger');
	})
	
    // specificMulti
    // comportement pour la page de modification multiple
	.on('route:specificMulti', function(event) {
		$(this).trigger('route:specificCommon');
		$(this).trigger('route:specificTrigger');
        
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
	})
    
	// specificCommon
    // comportements communs pour toutes les pages spécifiques
	.on('route:specificCommon', function(event) {
		var form = $(this).find("main .inner > form.specific-form");
        
		// submitConfirm
		var submitConfirm = form.find("button[type='submit'][data-confirm]");
		submitConfirm.confirm('click');
		
		// block
		form.block('submit').on('submit', function() {
			$(this).trigger('block');
		});
	})
	
	// specificTrigger
    // comportements communs pour la préparation des différents inputs du formulaire
	.on('route:specificTrigger', function(event) {
		var form = $(this).find("main .inner > .specific-form");
		var panel = form.find("> .form-inner > .panel");
        
        // champs simples
        $(this).trigger('specific:formPrepareSimple',[form]);
        
		// avec panel
		if(panel.length > 1)
		form.callThis(quid.cms.specificPanel);
		
		else
		$(this).trigger('specific:formPrepareViewable',[form]);
	})
	
	// route:specificCommon:panel
    // comportements communs pour la préparation des panneaux du formulaire
	.on('route:specificCommon:panel', function(event,form,panel,panelNav,panelDescription) {
		
	});
});