/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// modal
// script for a modal component (popup in a fixed div)
const Modal = Component.Modal = function(option)
{
    // option
    const $option = Object.assign({
        background: 'modal'
    },option);
    
    
    // components
    Component.ClickOpenAjax.call(this,$option);
    
    
    // handler
    setHdlr(this,'modal:getBox',function() {
        return qs(this,'.box');
    });
    
    setHdlr(this,'modal:getInner',function() {
        const box = trigHdlr(this,'modal:getBox');
        return qs(box,".inner");
    });
    
    setHdlr(this,'modal:getRoute',function() {
        return $(this).attr('data-route');
    });
    
    setHdlr(this,'modal:setRoute',function(route) {
        if(Str.isNotEmpty(route))
        $(this).attr('data-route',route);
        else
        $(this).removeAttr('data-route');
    });
    
    setHdlr(this,'modal:getRouteAnchors',function(route) {
        return qsa(document,"a[data-modal='"+route+"']");
    });
    
    setHdlr(this,'modal:anchorBind',function(anchor) {
        anchorBind.call(this,anchor);
    });
    
    setHdlr(this,'modal:fetchNode',function(node) {
        const config = Xhr.configFromNode(node);
        const route = $(node).attr('data-modal');
        return trigHdlr(this,'modal:fetch',config,route);
    });
    
    setHdlr(this,'modal:fetch',function(config,route) {
        let r = false;
        
        if(Pojo.isNotEmpty(config))
        {
            trigHdlr(this,'modal:setRoute',route);
            trigHdlr(this,'ajax:init',config);
            r = true;
        }
        
        return r;
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
    
    ael(this,'clickOpen:closed',function() {
        const route = trigHdlr(this,'modal:getRoute');
        if(Str.isNotEmpty(route))
        {
            const anchors = trigHdlr(this,'modal:getRouteAnchors',route);
            trigHdlrs(anchors,'modal:close');
        }
        
        trigHdlr(this,'modal:setRoute',null);
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
            trigHdlr(modal,'modal:anchorBind',anchor);
        });
        
        ael(document,'doc:unmount',function() {
            trigEvt(modal,'clickOpen:close');
        });
    }
    
    
    // anchorBind
    const anchorBind = function(anchor) 
    {
        const modal = this;
        
        setHdlr(anchor,'modal:open',function() {
            $(this).addClass('selected');
        });
        
        setHdlr(anchor,'modal:close',function() {
            $(this).removeClass('selected');
        });
        
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
    
    return this;
}