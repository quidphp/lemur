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
    
    
    // nodes
    const $nodes = this;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        attrStatus: "data-status",
        attrHtml: "data-html",
        clickOpen: {
            attr: "data-open",
            trigger: ".date", 
            target: ".bottom", 
            clickOutside: false,
            background: false, 
            targetHeight: true,
            transitionTimeout: 500
        }
    },option);
    
    
    // components
    Component.HrefReplaceChar.call(this);
    
    
    // handler
    setHdlrs(this,'com:',{
        
        show: function(focus) {
            setAttr(this,$option.attrStatus,'visible');
            
            if(focus === true && Ele.isFocusable(this))
            Ele.focus(this);
        },
        
        hide: function() {
            setAttr(this,$option.attrStatus,'hidden');
        },
        
        setAndShow: function(content,method) {
            if(Str.isNotEmpty(content))
            setAndShow.call(this,content,method);
        },
        
        setHtmlAndShow: function(content) {
            if(Str.isNotEmpty(content))
            setHtmlAndShow.call(this,content);
        },
        
        getClose: function() {
            return Ele.typecheck(qs(this,"> .close"));
        },
        
        getScroller: function() {
            return Ele.typecheck(qs(this,"> .scroller"));
        },
        
        getComElement: function() {
            return qs(this,".com-element");
        }
    });
    
    
    // event
    ael(this,'keyboardEscape:blocked',function() {
        trigHdlr(this,'com:hide');
    });
    
    ael(document,'keyboardEscape:catched',function() {
        trigHdlrs($nodes,'com:hide');
    });
    
    
    // bind
    aelOnce(this,'component:setup',function() {
        bindDocument.call(this);
        bindClose.call(this);
        
        const content = getAttr(this,$option.attrHtml);
        if(Str.isNotEmpty(content))
        {
            Ele.removeAttr(this,$option.attrHtml);
            setHtmlAndShow.call(this,content);
        }
    });
    
    
    // bindDocument
    const bindDocument = function()
    {
        const $this = this;
        
        setHdlr(document,'doc:getCom',function() {
            return $this;
        });
    }
    
    
    // setAndShow
    const setAndShow = function(content,method)
    {
        let newHtml = '';
        Str.typecheck(content,true);
        method = (Str.isNotEmpty(method))? method:'pos';
        
        newHtml = Html.span(content);
        newHtml = Html.li(newHtml,method);
        newHtml = Html.ul(newHtml);
        
        setHtmlAndShow.call(this,newHtml);
    }
    
    
    // setHtmlAndShow
    const setHtmlAndShow = function(content)
    {
        const $this = this;
        const scroller = trigHdlr(this,'com:getScroller');
        const html = makeHtml.call(this,content);
        setHtml(scroller,html);
        
        const comElement = trigHdlr(this,'com:getComElement');
        if(comElement !== null)
        {
            trigSetup(Component.ClickOpenTrigger.call(comElement,$option.clickOpen));
            trigEvt(comElement,'clickOpen:open');
            
            bindLinks.call(this);
            trigHdlr(this,'com:show',true);
        }
    }
    
    
    // makeHtml
    const makeHtml = function(content)
    {
        let r = '';
        Str.typecheck(content,true);
        const date = Datetime.toSecond();
        
        let top = '';
        top += Html.div(null,'triangle');
        top += Html.button(date,'date');
        
        r += Html.div(top,'top');
        r += Html.div(null,'spacer');
        r += Html.div(content,'bottom');
        
        r = Html.div(r,'com-element');
        
        return r;
    }
    
    
    // bindClose
    const bindClose = function()
    {
        const $this = this;
        const close = trigHdlr(this,'com:getClose');
        
        ael(close,'click',function() {
            trigHdlr($this,'com:hide');
        });
    }
    
    
    // bindLinks
    const bindLinks = function()
    {
        const $this = this;
        const links = qsa(this,".row.insert > span,.row.update > span");
        
        ael(links,'click',function() {
            const parent = Ele.parent(this);
            const table = getAttr(parent,'data-table');
            const primary = getAttr(parent,'data-primary');
            redirect.call($this,table,primary,event);
        });
    }
    
    
    // redirect
    const redirect = function(table,primary,clickEvent)
    {
        const char = getAttr(this,'data-char');
        
        if(char != null)
        {
            let href = trigHdlr(this,'hrefReplaceChar:make',table);
            
            if(Str.isNotEmpty(href))
            {
                href = href.replace(char,primary);
                trigHdlr(document,'history:href',href,clickEvent);
            }
        }
    }
    
    return this;
}