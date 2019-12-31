/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// com
// script of behaviours for the communication component of the CMS
Component.Com = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.BlockEvent.call(this,'click');
    Component.KeyboardEscape.call(this,true);
    Component.HrefReplaceChar.call(this);
    
    
    // handler
    setHdlrs(this,'com:',{
        
        isOpen: function() {
            return (getAttr(this,'data-status') !== 'close')? true:false;
        },
        
        getBottom: function() {
            return qs(this,'.bottom');
        },
        
        open: function() {
            setAttr(this,'data-status','open');
            const bottom = trigHdlr(this,'com:getBottom');
        },
        
        close: function() {
            setAttr(this,'data-status','close');
            const bottom = trigHdlr(this,'com:getBottom');
        }
    });
    
    
    // event
    ael(this,'keyboardEscape:blocked',function() {
        trigEvt(this,'com:close');
    });
    
    ael(this,'com:close',function() {
        setAttr(this,'data-status','hidden');
    })
    
    
    // delegate
    aelDelegate(this,'click','.close',function(event) {
        const delegate = event.delegateTarget;
        trigEvt(delegate,'com:close');
    });
    
    aelDelegate(this,'click','.date',function(event) {
        const delegate = event.delegateTarget;
        const isOpen = trigHdlr(delegate,'com:isOpen');
        trigHdlr(delegate,(isOpen)? 'com:close':'com:open');
    });
    
    aelDelegate(this,'click',".row.insert > span,.row.update > span",function(event) {
        const delegate = event.delegateTarget;
        const parent = Nod.parent(this);
        const table = getAttr(parent,'data-table');
        const primary = getAttr(parent,'data-primary');
        redirect.call(delegate,table,primary,event);
    });
    
    
    // bind
    aelOnce(this,'component:setup',function() {
        if(Nod.match(this,'[tabindex]'))
        Ele.focus(this);
    });
    
    
    // redirect
    const redirect = function(table,primary,clickEvent)
    {
        let href = trigHdlr(this,'hrefReplaceChar:make',table);
        
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