/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// backToTop
// script for a component which brings back to the top of the page
Component.BackToTop = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        scroller: 'html',
        attr: 'data-active',
        trigger: 'button',
        speed: 500
    },option);
    
    
    // components
    Component.ScrollChange.call(this);
    
    
    // handler
    setHdlrs(this,'backToTop:',{
        
        getScroller: function() {
            let r = this;
            
            if(Str.isNotEmpty($option.scroller))
            r = qs(document,$option.scroller);
            
            const htmlBody = trigHdlr(document,'doc:getHtmlBody');

            if(Arr.in(this,htmlBody))
            r = htmlBody;
            
            return r;
        },
        
        getTrigger: function() {
            return qs(this,$option.trigger);
        },
        
        show: function() {
            setAttr(this,$option.attr,1);
        },
        
        hide: function() {
            setAttr(this,$option.attr,0);
        },
        
        refresh: function() {
            const scroller = trigHdlr(this,'backToTop:getScroller');
            const scrollTop = $(scroller).scrollTop();
            trigHdlr(this,(scrollTop === 0)? 'backToTop:hide':'backToTop:show');
        }
    });
    
    
    // event
    ael(this,'scroll:change',function() {
        trigHdlr(this,'backToTop:refresh');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindTrigger.call(this);
        trigHdlr(this,'backToTop:refresh');
    });
    
    
    // bindTrigger
    const bindTrigger = function()
    {
        const $this = this;
        const trigger = trigHdlr(this,'backToTop:getTrigger');
        
        ael(trigger,'click',function() {
            const scroller = trigHdlr($this,'backToTop:getScroller');
            $(scroller).stop(true,true).animate({scrollTop: 0},$option.speed);
        });
    }
    
    return this;
}