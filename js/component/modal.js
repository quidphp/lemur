/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// modal
// script for a modal component (popup in a fixed div)
Component.Modal = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        background: 'modal',
        clickOutsidePersistent: true
    },option);
    
    
    // components
    Component.ClickOpenAjax.call(this,$option);
    
    
    // handler
    setHdlrs(this,'modal:',{
        
        getBox: function() {
            return qs(this,'.box');
        },
        
        getInner: function() {
            const box = trigHdlr(this,'modal:getBox');
            return qs(box,".inner");
        },
        
        getRoute: function() {
            return getAttr(this,'data-route');
        },
        
        setRoute: function(route) {
            if(Str.isNotEmpty(route))
            setAttr(this,'data-route',route);
            else
            Ele.removeAttr(this,'data-route');
        },
        
        getRouteAnchors: function(route) {
            return getData(this,'data-route-anchor') || qsa(document,"a[data-modal='"+route+"']");
        },
        
        setRouteAnchor: function(value) {
            Ele.check(value,false);
            setData(this,'data-route-anchor',value);
        },
        
        anchorBind: function(anchor,click) {
            anchorBind.call(this,anchor,click);
        },
        
        set: function(route,html,anchor) {
            Str.check(route,true);
            Str.check(html,true);
            
            trigHdlr(this,'modal:setRoute',route);
            trigHdlr(this,'modal:setRouteAnchor',anchor);
            trigHdlr(this,'clickOpen:setTargetContent',html);
            trigEvt(this,'clickOpen:open');
        },
        
        fetchNode: function(node) {
            const config = Xhr.configFromNode(node);
            const route = getAttr(node,'data-modal');
            return trigHdlr(this,'modal:fetch',config,route);
        },
        
        fetch: function(config,route,anchor) {
            let r = false;
            
            if(Str.isNotEmpty(config))
            config = Xhr.configFromString(config);
            
            if(Pojo.isNotEmpty(config))
            {
                trigHdlr(this,'modal:setRoute',route);
                trigHdlr(this,'modal:setRouteAnchor',anchor);
                trigHdlr(this,'ajax:init',config);
                r = true;
            }
            
            return r;
        }
    });
    
        
    setHdlr(this,'clickOpen:getTargetContent',function() {
        return trigHdlr(this,'modal:getInner');
    });
    
    setHdlr(this,'clickOpen:getTargetFocus',function() {
        return trigHdlr(this,'modal:getBox');
    });
    
    
    // event
    ael(this,'clickOpen:opened',function() {
        const route = trigHdlr(this,'modal:getRoute');

        if(Str.isNotEmpty(route))
        {
            const anchors = trigHdlr(this,'modal:getRouteAnchors',route);
            trigHdlrs(anchors,'modal:open');
        }
    });
    
    ael(this,'clickOpen:ajaxSuccess',function() {
        const route = trigHdlr(this,'modal:getRoute');
        trigEvt(document,'modal:common',this);
        
        if(Str.isNotEmpty(route))
        trigEvt(document,'modal:'+route,this);
    });
    
    ael(this,'clickOpen:reopen',function() {
        trigHdlr(this,'clickOpen:unsetTargetContent');
        trigEvt(this,'clickOpen:opened',false);
    });
    
    ael(this,'clickOpen:closed',function() {
        const route = trigHdlr(this,'modal:getRoute');
        if(Str.isNotEmpty(route))
        {
            const anchors = trigHdlr(this,'modal:getRouteAnchors',route);
            trigHdlrs(anchors,'modal:close');
        }
        
        trigHdlr(this,'modal:setRoute',null);
        trigHdlr(this,'modal:setRouteAnchor',null);
    });
    
    ael(this,'click',function() {
        trigEvt(this,'clickOpen:close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        boxBind.call(this);
        documentBind.call(this);
    });
    
    
    // boxBind
    const boxBind = function() 
    {
        const modal = this;
        const box = trigHdlr(this,'modal:getBox');
        
        ael(box,'click',function() {
            event.stopPropagation();
        });
        
        aelDelegate(box,'click','button.close',function(event) {
            trigEvt(modal,'clickOpen:close');
        });
    }
    
    
    // documentBind
    const documentBind = function() 
    {
        const modal = this;
        
        setHdlr(document,'doc:getModal',function() {
            return modal;
        });
        
        ael(document,'doc:mountCommon',function(event,node) {
            const anchor = qsa(node,"a[data-modal]");
            trigHdlr(modal,'modal:anchorBind',anchor,true);
        });
        
        ael(document,'doc:unmountPage',function() {
            trigEvt(modal,'clickOpen:close');
        });
    }
    
    
    // anchorBind
    const anchorBind = function(anchor,click) 
    {
        const modal = this;
        
        setHdlr(anchor,'modal:open',function() {
            toggleClass(this,'selected',true);
        });
        
        setHdlr(anchor,'modal:close',function() {
            toggleClass(this,'selected',false);
        });
        
        if(click === true)
        {
            ael(anchor,'click',function(event) {
                let r = true;
                const result = trigHdlr(modal,'modal:fetchNode',this);
                
                if(result === true)
                {
                    Evt.preventStop(event);
                    r = false;
                }
                
                return r;
            });
        }
    }
    
    return this;
}