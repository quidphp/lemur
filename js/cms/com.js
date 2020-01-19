/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// com
// script of behaviours for the communication component of the CMS
Component.Com = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        clickOpen: {
            attr: "data-com",
            trigger: ".scroller .date", 
            target: ".scroller .bottom", 
            clickOutside: false,
            background: false, 
            targetHeight: true
        }
    },option);
    
    
    // components
    Component.ClickOpenTrigger.call(this,$option.clickOpen)
    Component.HrefReplaceChar.call(this);
    
    
    // event
    ael(this,'keyboardEscape:blocked',function() {
        trigEvt(this,'com:hide');
    });
    
    ael(this,'com:hide',function() {
        setAttr(this,'data-status','hidden');
    })
    
    
    // delegate
    aelDelegate(this,'click','.close',function(event) {
        const delegate = event.delegateTarget;
        trigEvt(delegate,'com:hide');
    });
    

    // bind
    aelOnce(this,'component:setup',function() {
        bindLinks.call(this);
        
        if(Ele.isFocusable(this))
        Ele.focus(this);
    });
    
    
    // bindLinks
    const bindLinks = function()
    {
        const $this = this;
        const links = qsa(this,".row.insert > span,.row.update > span");
        
        ael(links,'click',function() {
            const parent = Nod.parent(this);
            const table = getAttr(parent,'data-table');
            const primary = getAttr(parent,'data-primary');
            redirect.call($this,table,primary,event);
        });
    }
    
    
    // redirect
    const redirect = function(table,primary,clickEvent)
    {
        let href = trigHdlr(this,'hrefReplaceChar:make',table);
        
        if(Str.isNotEmpty(href))
        {
            const char = getAttr(this,'data-char');
            href = href.replace(char,primary);
            trigHdlr(document,'history:href',href,clickEvent);
        }
    }
    
    return this;
}