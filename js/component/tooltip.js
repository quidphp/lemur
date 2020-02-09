/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tooltip
// component to manage tooltip content
Component.Tooltip = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        target: "body > .tooltip",
        targetContent: true,
        attrContent: "data-tooltip",
        attrViewport: "data-viewport",
        attr: "data-active",
        offsetTop: 0,
        offsetLeft: 0,
        persistent: false
    },option);
    
    
    // component
    Component.ScrollChange.call(this,$option);
    
    
    // handler
    setHdlrs(this,'tooltip:',{
        
        isActive: function() {
            const target = trigHdlr(this,'tooltip:getTarget');
            return getAttr(target,$option.attr,'int') === 1;
        },
        
        getTarget: function() {
            const r = qs(document,$option.target);
            return Ele.check(r);
        },
        
        getTargetContent: function() {
            let r = trigHdlr(this,'tooltip:getTarget');
            
            if(Str.isNotEmpty($option.targetContent))
            r = qs(r,$option.targetContent);
            
            return r;
        },
        
        getContent: function() {
            const r = getAttr(this,$option.attrContent);
            return Str.check(r,true);
        },
        
        show: function() {
            const target = trigHdlr(this,'tooltip:getTarget');
            const targetContent = trigHdlr(this,'tooltip:getTargetContent');
            const content = trigHdlr(this,'tooltip:getContent');
            setAttr(target,$option.attr,1);
            setHtml(targetContent,content);
            trigHdlr(this,'tooltip:updatePosition');
        },
        
        hide: function() {
            const target = trigHdlr(this,'tooltip:getTarget');
            const targetContent = trigHdlr(this,'tooltip:getTargetContent');
            setAttr(target,$option.attr,0);
            Ele.removeAttr(target,$option.attrViewport);
            setHtml(targetContent,false);
            setCss(target,'top',null);
            setCss(target,'left',null);
        },
        
        updatePosition: function() {
            const target = trigHdlr(this,'tooltip:getTarget');
            const dimension = Ele.getDimension(target);
            const position = getPosition.call(this,dimension);
            setCss(target,'top',position.top);
            setCss(target,'left',position.left);
            setAttr(target,$option.attrViewport,position.viewport);
        }
    });
    
    
    // event
    ael(this,'scroll:change',function() {
        if(trigHdlr(this,'tooltip:isActive'))
        trigHdlr(this,'tooltip:updatePosition');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindTip.call(this);
    });
    
    
    // bindTip
    const bindTip = function()
    {
        const handler = ael(this,'mouseenter',function() {
            trigHdlr(this,'tooltip:show');
        });
        
        const handler2 = ael(this,'mouseleave',function() {
            trigHdlr(this,'tooltip:hide');
        });
        
        if($option.persistent !== true)
        {
            const $this = this;
            const teardown = function() {
                trigHdlr($this,'tooltip:hide');
                rel($this,handler);
                rel($this,handler2);
            };
            
            aelOnce(document,'doc:unmountPage',teardown);
            aelOnce(this,'component:teardown',teardown);
        }
    }
    
    
    // getPosition
    const getPosition = function(dimension) 
    {
        const rect = Ele.getBoundingRect(this);
        const winDimension = Win.getDimension();
        let top = rect.top - dimension.height;
        let left = rect.left + (rect.width / 2) - (dimension.width / 2);
        let viewport = 1;
        
        if(left < 0)
        {
            left = 0;
            viewport = 0;
        }
        
        else if((left + dimension.width) > winDimension.width)
        {
            left = winDimension.width - dimension.width;
            viewport = 0;
        }
        
        if(Integer.is($option.offsetTop))
        top += $option.offsetTop;
        
        if(Integer.is($option.offsetLeft))
        left += $option.offsetLeft;
        
        top += "px";
        left += "px";
        
        return {
            top: top,
            left: left,
            viewport: viewport
        }
    }
    
    return this;
}