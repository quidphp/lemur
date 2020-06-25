/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specificPanel
// component that manages the panel on the specific form page of the CMS
Component.SpecificPanel = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        navHash: {
            type: 'tabs',
            child: 'tab'
        },
        navClickTrigger: false,
        target: "> .form-inner > .panel",
        nav: "> .form-top .left ul li a"
    },option);
    
    
    // components
    Component.TabsNav.call(this,$option);
    Component.NavHash.call(this,$option.navHash);
    
    
    // handler
    setHdlrs(this,'specificPanel:',{
        
        getInput: function() {
            return qs(this,"input[name='-panel-']");
        },
        
        getCurrentPanel: function() {
            return Arr.find(trigHdlr(this,'tabs:getTargets'),function(ele) {
                return Ele.match(ele,"[data-current-panel='1']");
            });
        }
    });
    
    setHdlr(this,'navHash:setupFragment',function() {
        const currentPanel = trigHdlr(this,'specificPanel:getCurrentPanel');
        return (currentPanel != null)? trigHdlr(currentPanel,'tab:getHash'):Request.fragment();
    });
    
    
    // event
    ael(this,'specificPanel:setHash',function(event,hash) {
        const input = trigHdlr(this,'specificPanel:getInput');
        if(input != null)
        trigHdlr(input,'input:setValue',hash);
    });
    
    ael(this,'tabs:afterChange',function(event,tab,oldTab) {
        const hash = trigHdlr(tab,'tab:getHash');
        
        if(Str.is(hash))
        trigEvt(this,'specificPanel:setHash',hash);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindTab.call(this);
    });
    
    
    // bindTab
    const bindTab = function() 
    {
        const tabs = trigHdlr(this,'tabs:getTargets');
        
        ael(tabs,'tab:opened',function(event,isInit) {
            if(isInit === true)
            trigEvt(document,'specificForm:tabInit',this);
            
            trigEvt(document,'specificForm:tabOpened',this);
        });
    }
    
    return this;
}