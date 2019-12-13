/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tabsHash
// adds hashchange support for the tab
const TabsHash = Component.TabsHash = function(option)
{
    // option
    const $option = Pojo.replace({
        hash: 'data-hash'
    },option);
    
    
    // components
    Component.HashChange.call(this);
    
    
    // handler
    setHdlrs(this,'tabsHash:',{
        
        isHash: function(value) {
            return (trigHdlr(this,'tabsHash:getHash',value) != null);
        },
        
        getHash: function(value) {
            return Arr.find(trigHdlr(this,'tabs:getTargets'),function() {
                return (trigHdlr(this,'tab:getHash') === value);
            });
        },
        
        goHash: function(value) {
            const tab = trigHdlr(this,'tabsHash:getHash',value);
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
        value = trigHdlr(this,'tabsHash:setupFragment');
        
        if(Str.isNotEmpty(value))
        {
            const node = trigHdlr(this,'tabsHash:getHash',value);
            if(node != null)
            r = node;
        }
        
        return r;
    });
    
    
    // event
    ael(this,'hash:change',function() {
        const hash = Request.fragment();
        const current = trigHdlr(this,'tabsHash:getCurrentHash');
        
        if(Str.isNotEmpty(hash) && !Str.isEqual(hash,current))
        trigHdlr(this,'tabsHash:goHash',hash);
    });
    
    ael(this,'tabs:afterChange',function(event,tab,oldTab) {
        const hash = Request.fragment();
        const current = trigHdlr(this,'tabsHash:getCurrentHash');
        
        if(hash == null && Str.isNotEmpty(current))
        trigHdlr(document,'history:replaceHash',current);
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
            return getAttr(this,$option.hash);
        });
    }
    
    return this;
}