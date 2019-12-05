/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// com
// script of behaviours for the communication component of the CMS
const Com = function()
{
    // nodes
    const $nodes = this;
    
    
    // main
    Component.BlockEvent.call(this,'click');
    Component.KeyboardEscape.call(this,true);
    
    
    // func
    setFunc(this,'com:getBottom',function() {
        return qs(this,'.bottom');
    });

    setFunc(this,'com:slideUp',function() {
        $(this).addClass('slide-close');
        triggerFunc(this,'com:getBottom').stop(true,true).slideUp('fast');
    });
    
    setFunc(this,'com:slideDown',function() {
        $(this).removeClass('slide-close');
        triggerFunc(this,'com:getBottom').stop(true,true).slideDown('fast');
    });
    
    
    // event
    ael(this,'keyboard:escape:blocked',function() {
        triggerCustom(this,'com:close');
    });
    
    ael(this,'com:close',function() {
        $(this).stop(true,true).fadeOut("slow");
    })
    
    
    // delegate
    aelDelegate(this,'click','.close',function(event) {
        const delegate = event.delegateTarget;
        triggerCustom(delegate,'com:close');
    });
    
    aelDelegate(this,'click','.date',function(event) {
        const delegate = event.delegateTarget;
        triggerFunc(delegate,$(delegate).hasClass('slide-close')? 'com:slideDown':'com:slideUp');
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
            triggerFunc(this,'blockEvent:block','click');
            href = href.replace($(this).data('char'),primary);
            triggerFunc(document,'doc:go',[href,clickEvent]);
        }
    }
    
    return this;
}

// export
Component.Com = Com;