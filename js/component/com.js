/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// com
// script of behaviours for the communication component of the CMS
const Com = Component.Com = function()
{
    // components
    Component.BlockEvent.call(this,'click');
    Component.KeyboardEscape.call(this,true);
    
    
    // handler
    setHandler(this,'com:getBottom',function() {
        return qs(this,'.bottom');
    });

    setHandler(this,'com:slideUp',function() {
        $(this).addClass('slide-close');
        trigHandler(this,'com:getBottom').stop(true,true).slideUp('fast');
    });
    
    setHandler(this,'com:slideDown',function() {
        $(this).removeClass('slide-close');
        trigHandler(this,'com:getBottom').stop(true,true).slideDown('fast');
    });
    
    
    // event
    ael(this,'keyboardEscape:blocked',function() {
        trigEvt(this,'com:close');
    });
    
    ael(this,'com:close',function() {
        $(this).stop(true,true).fadeOut("slow");
    })
    
    
    // delegate
    aelDelegate(this,'click','.close',function(event) {
        const delegate = event.delegateTarget;
        trigEvt(delegate,'com:close');
    });
    
    aelDelegate(this,'click','.date',function(event) {
        const delegate = event.delegateTarget;
        trigHandler(delegate,$(delegate).hasClass('slide-close')? 'com:slideDown':'com:slideUp');
    });
    
    aelDelegate(this,'click',".row.insert > span,.row.update > span",function(event) {
        const delegate = event.delegateTarget;
        const parent = $(this).parent();
        const table = parent.data('table');
        const primary = parent.data('primary');
        redirect.call(delegate,table,primary,event);
    });
    
    
    // bind
    aelOnce(this,'component:setup',function() {
        if($(this).is('[tabindex]'))
        $(this).focus();
    });
    
    
    // redirect
    const redirect = function(table,primary,clickEvent)
    {
        const href = Dom.dataHrefReplaceChar(this,table);
        
        if(Str.isNotEmpty(href))
        {
            trigHandler(this,'blockEvent:block','click');
            href = href.replace($(this).data('char'),primary);
            trigHandler(document,'doc:go',[href,clickEvent]);
        }
    }
    
    return this;
}