/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// com
// script of behaviours for the communication component of the CMS
Quid.Component.com = function()
{
    // main
    Quid.Component.block.call(this,'click');
    Quid.Component.keyboardEscape.call(this,true);
    
    // triggerHandler
    $(this).on('com:getBottom', function() {
        return $(this).find('.bottom');
    })

    // trigger
    .on('escape:blocked', function() {
        $(this).trigger('com:close');
    })
    .on('com:slideUp', function() {
        $(this).addClass('slide-close');
        $(this).triggerHandler('com:getBottom').stop(true,true).slideUp('fast');
    })
    .on('com:slideDown', function() {
        $(this).removeClass('slide-close');
        $(this).triggerHandler('com:getBottom').stop(true,true).slideDown('fast');
    })
    .on('com:close', function() {
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
    .one('component:setup', function() {
        if($(this).is('[tabindex]'))
        $(this).focus();
    });
    
    // redirect
    var redirect = function(table,primary,clickEvent)
    {
        var href = Quid.Node.dataHrefReplaceChar(this,table);
        
        if(Quid.Str.isNotEmpty(href))
        {
            $(this).trigger('block');
            href = href.replace($(this).data('char'),primary);
            $(document).trigger('document:go',[href,clickEvent]);
        }
    }
    
    return this;
}