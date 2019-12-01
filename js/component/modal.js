/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// modal
// script for a modal component (popup in a fixed div)
const Modal = function()
{
    // event + keyboard
    Component.block.call(this,'modal:fetch');
    Component.keyboardEscape.call(this,true);
    
    // func
    setFunc(this,'modal:getBox', function() {
        return $(this).find(".box").first();
    });
    
    setFunc(this,'modal:getInner', function() {
        return triggerFunc(this,'modal:getBox').find(".inner").first();
    });
    
    setFunc(this,'modal:isEmpty', function() {
        return ($triggerFunc(this,'modal:getInner').html().length > 0)? false:true;
    });
    
    setFunc(this,'modal:isOpen', function() {
        const status = $(this).attr('data-status');
        return (status === 'loading' || status === 'ready')? true:false;
    });
    
    setFunc(this,'modal:isReady', function() {
        return ($(this).attr('data-status') === 'ready')? true:false;
    });
    
    
    // trigger
    ael(this,'modal:open', function(event,route) {
        $(this).attr('data-status','loading');
        
        if(Str.isNotEmpty(route))
        $(this).attr('data-route',route);
        
        triggerFunc(document,'document:setBackground','modal',true);
        triggerCustom(document,'document:outsideClick');
    });
    
    ael(this,'modal:close', function() {
        if(triggerFunc(this,'modal:isOpen'))
        {
            $(this).removeAttr('data-route');
            triggerFunc(this,'modal:getInner').html("");
            $(this).attr('data-status','inactive');
            triggerFunc(document,'document:unsetBackground','modal');
        }
    });
    
    ael(this,'modal:set', function(event,data,route) {
        if(!triggerFunc(this,'modal:isOpen'))
        triggerCustom(this,'modal:open',route);
        
        triggerFunc(this,'modal:getInner').html(data);
        opened.call(this);
    });
    
    ael(this,'modal:fetch', function(event,href,args,route) {
        const modal = $(this);
        
        triggerCustom(this,'block');
        triggerCustom(this,'modal:open',route);
        
        const config = {
            uri: href, 
            data: args,
            sucess: function(data,textStatus,jqXHR) {
                triggerCustom(modal,'modal:set',data,route);
                triggerCustom(modal,'unblock');
            },
            error: function(data,textStatus,jqXHR) {
                triggerCustom(modal,'modal:set',Xhr.parseError(jqXHR.responseText,textStatus),route);
                triggerCustom(modal,'unblock');
            }
        };
        Xhr.trigger(this,config);
    });
    
    ael(this,'modal:anchorBind', function(event,anchor) {
        anchorBind.call(this,anchor);
    });
    
    ael(this,'escape:blocked', function() {
        triggerCustom(this,'modal:close');
    });
    
    
    // event
    ael(this,'click', function() {
        triggerCustom(this,'modal:close');
    });
    
    
    // delegateEvent
    $(this).on('click', '.close', function(event) {
        const modal = $(event.delegateTarget);
        triggerCustom(modal,'modal:close');
        event.stopImmediatePropagation();
    });
    
    
    // setup
    aelOnce(this,'component:setup', function() {
        boxBind.call(this);
        documentBind.call(this);
    });
    
    
    // opened 
    const opened = function() {
        const modal = $(this);
        let route = $(this).attr('data-route');
        $(this).attr('data-status','ready');
        
        triggerCustom(document,'document:mountCommon',modal);
        triggerCustom(document,'modal:common',modal);
        triggerCustom(this,'modal:success',route);
        
        const box = triggerFunc(this,'modal:getBox');
        if(box.is('[tabindex]'))
        box.focus();
        
        if(Str.isNotEmpty(route))
        triggerCustom(document,'modal:'+route,modal);
    };
    
    
    // boxBind
    const boxBind = function() {
        const modal = $(this);
        const box = triggerFunc(this,'modal:getBox');
        
        ael(box,'click', function(event) {
            event.stopPropagation();
        });
        
        box.on('click', 'a', function(event) {
            const href = $(this).attr('href');
            triggerCustom(document,'document:go',href,event);
        })
        .on('click', '.close', function(event) {
            triggerCustom(modal,'modal:close');
            event.stopPropagation();
        });
    };
    
    
    // documentBind
    const documentBind = function() {
        const modal = $(this);
        
        setFunc(document,'document:getModal', function() {
            return modal;
        });
        
        ael(document,'document:mountCommon', function(event,node) {
            const anchor = node.find("a[data-modal]");
            triggerCustom(modal,'modal:anchorBind',anchor);
        });
        
        ael(document,'document:unmount', function() {
            triggerCustom(modal,'modal:close');
        });
    };
    
    
    // anchorBind
    const anchorBind = function(anchor) {
        const modal = $(this);
        Component.block.call(anchor,'click');
        Component.ajax.call(anchor,'click');
        
        // trigger
        ael(anchor,'ajax:beforeSend', function() {
            let route = $(this).data('modal');
            triggerCustom(this,'block');
            $(this).addClass('selected');
            triggerCustom(modal,'modal:open',route);
        });
        
        ael(anchor,'ajax:success', function(event,data,textStatus,jqXHR) {
            let route = $(this).data('modal');
            triggerCustom(modal,'modal:set',data,route);
            triggerCustom(this,'modal:success',modal);
        });
        
        ael(anchor,'ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
            let route = $(this).data('modal');
            triggerCustom(modal,'modal:set',parsedError,route);
            triggerCustom(this,'unblock');
        });
        
        ael(anchor,'modal:success', function(event,modal) {
            triggerCustom(this,'unblock');
        });
        
        ael(anchor,'modal:close', function() {
            $(this).removeClass('selected');
        });
        
        // setup
        aelOnce(anchor,'anchor:setup', function() {
            const $this = $(this);
            modal.on('modal:close', function() {
                triggerCustom($this,'modal:close');
            });
        });
        
        // trigger setup
        triggerCustom(anchor,'anchor:setup');
    };
    
    return this;
}

// export
Component.Modal = Modal;