"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// cms
// script of common behaviours for all pages of the CMS
$(document).ready(function() {
	
	// window
    // peut forcer un changement de page, si la page est chargé de la cache
    // nécessaire pour les formulaire
	$(window).on("pageshow", function(event) {
		if(event.originalEvent.persisted)
	    window.location.href = window.location.href;
	});
	
	// route:common
    // comportements utilisés pour toutes les pages du CMS
	$(this).on('route:common', function(event) {
		var body = $(this).find("body");
		var modal = $(this).find(".modal");
        var popupTrigger = $(this).find(".popup-trigger");
		var modalAnchor = $(this).find("a[data-modal]");
		var anchorCorner = $(this).find(".anchor-corner");
		var aConfirm = $(this).find("a[data-confirm]");
		var print = $(this).find(".submit.print");
		var burger = $(this).find("header .burger-menu");
		
		// modalAjax
		if(modal.length === 1)
		{
			modal.modal();
			modalAnchor.modalAjax(modal);
		}
		
		// anchorCorner
		if(anchorCorner.length)
		anchorCorner.anchorCorner('mouseover');
		
		// aConfirm
		aConfirm.confirm('click');
		
		// com
		$(this).trigger('route:commonCom');
		
		// print
		print.on('click', function(event) {
			window.print();
		});
		
		// burger
		burger.on('click', function(event) {
			body.toggleClass('responsive-menu-open');
		});
        
        // popupTrigger
        popupTrigger.clickOpen(".popup-title");
	})
	
	// route:common:com
    // comportements utilisés pour l'outil de communication disponible sur toutes les pages
	.on('route:commonCom', function(event) {
		
		var com = $(this).find("#wrapper .com .box");
		
		com.block('click').on('click', '.close', function() {
			com.trigger('com:close');
		})
		.on('click', '.date', function(event) {
			com.trigger(com.hasClass('slide-close')? 'com:slideDown':'com:slideUp');
		})
		.on('click', ".row.insert > span,.row.update > span", function(event) {
			var parent = $(this).parent();
			var table = parent.data('table');
			var primary = parent.data('primary');
			com.trigger('redirect',[table,primary]);
		})
		.on('com:slideUp', function(event) {
			$(this).addClass('slide-close');
			$(this).find('.bottom').stop(true,true).slideUp('fast');
		})
		.on('com:slideDown', function(event) {
			$(this).removeClass('slide-close');
			$(this).find('.bottom').stop(true,true).slideDown('fast');
		})
		.on('com:close', function(event) {
			$(this).parent(".com").stop(true,true).fadeOut("slow");
		})
		.on('redirect', function(event,table,primary) {
			var href = $(this).dataHrefReplaceChar(table);
			
			if($.isStringNotEmpty(href))
			{
				$(this).trigger('block');
				href = href.replace($(this).data('char'),primary);
				$(document).trigger('navigation:push',[href]);
			}
		});
	});
});