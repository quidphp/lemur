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
        stop: 50,
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
        
        getCurrentDimension: function()
        {
            const scroller = trigHdlr(this,'scrollAnimate:getScroller');
            return (scroller === window)? Doc.getDimension(document):Ele.getDimension(scroller);
        },
        
        go: function(top,left,smooth) {
            const $this = this;
            top = (Num.is(top))? Integer.cast(top):null;
            left = (Num.is(left))? Integer.cast(left):null;
            const scroller = trigHdlr(this,'scrollAnimate:getScroller');
            const scrollTo = getScrollTo(top,left,smooth);
            
            if(scrollTo != null)
            {
                scroller.scroll(scrollTo);
                
                return new Promise(function(resolve) {
                    const handler = ael($this,'scroll:stop',function() {
                        rel($this,handler);
                        resolve();
                    });
                });
            }
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
    
    return this;
}