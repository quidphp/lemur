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
    $(this).each(function(index, el) {

        var $this = $(this);
        
        // redirect
        function redirect(table,primary,clickEvent)
        {
            var href = $(this).dataHrefReplaceChar(table);
            
            if(quid.base.str.isNotEmpty(href))
            {
                $(this).trigger('block');
                href = href.replace($(this).data('char'),primary);
                $(document).trigger('document:go',[href,clickEvent]);
            }
        }
        
        $(this).block('click').escapeCatch().on('click', '.close', function() {
            $this.trigger('com:close');
        })
        .on('escape:blocked', function(event) {
            $(this).trigger('com:close');
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
            $(this).stop(true,true).fadeOut("slow");
        })
        .on('com:prepare', function(event) {
            if($(this).is('[tabindex]'))
            $(this).focus();
        })
        .on('click', '.date', function(event) {
            $this.trigger($this.hasClass('slide-close')? 'com:slideDown':'com:slideUp');
        })
        .on('click', ".row.insert > span,.row.update > span", function(event) {
            var parent = $(this).parent();
            var table = parent.data('table');
            var primary = parent.data('primary');
            redirect.call($this,table,primary,event);
        })
        .trigger('com:prepare');
    });
    
    return this;
}