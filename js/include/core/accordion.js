"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// accordion
// script of behaviours for an accordion component

// accordion
// génère un accordion simple
quid.core.accordion = $.fn.accordion = function(until,closeAll,wrap)
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
        
        if(quid.base.isStringNotEmpty(wrap))
        $(this).parent().removeClass(openClass);
    })
    .on('accordion:open', function(event) {
        var openClass = $(this).triggerHandler('accordion:getOpenClass');
        var activeClass = $(this).triggerHandler('accordion:getActiveClass');
        $(this).addClass(openClass).addClass(activeClass);
        $(this).triggerHandler('accordion:getContents').addClass(activeClass);
        
        if(quid.base.isStringNotEmpty(wrap))
        $(this).parent().addClass(openClass);
    });
    
    if(quid.base.isStringNotEmpty(wrap))
    {
        var html = "<div class='"+wrap+"'></div>";
        $(this).wrapConsecutiveSiblings(until,html);
    }
    
    return this;
}