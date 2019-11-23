"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// com
// script of behaviours for the communication component of the CMS
quid.cms.com = function()
{
    // main
    quid.main.event.block.call(this,'click');
    quid.main.keyboard.escape.call(this,true);
    
    // triggerHandler
    $(this).on('com:getBottom', function(event) {
        return $(this).find('.bottom');
    })
    
    // trigger
    .on('escape:blocked', function(event) {
        $(this).trigger('com:close');
    })
    .on('com:slideUp', function(event) {
        $(this).addClass('slide-close');
        $(this).triggerHandler('com:getBottom').stop(true,true).slideUp('fast');
    })
    .on('com:slideDown', function(event) {
        $(this).removeClass('slide-close');
        $(this).triggerHandler('com:getBottom').stop(true,true).slideDown('fast');
    })
    .on('com:close', function(event) {
        $(this).stop(true,true).fadeOut("slow");
    })
    
    // delegate
    .on('click', '.close', function(event) {
        var $this = $(event.delegateTarget);
        $this.trigger('com:close');
    })
    .on('click', '.date', function(event) {
        var $this = $(event.delegateTarget);
        $this.trigger($this.hasClass('slide-close')? 'com:slideDown':'com:slideUp');
    })
    .on('click', ".row.insert > span,.row.update > span", function(event) {
        var $this = $(event.delegateTarget);
        var parent = $(this).parent();
        var table = parent.data('table');
        var primary = parent.data('primary');
        redirect.call($this,table,primary,event);
    })
    
    // bind
    .one('component:setup', function(event) {
        if($(this).is('[tabindex]'))
        $(this).focus();
    });
    
    // redirect
    var redirect = function(table,primary,clickEvent)
    {
        var href = $(this).dataHrefReplaceChar(table);
        
        if(quid.base.str.isNotEmpty(href))
        {
            $(this).trigger('block');
            href = href.replace($(this).data('char'),primary);
            $(document).trigger('document:go',[href,clickEvent]);
        }
    }
    
    return this;
}