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
	
    // initial mount
    // comportements bindés une seule fois
    $(this).on('document:initialMount', function(event,body) {
        var modal = body.find("> .modal").first();
        
        // modal
        quid.core.modal.call(modal).trigger('modal:setup');
    })
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	$(this).on('document:mount', function(event,routeWrap) {
		var html = $(this).triggerHandler('document:getHtml');
		var burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
		var com = routeWrap.find("main > .inner > .com");
        var subMenu = routeWrap.find(".with-submenu");
        var carousel = routeWrap.find(".with-carousel");
        var mainSearch = routeWrap.find("header .top form");
        
        // carousel
        quid.core.carousel.call(carousel,".trigger");
        
        // subMenu
        quid.core.clickOpenWithTrigger.call(subMenu,".trigger");
        subMenu.on('clickOpen:getBackgroundFrom', function(event) {
            return 'submenu';
        });
        
        // com
		quid.cms.com.call(com).trigger('component:setup');
        
        // burger
        quid.core.burger.call(burger);

        // mainSearch
        quid.cms.mainSearch.call(mainSearch);
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
    .on('document:commonBindings', function(event,node) {
        var modal = $(this).find("body > .modal").first();
        var popupTrigger = node.find(".popup-trigger.with-popup:not(.with-ajax)");
        var popupTriggerAjax = node.find(".popup-trigger.with-popup.with-ajax");
		var modalAnchor = node.find("a[data-modal]");
		var anchorCorner = node.find("[data-anchor-corner='1']");
        var absolutePlaceholder = node.find("[data-absolute-placeholder='1']");
		var aConfirm = node.find("a[data-confirm]");
        var select = node.find("select");
        
        // modalAnchor
        quid.core.modalAjax.call(modalAnchor,modal);
                
		// aConfirm
		quid.main.window.confirm.call(aConfirm,'click');
		
        // popupTrigger
        quid.core.clickOpenWithTrigger.call(popupTrigger,".popup-title");
        
        // popupTriggerAjax
        quid.core.clickOpenAnchorAjax.call(popupTriggerAjax,".popup-title");
        
        // fakeselect
        quid.core.selectToFake.call(select);
        
        // anchorCorner
        quid.main.dimension.anchorCorner.call(anchorCorner);
        
        // absolutePlaceholder
        quid.main.dimension.absolutePlaceholder.call(absolutePlaceholder);
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