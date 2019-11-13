"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpenAnchorAjax
// script for anchor which renders ajax content in a clickOpen

// clickOpenAnchorAjax
// génère un lien en ajax dont le contenu s'affiche dans un clickOpen
quid.core.clickOpenAnchorAjax = $.fn.clickOpenAnchorAjax = function(trigger,target) 
{
    $(this).each(function(index, el) {
        var anchor = $(this).find("a");
        trigger = trigger || 'a';
        
        $(this).on('ajax:getHref', function(event) {
            return $(this).triggerHandler('clickOpen:getTrigger').prop('href');
        })
        .clickOpenAjax('click',true,target).clickOpenTrigger(trigger,'click')
        
        anchor.on('click', function(event) {
            event.preventDefault();
        });
    });
    
    return this;
}