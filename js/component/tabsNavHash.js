/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tabsNavHash
// tabNav component which triggers a hash change
const TabsNavHash = Component.TabsNavHash = function(option)
{
    // option
    const $option = Object.assign({
        hash: 'data-hash'
    },option);
    
    
    // components
    Component.TabsNav.call(this,$option);
    Component.HashChange.call(this);
    
    
    // handler
    setHdlrs(this,'tabsNavHash:',{
        
        isHash: function(value) {
            return (trigHdlr(this,'tabsNavHash:getHash',value) != null);
        },
        
        getHash: function(value) {
            return Arr.find(trigHdlr(this,'tabs:getTargets'),function() {
                return (trigHdlr(this,'tab:getHash') === value);
            });
        },
        
        goHash: function(value) {
            const tab = trigHdlr(this,'tabsNavHash:getHash',value);
            if(tab != null)
            trigHdlr(this,'tabs:go',tab);
        },
        
        getCurrentHash: function() {
            const tab = trigHdlr(this,'tabs:getCurrent');
            if(tab != null)
            return trigHdlr(tab,'tab:getHash');
        },
        
        setupFragment: function() {
            return Request.fragment();
        }
    });
    
    setHdlr(this,'tabs:setupGoValue',function(value) {
        let r = 'first';
        
        if(value === true)
        value = trigHdlr(this,'tabsNavHash:setupFragment');
        
        if(Str.isNotEmpty(value))
        {
            const node = trigHdlr(this,'tabsNavHash:getHash',value);
            if(node != null)
            r = node;
        }
        
        return r;
    });
    
    
    // event
    ael(this,'hash:change',function() {
        const hash = Request.fragment();
        const current = trigHdlr(this,'tabsNavHash:getCurrentHash');
        
        if(Str.isNotEmpty(hash) && !Str.isEqual(hash,current))
        trigHdlr(this,'tabsNavHash:goHash',hash);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindTab.call(this);
    });
    
    
    // bindTab
    const bindTab = function()
    {
        const tabs = trigHdlr(this,'tabs:getTargets');
        
        setHdlr(tabs,'tab:getHash',function() {
            return $(this).attr($option.hash);
        });
    }
    
    return this;
}