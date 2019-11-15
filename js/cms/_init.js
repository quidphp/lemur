"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// init
// script of common behaviours for all pages of the CMS

// globale 
quid.cms = {}; 

// ready
$(document).ready(function() {
	
	// window
    // peut forcer un changement de page, si la page est chargé de la cache
    // nécessaire pour les formulaire
	$(window).on("pageshow", function(event) {
		if(event.originalEvent.persisted)
	    window.location.href = window.location.href;
	});
	
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	$(this).on('document:mount', function(event) {
		var body = $(this).find("body");
		var modal = $(this).find(".modal");
		var burger = $(this).find("header .burger-menu, .nav-fixed .nav-close");
		var com = $(this).find("#wrapper .com");
        var subMenu = $(this).find(".with-submenu");
        var carousel = $(this).find(".with-carousel");
        var mainSearch = $(this).find("header .top form");
        
        // carousel
        carousel.callThis(quid.core.carousel,".trigger");
        
        // subMenu
        subMenu.callThis(quid.core.clickOpenWithTrigger,".trigger").on('clickOpen:getBackgroundFrom', function(event) {
            return 'submenu';
        });
        
		// modal
		modal.callThis(quid.core.modal);
		
        // com
		com.callThis(quid.cms.com);
        
        // burger
		burger.on('click', function(event) {
			body.toggleClass('responsive-menu-open');
		});

        // mainSearch
        mainSearch.callThis(quid.cms.mainSearch);
	})
    
    // document ajax progress
    .on('document:ajaxProgress', function(event,percent,progressEvent) {
        var body = $(this).find("body");
        var progress = body.find(".loading-progress");
        var html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
        progress.html(html);
    })
    
    // document:commonBindings
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    .on('document:commonBindings', function(event,parent) {
        var modal = $(this).find(".modal");
        var popupTrigger = parent.find(".popup-trigger.with-popup:not(.with-ajax)");
        var popupTriggerAjax = parent.find(".popup-trigger.with-popup.with-ajax");
		var modalAnchor = parent.find("a[data-modal]");
		var anchorCorner = parent.find("[data-anchor-corner='1']");
        var absolutePlaceholder = parent.find("[data-absolute-placeholder='1']");
		var aConfirm = parent.find("a[data-confirm]");
		var print = parent.find(".submit.print");
        var select = parent.find("select");
        
        // modalAnchor
        modalAnchor.callThis(quid.core.modalAjax,modal);
                
		// aConfirm
		aConfirm.callThis(quid.main.window.confirm,'click');
		
		// print
		print.on('click', function(event) {
			window.print();
		});

        // popupTrigger
        popupTrigger.callThis(quid.core.clickOpenWithTrigger,".popup-title");
        
        // popupTriggerAjax
        popupTriggerAjax.callThis(quid.core.clickOpenAnchorAjax,".popup-title");
        
        // fakeselect
        select.callThis(quid.core.selectToFake);
        
        // anchorCorner
        anchorCorner.callThis(quid.main.dimension.anchorCorner);
        
        // absolutePlaceholder
        absolutePlaceholder.callThis(quid.main.dimension.absolutePlaceholder);
	})
    
    // login
    // comportement pour la page login
	.on('route:login', function() {
		$(this).trigger('route:nobodyCommon');
	})
	
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	.on('route:resetPassword', function(event) {
		$(this).trigger('route:nobodyCommon');
	})
	
	// register
    // comportement pour la page enregistrement
	.on('route:register', function(event) {
		$(this).trigger('route:nobodyCommon');
	})
	
    // nobodyCommon
    // comportements commun pour toutes les pages ou l'utilisateur n'est pas connecté
	.on('route:nobodyCommon', function(event) {
		var browscap = $(this).find("main .browscap");
		var form = $(this).find("main form");

		form.triggerHandler("form:getValidateFields").focusFirst();
		
		if(!quid.base.browser.allowsCookie())
		browscap.find(".cookie-disabled").show();
        
        if(quid.base.browser.isUnsupported())
		browscap.find(".unsupported-browser").show();
	})
    
    // changePassword
    // comportement pour le popup changer mon mot de passe
	.on('modal:accountChangePassword', function(event,modal) {
		var form = modal.find("form");
		form.triggerHandler("form:getValidateFields").focusFirst();
	})
    
    // home
    // comportement pour la page d'accueil du CMS une fois connecté
	.on('route:home', function() {
		var feed = $(this).find("main .home-feed");
        var feedTogglers = feed.find(".block-head .feed-togglers > a");
        var feedBody = feed.find(".block-body");
        feedBody.callThis(quid.core.appendContainer);
        
        feedTogglers.ajaxBlock()
        .on('ajaxBlock:getStatusNode', function(event) {
            return feedBody;
        })
        .on('ajax:before', function(event) {
            feedTogglers.removeClass('selected');
            $(this).addClass('selected');
        })
        .on('ajax:success', function(event,data,textStatus,jqXHR) {
            feedBody.trigger('feed:overwrite',[data]);
        })
        .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
            feedBody.html(quid.main.ajax.parseError(jqXHR,textStatus));
        });
	})
    
    .react();
});