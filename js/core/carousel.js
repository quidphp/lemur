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
quid.core.carousel = function(trigger,target)
{
    $(this).each(function(index, el) {
        trigger = (trigger == null)? '.trigger':trigger;
        target = (target == null)? '.target':target;
        
        $(this)
        .callThis(quid.core.clickOpenBase,target)
        .callThis(quid.core.clickOpenTrigger,trigger)
        .on('clickOpen:getTarget', function(event) {
            return $(this).find(target).first();
        })
        .on('clickOpen:getAttr', function(event) {
            return 'data-carousel';
        })
        .on('clickOpen:getBackgroundFrom',function(event) {
            return 'carousel';
        })
        .on('clickOpen:allowMultiple', function(event) {
            return true;
        })
        .trigger('clickOpen:prepare');
    });
    
    return this;
}