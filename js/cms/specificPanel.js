/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
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
            return Arr.find(trigHdlr(this,'tabs:getTargets'),function() {
                return Nod.match(this,"[data-current-panel='1']");
            });
        },
        
        getLinks: function() {
            return qsa(document,"a.hash-follow");
        }
    });
    
    setHdlr(this,'navHash:setupFragment',function() {
        const currentPanel = trigHdlr(this,'specificPanel:getCurrentPanel');
        return (currentPanel != null)? trigHdlr(currentPanel,'tab:getHash'):Request.fragment();
    });
    
    
    // event
    ael(this,'tabs:afterChange',function(event,tab,oldTab) {
        const hash = trigHdlr(tab,'tab:getHash');
        const input = trigHdlr(this,'specificPanel:getInput');
        const links = trigHdlr(this,'specificPanel:getLinks');
        trigHdlr(input,'input:setValue',hash);
        
        Arr.each(links,function() {
            this.hash = hash;
        });
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