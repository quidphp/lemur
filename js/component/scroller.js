/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scroller
// component to manage scrolling within a container, allows animating
Component.Scroller = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        stop: 50,
        scroller: window
    },option);
    
    
    // components
    Component.ScrollChange.call(this,$option);
    
    
    // handler
    setHdlrs(this,'scroller:',{
        
        isScrolling: function() {
            return getData(this,'scroller-scrolling') === true;
        },
        
        shouldScroll: function(scrollTo) {
            let r = false;
            Pojo.check(scrollTo);
            const current = trigHdlr(this,'scroller:getCurrentScroll');
            
            if(Pojo.keyExists("left",scrollTo) && Integer.cast(scrollTo.left) !== Integer.cast(current.left))
            r = true;
            
            else if(Pojo.keyExists("top",scrollTo) && Integer.cast(scrollTo.top) !== Integer.cast(current.top))
            r = true;
            
            return r;
        },
        
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
            const scroller = trigHdlr(this,'scroller:getScroller');
            return (scroller === window)? Win.getScroll():Ele.getScroll(scroller);
        },
        
        getCurrentDimension: function()
        {
            const scroller = trigHdlr(this,'scroller:getScroller');
            return (scroller === window)? Doc.getDimension(document):Ele.getDimension(scroller);
        },
        
        getCurrentTarget: function(targets,debug) {
            return getCurrentTarget.call(this,targets,debug);
        },
        
        go: function(top,left,smooth) {
            let r = null;
            const $this = this;
            top = (Num.is(top))? Integer.cast(top):null;
            left = (Num.is(left))? Integer.cast(left):null;
            const scroller = trigHdlr(this,'scroller:getScroller');
            const scrollTo = getScrollTo(top,left,smooth);
            
            if(scrollTo != null)
            {
                const shouldScroll = trigHdlr(this,'scroller:shouldScroll',scrollTo);
                
                if(shouldScroll === true)
                {
                    setData(this,'scroller-scrolling',true);
                    scroller.scroll(scrollTo);
                    
                    const promise = new Promise(function(resolve) {
                        const handler = aelOnce($this,'scroll:stop',function() {
                            rel($this,handler);
                            resolve();
                        });
                    });
                    r = promise.then(function() {
                        setData($this,'scroller-scrolling',false);
                    });
                }
            }
            
            return r;
        },
        
        goSmooth: function(top,left) {
            return trigHdlr(this,'scroller:go',top,left,true);
        }
    });
    
    
    // getScrollTo
    const getScrollTo = function(top,left,smooth)
    {
        let r = null;
        
        if(Integer.is(top) || Integer.is(left))
        {
            r = {};
            
            if(Integer.is(top))
            r.top = top;
            
            if(Integer.is(left))
            r.left = left;
            
            if(smooth === true)
            r.behavior = 'smooth';
        }
        
        return r;
    }
    
    
    // getCurrentTarget
    const getCurrentTarget = function(targets,debug)
    {
        let r = null;
        Ele.checks(targets);
        const winDimension = Win.getDimension();
        const currentScroll = trigHdlr(this,'scroller:getCurrentScroll');
        const currentDimension = trigHdlr(this,'scroller:getCurrentDimension');
        
        const windowHeight = winDimension.height;
        const windowHeightRatio = (windowHeight / 2);
        const scrollTop = currentScroll.top;
        const documentHeight = currentDimension.height;
        
        if(Arr.isNotEmpty(targets))
        {
            if(scrollTop <= windowHeightRatio)
            r = Arr.valueFirst(targets);
            
            else
            {
                Arr.each(targets,function() {
                    let keep = false;
                    const offset = Ele.getOffsetDoc(this).top;
                    const height = Ele.getDimension(this).height;
                    
                    if(scrollTop >= (offset - windowHeightRatio))
                    {
                        if(scrollTop < ((offset + height) - windowHeightRatio))
                        keep = true;
                    }
                    
                    if(keep === true)
                    {
                        r = this;
                        return false;
                    }
                });
            }
            
            if(r == null && scrollTop >= (documentHeight - windowHeight))
            r = Arr.valueLast(targets);
        }
        
        return r;
    }
    
    return this;
}