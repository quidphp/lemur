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
        
        // date
        date.calendarInput();
        
        // enumSet
        enumSet.enumSetFull();
        
        // checkboxSortable
        checkboxSortable.verticalSorting(".choice",'.choice-in');
        
        // files
        files.callThis(quid.cms.inputFiles);
        
        // addRemove
        addRemove.addRemove();
        
        // tableRelation
        tableRelation.callThis(quid.cms.tableRelation);
        
        // tinycme
        tinymce.callThis(quid.cms.tinymceWithTableRelation);
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
	
	// specificCommon
    // comportements communs pour toutes les pages spécifiques
	.on('route:specificCommon', function(event) {
		var formWrapper = $("main .container > .form");
		var panel = formWrapper.find(".panel");
		var form = formWrapper.find("form");
		var fields = form.find(".element input,.element textarea");
		
		// submitConfirm
		var submitConfirm = form.find("button[type='submit'][data-confirm]");
		submitConfirm.confirm('click');
		
		// unload
		form.formUnload();
		
		// block
		form.block('submit').on('submit', function() {
			$(this).trigger('block');
		});
		
		// fields
		fields.fieldValidateFull();
	})
	
	// specificTrigger
    // comportements communs pour la préparation des différents inputs du formulaire
	.on('route:specificTrigger', function(event) {
		var formWrapper = $("main .container > .form");
		var form = formWrapper.find("form");
		var panel = form.find(".panel");
		
        // champs simples
        $(this).trigger('specific:formPrepareSimple',[formWrapper]);
        
		// avec panel
		if(panel.length > 1)
		$(this).trigger('route:specificCommon:panel',[formWrapper,panel])
		
		else
		$(this).trigger('specific:formPrepareViewable',[formWrapper]);
	})
	
	// route:specificCommon:panel
    // comportements communs pour la préparation des panneaux du formulaire
	.on('route:specificCommon:panel', function(event,form,panel) {
		var panelNav = $("main .form .top .left ul li a");
		var panelDescription = $("main .form .top .left .description");
		
		// panel
		panel.tabNav(panelNav).fragment().on('tab:init', function(event) {
			$(this).trigger('specific:formPrepareViewable',[$(this)]);
		})
		.on('tab:open', function() {
			var nav = $(this).triggerHandler('link:getNav');
			var description = nav.data('description') || '';
			var fragment = $(this).triggerHandler('fragment:get');
			var current = quid.base.fragment();
			
			panelNav.removeClass('selected');
			nav.addClass('selected');
			
			if(panelDescription.length)
			panelDescription.text(description);
			
			$(this).show();
			
            if($(this).is("[data-current-panel='1']") === true && !current)
            {
                $(this).removeAttr('data-current-panel');
                $(this).trigger('fragment:update',[true]);
            }
            
			else if(quid.base.isStringNotEmpty(current))
			$(this).trigger('fragment:update');
			
			$("a.hashFollow").hrefChangeHash(fragment);
			form.triggerHandler('tab:getInput').val((quid.base.isStringNotEmpty(fragment))? fragment:'');
            
            $(document).trigger('document:outsideClick');
		})
		.on('tab:close', function() {
			panelNav.trigger('unselected');
			panel.hide();
		})
		.on('fragment:updated', function(event,fragment) {
			form.trigger('hash:change',[fragment]);
		});
		
		// form
		form.hashchange().on('tab:getTarget', function() {
			return panel;
		})
		.on('tab:getInput', function(event) {
			return $(this).find("input[name='-panel-']");
		})
		.on('tab:findHash', function(event,fragment) {
            var r = panel.filter("[data-current-panel='1']");
            
            if(quid.base.isStringNotEmpty(fragment))
            r = panel.filter("[data-fragment='"+fragment+"']");
            
            if(!r.length)
            r = panel.first();
            
			return r;
		})
		.on('hash:change', function(event,fragment) {
			var target = $(this).triggerHandler('tab:findHash',[fragment]);
			
			if(target.length === 1 && !$(this).triggerHandler('tab:isCurrent',[target]))
			target.trigger('tab:change');
		})
        .on('tab:showFirst', function(event) {
            var target = $(this).triggerHandler('tab:findHash',[quid.base.fragment()]);
            $(this).trigger('tab:changeOrFirst',[target]);
        })
		.tab().trigger('tab:closeAll').trigger('tab:showFirst');
	});
});