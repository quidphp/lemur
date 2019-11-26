"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// modal
// script with behaviours for a modal component (popup in a fixed div)

// modal
// gère les comportents pour une l'ouverture et la fermeture d'un overlay modal
quid.core.modal = function()
{
    // event + keyboard
    quid.main.event.block.call(this,'modal:fetch');
    quid.main.keyboard.escape.call(this,true);
    
    // triggerHandler
    $(this).on('modal:getBox', function(event) {
        return $(this).find(".box").first();
    })
    .on('modal:getInner', function(event) {
        return $(this).triggerHandler('modal:getBox').find(".inner").first();
    })
    .on('modal:isEmpty', function(event) {
        return ($(this).triggerHandler('modal:getInner').html().length > 0)? false:true;
    })
    .on('modal:isOpen', function(event) {
        var status = $(this).attr('data-status');
        return (status === 'loading' || status === 'ready')? true:false;
    })
    .on('modal:isReady', function(event) {
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
    .on('modal:close', function(event) {
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
    .on('escape:blocked', function(event) {
        $(this).trigger('modal:close');
    })
    
    // event
    .on('click', function(event) {
        $(this).trigger('modal:close');
    })
    .on('click', '.close', function(event) {
        var modal = $(event.delegateTarget);
        modal.trigger('modal:close');
        event.stopImmediatePropagation();
    })
    
    // setup
    .one('modal:setup', function(event) {
        var modal = $(this);
        var box = $(this).triggerHandler('modal:getBox');
        
        box.on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', '.close', function(event) {
            modal.trigger('modal:close');
            event.stopPropagation();
        });
        
        $(document).on('document:unmount', function(event) {
            modal.trigger('modal:close');
        });
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
    
    return this;
}


// modalAjax
// gère les comportements pour les éléments qui ouvre le modal et y injecte du contenu via ajax
quid.core.modalAjax = function(modal)
{
    quid.main.event.block.call(this,'click');
    quid.main.ajax.bind.call(this,'click');
    
    // trigger
    $(this).on('ajax:beforeSend', function() {
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
    .on('modal:close', function(event) {
        $(this).removeClass('selected');
    })
    
    // setup
    .one('modalAjax:setup', function(event) {
        var $this = $(this);
        modal.on('modal:close', function(event) {
            $this.trigger('modal:close');
        });
    })
    .trigger('modalAjax:setup');
    
    return this;
}


// modalExternal
// permet de gérer l'ouverture du modal lors du clique sur un lien externe
quid.core.modalExternal = function(modal,href,route)
{
    if(quid.base.str.isNotEmpty(href))
    {
        $(this).find("a:external:not(.external)").off('click').on('click', function(event) {
            event.preventDefault();
            var uri = $(this).attr('href');
            modal.trigger('modal:fetch',[href,{v: uri},route]);
        });
    }
    
    return this;
}


// modalMailto
// permet de gérer l'ouverture du modal lors du clique sur un lien mailto
quid.core.modalMailto = function(modal,href,route)
{
    if(quid.base.str.isNotEmpty(href))
    {
        $(this).find("a[href^='mailto:']:not(.mailto)").off('click').on('click', function(event) {
            event.preventDefault();
            var email = quid.base.email.fromHref($(this).attr('href'));
            modal.trigger('modal:fetch',[href,{v: email},route])
        });
    }
    
    return this;
}