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
    setHdlrs(this,'com:',{
        
        isOpen: function() {
            return (getAttr(this,'data-status') !== 'close')? true:false;
        },
        
        getBottom: function() {
            return qs(this,'.bottom');
        },
        
        slideUp: function() {
            setAttr(this,'data-status','close');
            const bottom = trigHdlr(this,'com:getBottom');
            $(bottom).stop(true,true).slideUp('fast');
        },
        
        slideDown: function() {
            setAttr(this,'data-status','open');
            const bottom = trigHdlr(this,'com:getBottom');
            $(bottom).stop(true,true).slideDown('fast');
        }
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
        const isOpen = trigHdlr(delegate,'com:isOpen');
        trigHdlr(delegate,(isOpen)? 'com:slideUp':'com:slideDown');
    });
    
    aelDelegate(this,'click',".row.insert > span,.row.update > span",function(event) {
        const delegate = event.delegateTarget;
        const parent = $(this).parent();
        const table = getAttr(parent,'data-table');
        const primary = getAttr(parent,'data-primary');
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
            const char = getAttr(this,'data-char');
            trigHdlr(this,'blockEvent:block','click');
            href = href.replace(char,primary);
            trigHdlr(document,'history:href',href,clickEvent);
        }
    }
    
    return this;
}