"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// modal
// script with behaviours for a modal component (popup in a fixed div)
quid.component.modal = function()
{
    // event + keyboard
    quid.main.event.block.call(this,'modal:fetch');
    quid.main.keyboard.escape.call(this,true);
    
    // triggerHandler
    $(this).on('modal:getBox', function() {
        return $(this).find(".box").first();
    })
    .on('modal:getInner', function() {
        return $(this).triggerHandler('modal:getBox').find(".inner").first();
    })
    .on('modal:isEmpty', function() {
        return ($(this).triggerHandler('modal:getInner').html().length > 0)? false:true;
    })
    .on('modal:isOpen', function() {
        var status = $(this).attr('data-status');
        return (status === 'loading' || status === 'ready')? true:false;
    })
    .on('modal:isReady', function() {
        return ($(this).attr('data-status') === 'ready')? true:false;
    })
    
    // trigger
    .on('modal:open', function(event,route) {
        $(this).attr('data-status','loading');
        
        if(quid.base.str.isNotEmpty(route))
        $(this).attr('data-route',route);
        
        $(document).trigger('document:setBackground',['modal',true]);
        $(document).trigger('document:outsideClick');
    })
    .on('modal:close', function() {
        if($(this).triggerHandler('modal:isOpen'))
        {
            $(this).removeAttr('data-route');
            $(this).triggerHandler('modal:getInner').html("");
            $(this).attr('data-status','inactive');
            $(document).trigger('document:unsetBackground',['modal']);
        }
    })
    .on('modal:set', function(event,data,route) {
        if(!$(this).triggerHandler('modal:isOpen'))
        $(this).trigger('modal:open',[route]);
        
        $(this).triggerHandler('modal:getInner').html(data);
        opened.call(this);
    })
    .on('modal:fetch', function(event,href,args,route) {
        var modal = $(this);
        
        $(this).trigger('block');
        $(this).trigger('modal:open',[route]);
        
        var config = {
            uri: href, 
            data: args,
            sucess: function(data,textStatus,jqXHR) {
                modal.trigger('modal:set',[data,route]);
                modal.trigger('unblock');
            },
            error: function(data,textStatus,jqXHR) {
                modal.trigger('modal:set', [quid.main.ajax.parseError(jqXHR,textStatus),route]);
                modal.trigger('unblock');
            }
        };
        quid.main.ajax.trigger.call(this,config);
    })
    .on('modal:anchorBind', function(event,anchor) {
        anchorBind.call(this,anchor);
    })
    .on('escape:blocked', function() {
        $(this).trigger('modal:close');
    })
    
    // event
    .on('click', function() {
        $(this).trigger('modal:close');
    })
    .on('click', '.close', function(event) {
        var modal = $(event.delegateTarget);
        modal.trigger('modal:close');
        event.stopImmediatePropagation();
    })
    
    // setup
    .one('component:setup', function() {
        boxBind.call(this);
        documentBind.call(this);
    });
    
    // opened 
    var opened = function() {
        var modal = $(this);
        var route = $(this).attr('data-route');
        $(this).attr('data-status','ready');
        
        $(document).trigger('document:mountCommon',[modal]);
        $(document).trigger('modal:common',[modal]);
        $(this).trigger('modal:success',[route]);
        
        var box = $(this).triggerHandler('modal:getBox');
        if(box.is('[tabindex]'))
        box.focus();
        
        if(quid.base.str.isNotEmpty(route))
        $(document).trigger('modal:'+route,[modal]);
    };
    
    // boxBind
    var boxBind = function() {
        var modal = $(this);
        var box = $(this).triggerHandler('modal:getBox');
        
        box.on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', '.close', function(event) {
            modal.trigger('modal:close');
            event.stopPropagation();
        });
    };
    
    // documentBind
    var documentBind = function() {
        var modal = $(this);
        
        $(document).on('document:getModal', function() {
            return modal;
        })
        .on('document:mountCommon', function(event,node) {
            var anchor = node.find("a[data-modal]");
            modal.trigger('modal:anchorBind',[anchor]);
        })
        .on('document:unmount', function() {
            modal.trigger('modal:close');
        });
    };
    
    // anchorBind
    var anchorBind = function(anchor) {
        var modal = $(this);
        quid.main.event.block.call(anchor,'click');
        quid.main.ajax.bind.call(anchor,'click');
        
        // trigger
        anchor.on('ajax:beforeSend', function() {
            var route = $(this).data('modal');
            $(this).trigger('block');
            $(this).addClass('selected');
            modal.trigger('modal:open',[route]);
        })
        .on('ajax:success', function(event,data,textStatus,jqXHR) {
            var route = $(this).data('modal');
            modal.trigger('modal:set',[data,route]);
            $(this).trigger('modal:success',[modal]);
        })
        .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
            var route = $(this).data('modal');
            modal.trigger('modal:set',[parsedError,route]);
            $(this).trigger('unblock');
        })
        .on('modal:success', function(event,modal) {
            $(this).trigger('unblock');
        })
        .on('modal:close', function() {
            $(this).removeClass('selected');
        })
        
        // setup
        .one('anchor:setup', function() {
            var $this = $(this);
            modal.on('modal:close', function() {
                $this.trigger('modal:close');
            });
        })
        
        // trigger setup
        .trigger('anchor:setup');
    };
    
    return this;
}