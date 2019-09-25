"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// accordion
// script of behaviours for an accordion-related widgets
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
	
	
	// accordion
	// génère un accordion simple
	$.fn.accordion = function(until,closeAll,wrap)
	{	
		var $this = $(this);
		
		$(this).on('click', function(event) {
			if(closeAll === true)
			$this.trigger('accordion:close');
			
			if($(this).triggerHandler('accordion:isOpen'))
			$(this).trigger('accordion:close');
			
			else
			$(this).trigger('accordion:open');
		})
		.on('accordion:getContents', function(event) {
			return $(this).nextUntil(until);
		})
		.on('accordion:getActiveClass', function(event) {
			return 'active';
		})
		.on('accordion:getOpenClass', function(event) {
			return 'open';
		})
		.on('accordion:isOpen', function(event) {
			var openClass = $(this).triggerHandler('accordion:getOpenClass');
			return $(this).hasClass(openClass);
		})
		.on('accordion:close', function(event) {
			var openClass = $(this).triggerHandler('accordion:getOpenClass');
			var activeClass = $(this).triggerHandler('accordion:getActiveClass');
			$(this).removeClass(openClass).removeClass(activeClass);
			$(this).triggerHandler('accordion:getContents').removeClass(activeClass);
			
			if($.isStringNotEmpty(wrap))
			$(this).parent().removeClass(openClass);
		})
		.on('accordion:open', function(event) {
			var openClass = $(this).triggerHandler('accordion:getOpenClass');
			var activeClass = $(this).triggerHandler('accordion:getActiveClass');
			$(this).addClass(openClass).addClass(activeClass);
			$(this).triggerHandler('accordion:getContents').addClass(activeClass);
			
			if($.isStringNotEmpty(wrap))
			$(this).parent().addClass(openClass);
		});
		
		if($.isStringNotEmpty(wrap))
		{
			var html = "<div class='"+wrap+"'></div>";
			$(this).wrapConsecutiveSiblings(until,html);
		}
		
		return this;
	}
		
}(jQuery, document, window));