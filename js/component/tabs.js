/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tabs
// script with behaviours for a tabs component
const Tabs = Component.Tabs = function(option) 
{
    // tabChange
    const tabChange = function(target)
    {
        const $this = this;
        const tabs = trigHdlr(this,'tabs:getTargets');
        const current = trigHdlr(this,'tabs:getCurrent');
        
        trigEvt(this,'tabs:beforeChange',target,current);
        
        Arr.each(tabs,function() {
            if(this !== target)
            trigEvt(this,'tab:close');
        }); 
        
        trigEvt(target,'tab:open');
        trigEvt(this,'tabs:afterChange',target,current);
    };
    
    
    // option
    const $option = Pojo.replaceRecursive({
        target: [],
        attr: 'data-active',
        loop: false,
        navIndex: {
            childOpen: 'tab:isOpen',
            type: 'tabs',
            go: tabChange
        }
    },option);
    
    
    // components
    Component.NavIndex.call(this,Pojo.replace($option.navIndex,{target: $option.target}));
    
    
    // handler
    setHdlr(this,'tabs:setupGoValue',function(value) {
        return (value == null)? 'first':value;
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindTab.call(this);
    });

    aelOnce(this,'component:setupAndGo',function(event,value) {
        trigSetup(this);
        value = trigHdlr(this,'tabs:setupGoValue',value);
        trigHdlr(this,'tabs:go',value);
    });
    
    
    // bindTab
    const bindTab = function()
    {
        const $this = this;
        const tabs = trigHdlr(this,'tabs:getTargets');
        
        // components
        Component.InitOpenClose.call(tabs,'tab',$option.attr);
        
        // handler
        setHdlrs(this,'tab:',{
            isEmpty: function() {
                return $(this).is(":empty");
            },
            
            getTabs: function() {
                return $this;
            }
        });
    }
    
    return this;
}