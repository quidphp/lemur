/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specificPanel
// component that manages the panel on the specific form page of the CMS
const SpecificPanel = Component.SpecificPanel = function(option)
{
    // option
    const $option = Object.assign({
        target: "> .form-inner > .panel",
        nav: "> .form-top .left ul li a"
    },option);
    
    
    // components
    Component.TabsNavHash.call(this,$option);
    
    
    // handler
    setHdlrs(this,'specificPanel:',{
        getInput: function() {
            return qs(this,"input[name='-panel-']");
        },
        
        getCurrentPanel: function() {
            return Arr.find(trigHdlr(this,'tabs:getTargets'),function() {
                return $(this).is("[data-current-panel='1']");
            });
        },
        
        getLinks: function() {
            return qsa(document,"a.hash-follow");
        }
    });
    
    setHdlr(this,'tabsNavHash:setupFragment',function() {
        const currentPanel = trigHdlr(this,'specificPanel:getCurrentPanel');
        return (currentPanel != null)? trigHdlr(currentPanel,'tab:getHash'):Request.fragment();
    });
    
    
    // event
    ael(this,'tabs:afterChange',function(event,tab,oldTab) {
        const hash = trigHdlr(tab,'tab:getHash');
        const input = trigHdlr(this,'specificPanel:getInput');
        const links = trigHdlr(this,'specificPanel:getLinks');
        
        trigHdlr(input,'input:setValue',hash);
        DomChange.hrefChangeHash(hash,links);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindTab.call(this);
    });
    
    
    // bindTab
    const bindTab = function() 
    {
        const tabs = trigHdlr(this,'tabs:getTargets');
        
        ael(tabs,'tab:init',function() {
            trigEvt(document,'specificForm:bindView',this);
        })
    }
    
    
    /*
    $(this).on('fragment:get',function(event) {
        return $(this).data('fragment');
    })
    .on('fragment:update',function(event,replaceState) {
        const current = Request.fragment();
        const fragment = trigHdlr(this,'fragment:get');
        const hasHistoryApi = trigHdlr(document,'doc:hasHistoryApi');
        
        if(current !== fragment)
        {
            if(Str.isNotEmpty(fragment))
            {
                const fragmentHash = '#'+fragment;
                
                if(hasHistoryApi === true && replaceState === true)
                trigHdlr(document,'doc:replaceState',Request.relative()+fragmentHash);
                else
                window.location.hash = fragmentHash;
            }
            
            else
            trigEvt(this,'fragment:remove',replaceState);
            
            trigEvt(this,'fragment:updated',fragment);
        }
    })
    .on('fragment:remove',function(event) {
        if(hasHistoryApi === true && replaceState === true)
        trigHdlr(document,'doc:replaceState',Request.relative());
        else
        window.location.hash = '';
    });
    */
    
    return this;
}