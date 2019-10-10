"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// slider
// script with behaviours for a slider
(function ($, document, window) {
	
	// slider
	// génère un slider complet avec bouton next et previous
	$.fn.slider = function(timeout,navs,className,showIfOne)
	{
		var func = function() {
			className = ($.isStringNotEmpty(className))? className:".slide";
			$(this).removeClass('loading');
			var tab = $(this);
			var prev = $(this).find(".prev");
			var next = $(this).find(".next");
			var target = $(this).find(className);
			
			target.on('tab:open', function(event) {
				$(this).addClass("active");
			})
			.on('tab:close', function(event) {
				$(this).removeClass("active");
			});
			
			if(target.length > 1 || showIfOne === true)
			{
				if(next.length)
				{
					next.on('click', function(event) {
						tab.trigger('tab:loopNext');
					});
				}
				
				if(prev.length)
				{
					prev.on('click', function(event) {
						tab.trigger('tab:loopPrev');
					});
				}
				
				if(navs instanceof jQuery && navs.length)
				{
					target.tabNav(navs);
					target.on('tab:open', function(event) {
						var nav = $(this).triggerHandler('link:getNav');
						navs.removeClass('active');
						nav.addClass('active');
					});
					navs.on('click', function(event) {
						var target = $(this).triggerHandler('link:getTarget');
						target.trigger('tab:change');
					});
				}
				
				if($.isNumeric(timeout))
				{
					$(this).timeout('tab:change',timeout)
					.on('tab:change:onTimeout', function(event) {
						$(this).trigger('tab:loopNext');
					})
					.on('mouseover', function(event) {
						$(this).trigger('tab:change:clearTimeout');
					})
					.on('mouseleave', function(event) {
						$(this).trigger('tab:change:setTimeout');
					});
				}
			}
			
			else
			{
				if(next.length)
				next.hide();
				
				if(prev.length)
				prev.hide();
				
				if(navs instanceof jQuery && navs.length)
				navs.hide();
			}
			
			$(this).on('tab:getTarget', function(event) {
				return target;
			}).tab().trigger('tab:changeOrFirst');
		};
		
		$(this).each(function(index, el) {
			$(this).addClass("loading");
			func.call(this);
		});
		
		return this;
	}
	
	
	// mediaSlider
	// gère le js pour un media slider
	$.fn.mediaSlider = function(timeout)
	{
		$(this).slider(timeout).find(".slide").on('tab:close', function(event) {
			var iframe = $(this).find("iframe");
			if(iframe.length)
			iframe.attr('src',iframe.attr('src'));
		});
		
		return this;
	}
	
}(jQuery, document, window));