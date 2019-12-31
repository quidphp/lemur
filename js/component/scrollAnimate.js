/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollAnimate
// component to smoothly scroll a container
Component.ScrollAnimate = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        scroller: window
    },option);
    
    
    // components
    Component.ScrollChange.call(this,$option);
    
    
    // handler
    setHdlrs(this,'scrollAnimate:',{
        
        getScroller: function() {
            let r = this;
            
            if(Target.is($option.scroller))
            r = $option.scroller;
            
            else if(Str.isNotEmpty($option.scroller))
            r = qs(this,$option.scroller);
            
            return r;
        },
        
        getCurrentScroll: function()
        {
            const scroller = trigHdlr(this,'scrollAnimate:getScroller');
            return (scroller === window)? Win.getScroll():Ele.getScroll(scroller);
        },
        
        getScrollTo: function(top,left,smooth) {
            const r = {};
            
            if(Integer.is(top))
            r.top = top;
            
            if(Integer.is(left))
            r.left = left;
            
            if(smooth === true)
            r.behavior = 'smooth';
            
            return r;
        },
        
        go: function(top,left,smooth) {
            const $this = this;
            const scroller = trigHdlr(this,'scrollAnimate:getScroller');
            const scrollTo = trigHdlr(this,'scrollAnimate:getScrollTo',top,left,smooth);
            scroller.scroll(scrollTo);
            
            return new Promise(function(resolve) {
                const handler = ael($this,'scroll:change',function() {
                    const currentScroll = trigHdlr($this,'scrollAnimate:getCurrentScroll');
                    
                    if((top == null || top === currentScroll.top) && (left == null || left === currentScroll.left))
                    {
                        rel($this,handler);
                        resolve();
                    }
                });
            });
        }
    });
    
    return this;
}