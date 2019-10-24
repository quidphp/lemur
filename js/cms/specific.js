"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specific
// script of behaviours for the specific form page of the CMS
$(document).ready(function() {
	
	// specific
    // comportement pour la page de modification spécifique
	$(this).on('route:specific', function() {
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
		form.on('form:getTarget', function(event) {
			return $(this).find("input, select, textarea").not("[name^='-']");
		}).formUnload();
		
		// block
		form.block('submit').on('submit', function() {
			$(this).trigger('block');
		});
		
		// fields
		fields.fieldValidateFull();
		
		// preparable
		formWrapper.on('form:getPreparable', function(event) {
			var r = null;
			
			if(panel.length > 1)
			r = panel;
			
			else
			r = $(this);
			
			return r;
		});
		
		// prepare
        var preparable = formWrapper.triggerHandler('form:getPreparable');
		$(this).trigger('route:specificPrepare',[preparable]);
	})
	
    // specificPrepare
    // permet de faire des binding sur ouverture d'un preparable de form (un panel)
    .on('route:specificPrepare', function(event,preparable) {
		preparable.on('specificForm:prepare', function(event) {
            $(this).find("[data-group='tinymce']").tinymceWithTableRelation();
        });
    })
    
	// specificTrigger
    // comportements communs pour la préparation des différents inputs du formulaire
	.on('route:specificTrigger', function(event) {
		var formWrapper = $("main .container > .form");
		var form = formWrapper.find("form");
		var panel = $("main .form .inside .panel");
		var date = form.find("[data-group='date'] .right");
		var mediaAction = form.find("[data-group='media'] .block .action");
		var mediaCancelAction = form.find("[data-group='media'] .block .message .close");
		var addRemove = form.find("[data-tag='add-remove']");
		var tableRelation = $(this).find("[data-table-relation='1']");
        var enumSet = form.find("[data-tag='search'] .search-enumset");
		var checkboxSortable = form.find("[data-group='relation'][data-sortable='1']");
        
		// avec panel
		if(panel.length > 1)
		$(this).trigger('route:specificCommon:panel',[formWrapper,panel])
		
		else
		formWrapper.trigger('specificForm:prepare');
		
		// date
		if(date.length)
		date.calendarInput();
		
		// enumSet
		if(enumSet.length)
		enumSet.enumSetFull();
		
		// mediaAction
		if(mediaAction.length)
		{
			mediaAction.confirm('click').on('confirmed', function(event) {
				var parent = $(this).parents(".block");
				var input = parent.find("input[type='file']");
				var name = input.attr('name');
				var hidden = parent.find("input[type='hidden'][name='"+name+"']");
				var actionText = parent.find(".actionText");
				var value = JSON.parse(hidden.val());
				value.action = $(this).data('action');
				parent.addClass('with-action');
				input.hide();
				hidden.prop('disabled',false);
				hidden.val(JSON.stringify(value));
				actionText.html($(this).data('text'));
			})
		}
		
		// mediaCancelAction
		if(mediaCancelAction.length)
		{
			mediaCancelAction.on('click', function(event) {
				var parent = $(this).parents(".block");
				var input = parent.find("input[type='file']");
				var name = input.attr('name');
				var hidden = parent.find("input[type='hidden'][name='"+name+"']");
				var actionText = parent.find(".actionText");
				var value = JSON.parse(hidden.val());
				value.action = null;
				parent.removeClass('with-action');
				input.show();
				hidden.prop('disabled',true);
				hidden.val(JSON.stringify(value));
				actionText.html('');
			});
		}
		
		// tableRelation
		if(tableRelation.length)
		tableRelation.tableRelation();
		
		// addRemove
		if(addRemove.length)
		addRemove.addRemove();
		
		// checkboxSortable
		if(checkboxSortable.length)
		checkboxSortable.verticalSorting(".choice",'.choice-in');
	})
	
	// route:specificCommon:panel
    // comportements communs pour la préparation des panneaux du formulaire
	.on('route:specificCommon:panel', function(event,form,panel) {
		var panelNav = $("main .form .top .left ul li a");
		var panelDescription = $("main .form .top .left .description");
		
		// panel
		panel.tabNav(panelNav).fragment().on('tab:init', function(event) {
			$(this).trigger('specificForm:prepare');
		})
		.on('tab:open', function() {
			var nav = $(this).triggerHandler('link:getNav');
			var description = nav.data('description') || '';
			var fragment = $(this).triggerHandler('fragment:get');
			var isFirst = (form.triggerHandler('tab:getIndex',[$(this)]) === 0)? true:false;
			var current = $.fragment();
			
			panelNav.removeClass('selected');
			nav.addClass('selected');
			
			if(panelDescription.length)
			panelDescription.text(description);
			
			$(this).show();
			
			if(isFirst === false || $.isStringNotEmpty(current))
			$(this).trigger('fragment:update');
			
			$("a.hashFollow").hrefChangeHash(fragment);
			form.triggerHandler('tab:getInput').val(($.isStringNotEmpty(fragment))? fragment:'');
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
			return ($.isStringNotEmpty(fragment))? panel.filter("[data-fragment='"+fragment+"']"):panel.first();
		})
		.on('tab:init', function(event) {
			var target = $(this).triggerHandler('tab:findHash',[$.fragment()]);
			$(this).trigger('tab:changeOrFirst',[target]);
		})
		.on('hash:change', function(event,fragment) {
			var target = $(this).triggerHandler('tab:findHash',[fragment]);
			
			if(target.length === 1 && !$(this).triggerHandler('tab:isCurrent',[target]))
			target.trigger('tab:change');
		})
		.tab().trigger('tab:closeAll').trigger('tab:init');
	});
});