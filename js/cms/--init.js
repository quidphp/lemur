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
	
    // document:mountCommon
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    $(this).on('document:mountCommon', function(event,node) {
        
        // select
        var select = node.find("select");
        quid.core.selectToFake.call(select);
        
        // input
        var input = node.find(":inputReal");
        quid.main.input.bind.call(input);
        
        // form
        var form = node.find("form");
        quid.main.form.bind.call(form);
        
        // autre
        var modal = $(this).find("body > .modal").first();
        var popupTrigger = node.find(".popup-trigger.with-popup:not(.with-ajax)");
        var popupTriggerAjax = node.find(".popup-trigger.with-popup.with-ajax");
        var modalAnchor = node.find("a[data-modal]");
        var anchorCorner = node.find("[data-anchor-corner='1']");
        var absolutePlaceholder = node.find("[data-absolute-placeholder='1']");
        var aConfirm = node.find("a[data-confirm]");
        
        // modalAnchor
        quid.core.modalAjax.call(modalAnchor,modal);
                
		// aConfirm
		quid.main.window.confirm.call(aConfirm,'click');
		
        // popupTrigger
        quid.core.clickOpenWithTrigger.call(popupTrigger,".popup-title");
        
        // popupTriggerAjax
        quid.core.clickOpenAnchorAjax.call(popupTriggerAjax,".popup-title");
        
        // anchorCorner
        quid.core.anchorCorner.call(anchorCorner);
        
        // absolutePlaceholder
        quid.core.absolutePlaceholder.call(absolutePlaceholder);
	})
    
    // initial mount
    // comportements bindés une seule fois
    .on('document:mountInitial', function(event,body) {
        var modal = body.find("> .modal").first();
        
        // modal
        quid.core.modal.call(modal).trigger('modal:setup');
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
        if(com.length)
		$(quid.cms.com.call(com[0])).trigger('component:setup');
        
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