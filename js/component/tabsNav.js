/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tabsNav
// script with behaviours for a tab component with support for navigation
Component.TabsNav = function(option) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        nav: [],
        navAttr: 'data-tab',
        navClickTrigger: true,
        first: null,
        prev: null,
        next: null,
        last: null,
        keyboardArrow: 'horizontalNotInput'
    },option);
    
    
    // components
    Component.Tabs.call(this,option);


    // handler
    setHdlrs(this,'tabsNav:',{
        getNavs: function() {
            let r = $option.nav;
            
            if(Str.isNotEmpty(r))
            r = qsa(this,r);
            
            return Arr.check(r);
        },
        
        getCurrentNav: function() {
            const current = trigHdlr(this,'tabs:getCurrent');
            return trigHdlr(current,'tab:getNav');
        },
        
        getFirst: function() {
            return (Str.isNotEmpty($option.first))? qsa(this,$option.first):$option.first;
        },
        
        getPrev: function() {
            return (Str.isNotEmpty($option.prev))? qsa(this,$option.prev):$option.prev;
        },
        
        getNext: function() {
            return (Str.isNotEmpty($option.next))? qsa(this,$option.next):$option.next;
        },
        
        getLast: function() {
            return (Str.isNotEmpty($option.last))? qsa(this,$option.last):$option.last;
        },
        
        sync: function() {
            syncNav.call(this);
            syncDirection.call(this);
        }
    });    
    
    
    // event
    ael(this,'tabs:afterChange',function(event,tab,oldTab) {
        trigHdlr(this,'tabsNav:sync');
    });
    
    // event
    ael(this,'keyboardArrow:left',function(event,keyEvent,isInput) {
        trigHdlr(this,'tabs:goPrev');
    });
    
    ael(this,'keyboardArrow:right',function(event,keyEvent,isInput) {
        trigHdlr(this,'tabs:goNext');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindNav.call(this);
        bindDirection.call(this);
        
        if(Ele.match(this,'[tabindex]'))
        Component.KeyboardArrow.call(this,$option.keyboardArrow);
    });
    
    
    // bindNav
    const bindNav = function()
    {
        const $this = this;
        const tabs = trigHdlr(this,'tabs:getTargets');
        const navs = trigHdlr(this,'tabsNav:getNavs');
        
        Arr.each(navs,function(value,key) {
            const tab = Arr.get(key,tabs);
            if(value != null && tab != null)
            {
                // tab handler
                setHdlr(tab,'tab:getNav',function() {
                    return value;
                });
                
                // nav handler
                setHdlr(value,'nav:getTab',function() {
                    return tab;
                });
                
                setHdlr(value,'nav:trigger',function() {
                    trigHdlr($this,'tabs:go',tab)
                });
                
                if($option.navClickTrigger)
                {
                    ael(value,'click',function() {
                        trigHdlr(this,'nav:trigger');
                    });
                }
            }
        });
    }
    
    
    // bindDirection
    const bindDirection = function()
    {
        const $this = this;
        
        Arr.each(['first','prev','next','last'],function(value) {
            const upper = Str.upperFirst(value);
            const node = trigHdlr($this,'tabsNav:get'+upper);
            
            if(node != null)
            {
                setHdlr(node,'navDirection:trigger',function() {
                    trigHdlr($this,'tabs:go',value);
                });
                
                ael(node,'click',function() {
                    trigHdlr(this,'navDirection:trigger');
                });
            }
        });
    }
    
    
    // syncNav
    const syncNav = function()
    {
        const navs = trigHdlr(this,'tabsNav:getNavs');
        const current = trigHdlr(this,'tabsNav:getCurrentNav');
        
        if(Arr.isNotEmpty(navs))
        {
            setAttr(navs,$option.navAttr,0);
            
            if(current != null)
            setAttr(current,$option.navAttr,1);
        }
    }
    
    
    // syncDirection
    const syncDirection = function()
    {
        const $this = this;
        const tabs = trigHdlr(this,'tabs:getTargets');
        const tabsLength = (Arr.length(tabs) > 1)? true:false;
        let value;
        
        const first = trigHdlr(this,'tabsNav:getFirst');
        if(first != null)
        {
            value = (tabsLength && !trigHdlr($this,'tabs:isFirst'))? false:true;
            setProp(first,'disabled',value);
        }
        
        const last = trigHdlr(this,'tabsNav:getLast');
        if(last != null)
        {
            value = (tabsLength && !trigHdlr($this,'tabs:isLast'))? false:true;
            setProp(last,'disabled',value);
        }
        
        const prev = trigHdlr(this,'tabsNav:getPrev');
        if(prev != null)
        {
            value = (tabsLength && trigHdlr($this,'tabs:hasPrev'))? false:true;
            setProp(prev,'disabled',value);
        }
        
        const next = trigHdlr(this,'tabsNav:getNext');
        if(next != null)
        {
            value = (tabsLength && trigHdlr($this,'tabs:hasNext'))? false:true;
            setProp(next,'disabled',value);
        }
    }
    
    return this;
}