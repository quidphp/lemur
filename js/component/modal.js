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
    setHandler(this,'modal:getBox',function() {
        return qs(this,'.box');
    });
    
    setHandler(this,'modal:getInner',function() {
        const box = trigHandler(this,'modal:getBox');
        return qs(box,".inner");
    });
    
    setHandler(this,'modal:getRoute',function() {
        return $(this).attr('data-route');
    });
    
    setHandler(this,'modal:setRoute',function(route) {
        if(Str.isNotEmpty(route))
        $(this).attr('data-route',route);
        else
        $(this).removeAttr('data-route');
    });
    
    setHandler(this,'modal:getRouteAnchors',function(route) {
        return qsa(document,"a[data-modal='"+route+"']");
    });
    
    setHandler(this,'modal:anchorBind',function(anchor) {
        anchorBind.call(this,anchor);
    });
    
    setHandler(this,'modal:fetchNode',function(node) {
        const config = Xhr.configFromNode(node);
        const route = $(node).attr('data-modal');
        return trigHandler(this,'modal:fetch',config,route);
    });
    
    setHandler(this,'modal:fetch',function(config,route) {
        let r = false;
        
        if(Pojo.isNotEmpty(config))
        {
            trigHandler(this,'modal:setRoute',route);
            trigHandler(this,'ajax:init',config);
            r = true;
        }
        
        return r;
    });
    
    setHandler(this,'clickOpen:getTargetContent',function() {
        return trigHandler(this,'modal:getInner');
    });
    
    setHandler(this,'clickOpen:getTargetFocus',function() {
        return trigHandler(this,'modal:getBox');
    });
    
    
    // event
    ael(this,'clickOpen:open',function() {
        const route = trigHandler(this,'modal:getRoute');
        
        if(Str.isNotEmpty(route))
        {
            const anchors = trigHandler(this,'modal:getRouteAnchors',route);
            trigHandlers(anchors,'modal:open');
        }
    });
    
    ael(this,'clickOpen:loaded',function() {
        const route = trigHandler(this,'modal:getRoute');
        trigEvt(document,'modal:common',this);
        
        if(Str.isNotEmpty(route))
        trigEvt(document,'modal:'+route,this);
    });
    
    ael(this,'clickOpen:close',function() {
        const route = trigHandler(this,'modal:getRoute');
        if(Str.isNotEmpty(route))
        {
            const anchors = trigHandler(this,'modal:getRouteAnchors',route);
            trigHandlers(anchors,'modal:close');
        }
        
        trigHandler(this,'modal:setRoute',null);
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
        const box = trigHandler(this,'modal:getBox');
        
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
        
        setHandler(document,'doc:getModal',function() {
            return modal;
        });
        
        ael(document,'doc:mountCommon',function(event,node) {
            const anchor = qsa(node,"a[data-modal]");
            trigHandler(modal,'modal:anchorBind',anchor);
        });
        
        ael(document,'doc:unmount',function() {
            trigEvt(modal,'clickOpen:close');
        });
    }
    
    
    // anchorBind
    const anchorBind = function(anchor) 
    {
        const modal = this;
        
        setHandler(anchor,'modal:open',function() {
            $(this).addClass('selected');
        });
        
        setHandler(anchor,'modal:close',function() {
            $(this).removeClass('selected');
        });
        
        ael(anchor,'click',function(event) {
            let r = true;
            const result = trigHandler(modal,'modal:fetchNode',this);
            
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