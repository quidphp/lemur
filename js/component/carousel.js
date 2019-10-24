"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// carousel
// script for a carousel component which slides up or down
(function ($, document, window) {
	
	// carousel
	// crée un carousel qui slide up ou down
	$.fn.carousel = function(arg,multi)
	{
		$(this).each(function(index, el) {
			var target = arg;
			
			if(multi === true && target instanceof jQuery)
			target = target.eq(index);
			
			$(this).on('click', function(event) {
				$(this).trigger('carousel:toggle');
			})
			.on('carousel:isClose', function(event) {
				return $(this).triggerHandler('carousel:getTarget').is(":hidden");
			})
			.on('carousel:isOpen', function(event) {
				return $(this).triggerHandler('carousel:getTarget').is(":visible");
			})
			.on('carousel:isEmpty', function(event) {
				return $(this).triggerHandler('carousel:getTarget').is(":empty");
			})
			.on('carousel:getTarget', function(event) {
				return target;
			})
			.on('carousel:setContent', function(event,html) {
				$(this).triggerHandler('carousel:getTarget').html(html);
			})
			.on('carousel:toggle', function(event) {
				$(this).trigger($(this).triggerHandler('carousel:isOpen')? 'carousel:close':'carousel:open');
			})
			.on('carousel:open', function(event) {
				$(this).addClass("active");
				$(this).triggerHandler('carousel:getTarget').stop(true,true).slideDown("fast");
			})
			.on('carousel:close', function(event) {
				$(this).removeClass("active");
				$(this).triggerHandler('carousel:getTarget').stop(true,true).slideUp("fast");
			});
		});
		
		return this;
	}
		
}(jQuery, document, window));