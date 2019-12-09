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
        background: 'modal',
        attr: 'data-modal'
    },option);
    
    
    // components
    Component.ClickOpenAjax.call(this,$option);
    
    
    // func
    setFunc(this,'modal:getBox',function() {
        return qs(this,'.box');
    });
    
    setFunc(this,'modal:getInner',function() {
        const box = triggerFunc(this,'modal:getBox');
        return qs(box,".inner");
    });
    
    setFunc(this,'modal:getRoute',function() {
        return $(this).attr('data-route');
    });
    
    setFunc(this,'modal:setRoute',function(route) {
        if(Str.isNotEmpty(route))
        $(this).attr('data-route',route);
        else
        $(this).removeAttr('data-route');
    });
    
    setFunc(this,'modal:getRouteAnchors',function(route) {
        return qsa(document,"a[data-modal='"+route+"']");
    });
    
    setFunc(this,'modal:anchorBind',function(anchor) {
        anchorBind.call(this,anchor);
    });
    
    setFunc(this,'modal:fetchNode',function(node) {
        const config = Xhr.configFromNode(node);
        const route = $(node).attr('data-modal');
        return triggerFunc(this,'modal:fetch',route,config);
    });
    
    setFunc(this,'modal:fetch',function(route,config) {
        let r = false;
        
        if(Obj.isNotEmpty(config))
        {
            triggerFunc(this,'modal:setRoute',route);
            triggerEvent(this,'ajax:init',config);
            r = true;
        }
        
        return r;
    });
    
    setFunc(this,'clickOpen:getTargetContent',function() {
        return triggerFunc(this,'modal:getInner');
    });
    
    setFunc(this,'clickOpen:getTargetFocus',function() {
        return triggerFunc(this,'modal:getBox');
    });
    
    
    // event
    ael(this,'clickOpen:open',function() {
        const route = triggerFunc(this,'modal:getRoute');
        
        if(Str.isNotEmpty(route))
        {
            const anchors = triggerFunc(this,'modal:getRouteAnchors',route);
            triggerFunc(anchors,'modal:open');
        }
    });
    
    ael(this,'clickOpen:loaded',function() {
        const route = triggerFunc(this,'modal:getRoute');
        triggerEvent(document,'modal:common',this);
        
        if(Str.isNotEmpty(route))
        triggerEvent(document,'modal:'+route,this);
    });
    
    ael(this,'clickOpen:close',function() {
        const route = triggerFunc(this,'modal:getRoute');
        if(Str.isNotEmpty(route))
        {
            const anchors = triggerFunc(this,'modal:getRouteAnchors',route);
            triggerFunc(anchors,'modal:close');
        }
        
        triggerFunc(this,'modal:setRoute',null);
    });
    
    ael(this,'click',function() {
        triggerEvent(this,'clickOpen:close');
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
        const box = triggerFunc(this,'modal:getBox');
        
        ael(box,'click',function() {
            event.stopPropagation();
        });
        
        aelDelegate(box,'click','button.close',function(event) {
            triggerEvent(modal,'clickOpen:close');
        });
    }
    
    
    // documentBind
    const documentBind = function() 
    {
        const modal = this;
        
        setFunc(document,'doc:getModal',function() {
            return modal;
        });
        
        ael(document,'doc:mountCommon',function(event,node) {
            const anchor = qsa(node,"a[data-modal]");
            triggerFunc(modal,'modal:anchorBind',anchor);
        });
        
        ael(document,'doc:unmount',function() {
            triggerEvent(modal,'clickOpen:close');
        });
    }
    
    
    // anchorBind
    const anchorBind = function(anchor) 
    {
        const modal = this;
        
        setFunc(anchor,'modal:open',function() {
            $(this).addClass('selected');
        });
        
        setFunc(anchor,'modal:close',function() {
            $(this).removeClass('selected');
        });
        
        ael(anchor,'click',function(event) {
            let r = true;
            const result = triggerFunc(modal,'modal:fetchNode',this);
            
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