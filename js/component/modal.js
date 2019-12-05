/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// modal
// script for a modal component (popup in a fixed div)
const Modal = function()
{
    // nodes
    const $nodes = this;
    
    
    // event + keyboard
    Component.BlockEvent.call(this,'modal:fetch');
    Component.KeyboardEscape.call(this,true);
    
    
    // func
    setFunc(this,'modal:getBox',function() {
        return qs(this,'.box');
    });
    
    setFunc(this,'modal:getInner',function() {
        const box = triggerFunc(this,'modal:getBox');
        return qs(box,".inner");
    });
    
    setFunc(this,'modal:isEmpty',function() {
        const inner = triggerFunc(this,'modal:getInner');
        return ($(inner).html().length > 0)? false:true;
    });
    
    setFunc(this,'modal:isOpen',function() {
        const status = $(this).attr('data-status');
        return (status === 'loading' || status === 'ready')? true:false;
    });
    
    setFunc(this,'modal:isReady',function() {
        return ($(this).attr('data-status') === 'ready')? true:false;
    });
    
    setFunc(this,'modal:anchorBind',function(anchor) {
        anchorBind.call(this,anchor);
    });
    
    setFunc(this,'modal:set',function(data,route) {
        if(!triggerFunc(this,'modal:isOpen'))
        triggerCustom(this,'modal:open',route);
        
        const inner = triggerFunc(this,'modal:getInner');
        $(inner).html(data);
        opened.call(this);
    });
    
    
    // custom
    ael(this,'modal:open',function(event,route) {
        $(this).attr('data-status','loading');
        
        if(Str.isNotEmpty(route))
        $(this).attr('data-route',route);
        
        const background = triggerFunc(document,'doc:getBackground');
        triggerFunc(background,'background:set','modal',true);
        triggerCustom(document,'clickOutside:click');
    });
    
    ael(this,'modal:close',function() {
        if(triggerFunc(this,'modal:isOpen'))
        {
            $(this).removeAttr('data-route');
            
            const inner = triggerFunc(this,'modal:getInner');
            $(inner).html("");
            $(this).attr('data-status','inactive');
            
            const background = triggerFunc(document,'doc:getBackground');
            triggerFunc(background,'background:unset','modal');
        }
    });
    
    ael(this,'modal:fetch',function(event,href,args,route) {
        const modal = $(this);
        
        triggerFunc(this,'blockEvent:block','modal:fetch');
        triggerCustom(this,'modal:open',route);
        
        const config = {
            uri: href, 
            data: args,
            sucess: function(data,textStatus,jqXHR) {
                triggerFunc(modal,'modal:set',data,route);
                triggerFunc(modal,'blockEvent:unblock','modal:fetch');
            },
            error: function(data,textStatus,jqXHR) {
                triggerFunc(modal,'modal:set',Xhr.parseError(jqXHR.responseText,textStatus),route);
                triggerFunc(modal,'blockEvent:unblock','modal:fetch');
            }
        };
        Xhr.trigger(this,config);
    });
    
    ael(this,'keyboard:escape:blocked',function() {
        triggerCustom(this,'modal:close');
    });
    
    
    // event
    ael(this,'click',function() {
        triggerCustom(this,'modal:close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        boxBind.call(this);
        documentBind.call(this);
    });
    
    
    // opened 
    const opened = function() 
    {
        const modal = $(this);
        const route = $(this).attr('data-route');
        $(this).attr('data-status','ready');
        
        triggerCustom(document,'doc:mountCommon',modal);
        triggerCustom(document,'modal:common',modal);
        triggerCustom(this,'modal:success',route);
        
        const box = triggerFunc(this,'modal:getBox');
        if($(box).is('[tabindex]'))
        $(box).focus();
        
        if(Str.isNotEmpty(route))
        triggerCustom(document,'modal:'+route,modal);
    }
    
    
    // boxBind
    const boxBind = function() 
    {
        const modal = $(this);
        const box = triggerFunc(this,'modal:getBox');
        
        ael(box,'click',function(event) {
            event.stopPropagation();
        });
        
        aelDelegate(box,'click','a',function(event) {
            const href = $(this).attr('href');
            triggerCustom(document,'doc:go',href,event);
        });
        
        aelDelegate(box,'click','button.close',function(event) {
            triggerCustom(modal,'modal:close');
            event.stopPropagation();
        });
    }
    
    
    // documentBind
    const documentBind = function() 
    {
        const modal = $(this);
        
        setFunc(document,'doc:getModal',function() {
            return modal;
        });
        
        ael(document,'doc:mountCommon',function(event,node) {
            const anchor = qsa(node,"a[data-modal]");
            triggerFunc(modal,'modal:anchorBind',anchor);
        });
        
        ael(document,'doc:unmount',function() {
            triggerCustom(modal,'modal:close');
        });
    }
    
    
    // anchorBind
    const anchorBind = function(anchor) 
    {
        const modal = $(this);
        Component.BlockEvent.call(anchor,'click');
        Component.Ajax.call(anchor,'click');
        
        // func
        setFunc(anchor,'ajax:before',function() {
            const route = $(this).data('modal');
            triggerFunc(this,'blockEvent:block','click');
            $(this).addClass('selected');
            triggerCustom(modal,'modal:open',route);
        });
        
        setFunc(anchor,'ajax:success',function(data,textStatus,jqXHR) {
            const route = $(this).data('modal');
            triggerFunc(modal,'modal:set',data,route);
            triggerCustom(this,'modal:success',modal);
        });
        
        setFunc(anchor,'ajax:error',function(parsedError,jqXHR,textStatus,errorThrown) {
            const route = $(this).data('modal');
            triggerFunc(modal,'modal:set',parsedError,route);
            triggerFunc(this,'blockEvent:unblock','click');
        });
        
        // event
        ael(anchor,'modal:success',function(event,modal) {
            triggerFunc(this,'blockEvent:unblock','click');
        });
        
        ael(anchor,'modal:close',function() {
            $(this).removeClass('selected');
        });
        
        // setup
        aelOnce(anchor,'anchor:setup',function() {
            const $anchor = this;
            
            ael(modal,'modal:close',function() {
                triggerCustom($anchor,'modal:close');
            });
        });
        
        // trigger setup
        triggerCustom(anchor,'anchor:setup');
    }
    
    return this;
}

// export
Component.Modal = Modal;