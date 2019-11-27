"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// init
// script of common behaviours for all pages of the CMS

// ready
$(document).ready(function() {
	
    // initial mount
    // comportements bindés une seule fois au tout début
    $(this).on('document:mountInitial', function(event,body) {
        var modal = body.find("> .modal").first();
        
        // modal
        quid.component.modal.call(modal).trigger('component:setup');
    })
    
    // document:mountCommon
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    .on('document:mountCommon', function(event,node) {
        
        // input
        var input = node.find(":inputReal");
        quid.core.input.call(input);
        
        // select
        var select = node.find("select");
        quid.component.fakeSelect.call(select).trigger('component:setup');
        
        // form
        var form = node.find("form");
        quid.core.form.call(form).trigger('form:setup');
        
        // autre
        var popupTrigger = node.find(".popup-trigger.with-popup:not(.with-ajax)");
        var popupTriggerAjax = node.find(".popup-trigger.with-popup.with-ajax");
        var anchorCorner = node.find("[data-anchor-corner='1']");
        var absolutePlaceholder = node.find("[data-absolute-placeholder='1']");
        var aConfirm = node.find("a[data-confirm]");
        
		// aConfirm
		quid.main.window.confirm.call(aConfirm,'click');
		
        // popupTrigger
        quid.core.clickOpenWithTrigger.call(popupTrigger,".popup-title");
        
        // popupTriggerAjax
        quid.core.clickOpenAnchorAjax.call(popupTriggerAjax,".popup-title");
        
        // anchorCorner
        quid.component.anchorCorner.call(anchorCorner);
        
        // absolutePlaceholder
        quid.component.absolutePlaceholder.call(absolutePlaceholder);
	})
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	.on('document:mount', function(event,routeWrap) {
		var html = $(this).triggerHandler('document:getHtml');
		var burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
		var com = routeWrap.find("main > .inner > .com");
        var subMenu = routeWrap.find(".with-submenu");
        var carousel = routeWrap.find(".with-carousel");
        var mainSearch = routeWrap.find("header .top form");
        
        // carousel
        quid.core.carousel.call(carousel);
        
        // subMenu
        quid.core.clickOpenWithTrigger.call(subMenu,".trigger");
        subMenu.on('clickOpen:getBackgroundFrom', function(event) {
            return 'submenu';
        });
        
        // com
		quid.component.com.call(com).trigger('component:setup');
        
        // burger
        quid.component.burger.call(burger).trigger('component:setup');

        // mainSearch
        quid.component.mainSearch.call(mainSearch).trigger('component:setup');
	})
    
    // document unmount
    .on('document:unmount', function(event,routeWrap) {
        var burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
        
        // burger
        burger.trigger('component:teardown');
    })
    
    // document ajax progress
    .on('document:ajaxProgress', function(event,percent,progressEvent) {
        var body = $(this).find("body");
        var progress = body.find(".loading-progress");
        var html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
        progress.html(html);
    })
    
    // login
    // comportement pour la page login
	.on('route:login', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	})
	
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	.on('route:resetPassword', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	})
	
	// register
    // comportement pour la page enregistrement
	.on('route:register', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	})
	
    // changePassword
    // comportement pour le popup changer mon mot de passe
	.on('modal:accountChangePassword', function(event,modal) {
		var form = modal.find("form");
        var fields = form.triggerHandler("form:getValidateFields");
		quid.main.input.focusFirst.call(fields);
	})
    
    // home
    // comportement pour la page d'accueil du CMS une fois connecté
	.on('route:home', function(event,routeWrap) {
		var feed = routeWrap.find("main .home-feed");
        var feedTogglers = feed.find(".block-head .feed-togglers > a");
        var feedBody = feed.find(".block-body");
        quid.core.appendContainer.call(feedBody).trigger('feed:bind');
        
        quid.main.ajax.block.call(feedTogglers);
        feedTogglers.on('ajaxBlock:getStatusNode', function(event) {
            return feedBody;
        })
        .on('ajax:before', function(event) {
            feedTogglers.removeClass('selected');
            $(this).addClass('selected');
        })
        .on('ajax:success', function(event,data,textStatus,jqXHR) {
            feedBody.trigger('feed:overwrite',[data]);
        })
        .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
            feedBody.html(parsedError);
        });
	})
    
    // general
    // comportement pour la page de navigation
	.on('route:general', function(event,routeWrap) {
		
        var main = routeWrap.find("main");
        var scroller = main.find(".scroller");
		var search = main.find(".left > .search");
        var formTruncate = main.find(".truncate form");
		var pageLimit = main.find("input[name='limit'],input[name='page']");
        var table = scroller.find("table").first();
        var filter = table.find("th.filterable .filter-outer");
		var colsSorter = table.find("th.action");
		var filesSlider = table.find("td[data-group='media'] .slider");
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        var highlight = table.find("tr.highlight");
        
        // dragScroll
        quid.component.scrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}).trigger('component:setup');
        
        // page + limit
        quid.component.inputNumeric.call(pageLimit);
		
        // rowsChecker
        quid.component.rowsChecker.call(main).trigger('component:setup');
        
		// colsSorter
		quid.component.colsSorter.call(colsSorter).trigger('component:setup');
		
        // filter
		quid.core.filterGeneralFull.call(filter).trigger('component:setup');
        
		// search
		if(search.length)
		{
			var searchInput = search.find(".form input[type='text']");
			var searchSlide = search.find(".in");
			quid.component.inputSearch.call(searchInput).trigger('component:setup');
            quid.main.input.focusSlide.call(searchInput,searchSlide);
		}
		
		// formTruncate
		if(formTruncate.length)
		{
            quid.main.event.block.call(formTruncate,'submit');
            quid.main.window.confirm.call(formTruncate,'submit');
			formTruncate.on('confirmed', function() {
				$(this).trigger('block');
			});
		}
        
        // filesSlider
        quid.core.slider.call(filesSlider,null,null,'.slider-element',false);
        
        // quickEdit
        quid.component.quickEdit.call(quickEdit).trigger('component:setup');
        
        // highlight 
        highlight.on('mouseover', function(event) {
            $(this).removeClass('highlight');
        });
	})
    
    // unmount
    .on('route:general:unmount', function(event,routeWrap) {
        var table = routeWrap.find("main .scroller table").first();
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        
        // quickEdit
        quickEdit.trigger('quickEdit:revert');
    })
    
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
        quid.component.calendarInput.call(date).trigger('component:setup');
        
        // enumSet
        quid.core.enumSetFull.call(enumSet);
        
        // checkboxSortable
        quid.core.verticalSorter.call(checkboxSortable,".choice",'.choice-in');
        
        // files
        quid.component.inputFiles.call(files).trigger('component:setup');
        
        // addRemove
        quid.component.addRemove.call(addRemove).trigger('component:setup');
        
        // textarea
        quid.component.textareaExtra.call(textarea).trigger('component:setup');
        
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
        quid.component.specificPanel.call(form);
        
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
            inputs.trigger((isActive === true)? 'input:enable':'input:disable');
        })
        .one('specificMulti:setup', function(event) {
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
    
    // nobodyCommon
    var nobodyCommon = function() {
        var browscap = $(this).find("main .browscap");
		var form = $(this).find("main form");
        var fields = form.triggerHandler("form:getValidateFields");
        
		quid.main.input.focusFirst.call(fields);
		
		if(!quid.base.browser.allowsCookie())
		browscap.find(".cookie-disabled").show();
        
        if(quid.base.browser.isUnsupported())
		browscap.find(".unsupported-browser").show();
    };
    
    // react
    quid.core.react.document.call(this);
});