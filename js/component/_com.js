/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// com
// script of behaviours for the communication component of the CMS
Component.com = function()
{
    // main
    Component.block.call(this,'click');
    Component.keyboardEscape.call(this,true);
    
    // triggerHandler
    $(this).on('com:getBottom', function() {
        return $(this).find('.bottom');
    })

    // trigger
    .on('escape:blocked', function() {
        triggerCustom(this,'com:close');
    })
    .on('com:slideUp', function() {
        $(this).addClass('slide-close');
        triggerFunc(this,'com:getBottom').stop(true,true).slideUp('fast');
    })
    .on('com:slideDown', function() {
        $(this).removeClass('slide-close');
        triggerFunc(this,'com:getBottom').stop(true,true).slideDown('fast');
    })
    .on('com:close', function() {
        $(this).stop(true,true).fadeOut("slow");
    })
    
    // delegate
    .on('click', '.close', function(event) {
        const $this = $(event.delegateTarget);
        $this.trigger('com:close');
    })
    .on('click', '.date', function(event) {
        const $this = $(event.delegateTarget);
        $this.trigger($this.hasClass('slide-close')? 'com:slideDown':'com:slideUp');
    })
    .on('click', ".row.insert > span,.row.update > span", function(event) {
        const $this = $(event.delegateTarget);
        const parent = $(this).parent();
        const table = parent.data('table');
        const primary = parent.data('primary');
        redirect.call($this,table,primary,event);
    })
    
    // bind
    .one('component:setup', function() {
        if($(this).is('[tabindex]'))
        $(this).focus();
    });
    
    // redirect
    let redirect = function(table,primary,clickEvent)
    {
        const href = Dom.dataHrefReplaceChar(this,table);
        
        if(Str.isNotEmpty(href))
        {
            triggerCustom(this,'block');
            href = href.replace($(this).data('char'),primary);
            $(document).trigger('document:go',[href,clickEvent]);
        }
    }
    
    return this;
}