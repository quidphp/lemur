"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// carousel
// script for a carousel component which slides up or down

// carousel
// crée un carousel qui slide up ou down
quid.core.carousel = $.fn.carousel = function(trigger,target)
{
    $(this).each(function(index, el) {
        trigger = (trigger == null)? '.trigger':trigger;
        target = (target == null)? '.target':target;
        
        $(this).on('carousel:isClose', function(event) {
            return $(this).triggerHandler('carousel:getTarget').is(":hidden");
        })
        .on('carousel:isOpen', function(event) {
            return $(this).triggerHandler('carousel:getTarget').is(":visible");
        })
        .on('carousel:isEmpty', function(event) {
            return $(this).triggerHandler('carousel:getTarget').is(":empty");
        })
        .on('carousel:getTarget', function(event) {
            return $(this).find(".target").first();
        })
        .on('carousel:getTrigger', function(event) {
            return $(this).find(trigger).first();
        })
        .on('carousel:setContent', function(event,html) {
            $(this).triggerHandler('carousel:getTarget').html(html);
        })
        .on('carousel:toggle', function(event) {
            $(this).trigger($(this).triggerHandler('carousel:isOpen')? 'carousel:close':'carousel:open');
        })
        .on('carousel:open', function(event) {
            $(this).addClass("active");
        })
        .on('carousel:close', function(event) {
            $(this).removeClass("active");
        })
        .on('carousel:prepare', function(event) {
            var $this = $(this);
            $(this).triggerHandler('carousel:getTrigger').on('click', function(event) {
                $this.trigger('carousel:toggle');
            });
        })
        .trigger('carousel:prepare');
    });
    
    return this;
}