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
quid.core.modal = $.fn.modal = function()
{
    $(this).each(function(index, el) {
        var modal = $(this);
        
        $(this).block('modal:get').escapeCatch()
        .on('modal:getBox', function(event) {
            return $(this).find(".box").first();
        })
        .on('modal:getInner', function(event) {
            return $(this).triggerHandler('modal:getBox').find(".inner").first();
        })
        .on('click', '.close', function(event) {
            modal.trigger('modal:closeIfOpen');
            event.stopImmediatePropagation();
        })
        .on('modal:isEmpty', function(event) {
            return ($(this).triggerHandler('modal:getInner').html().length > 0)? false:true;
        })
        .on('modal:hasText', function(event) {
            return ($(this).triggerHandler('modal:getInner').text().length > 0)? true:false;
        })
        .on('modal:isOpen', function(event) {
            var status = $(this).attr('data-status');
            return (status === 'loading' || status === 'ready')? true:false;
        })
        .on('modal:isReady', function(event) {
            return ($(this).attr('data-status') === 'ready')? true:false;
        })
        .on('modal:open', function(event,route) {
            $(this).attr('data-status','loading');
            if(quid.base.isStringNotEmpty(route))
            $(this).attr('data-route',route);
            
            $(document).trigger('document:setBackground',['modal',true]);
            $(document).trigger('document:outsideClick');
        })
        .on('modal:opened', function(event) {
            $(this).attr('data-status','ready');
            
            if($(this).is('[tabindex]'))
            $(this).focus();
        })
        .on('modal:html', function(event,data,callback) {
            if(!$(this).triggerHandler('modal:isOpen'))
            $(this).trigger('modal:open');
            
            $(this).trigger('modal:opened');
            $(this).triggerHandler('modal:getInner').html(data);
            
            if($.isFunction(callback))
            callback.call();
        })
        .on('modal:closeIfOpen', function(event) {
            if($(this).triggerHandler('modal:isOpen'))
            $(this).trigger('modal:close');
        })
        .on('modal:close', function(event) {
            $(this).removeAttr('data-route');
            $(this).triggerHandler('modal:getInner').html("");
            $(this).attr('data-status','inactive');
            $(document).trigger('document:unsetBackground',['modal']);
        })
        .on('modal:openSelf', function(event,route) {
            $(this).trigger('modal:open',[route]);
            $(this).trigger('modal:opened');
        })
        .on('modal:get', function(event,href,args,route) {
            $(this).trigger('block');
            $(this).trigger('modal:open',[route]);
            
            var config = {
                uri: href, 
                data: args,
                sucess: function(data,textStatus,jqXHR) {
                    var callback = function() {
                        modal.trigger('modal:route');
                        modal.trigger('modal:success',[modal]);
                    };
                    modal.trigger('modal:html',[data,callback]);
                    modal.trigger('unblock');
                },
                error: function(data,textStatus,jqXHR) {
                    modal.trigger('modal:html', [quid.core.parseError(jqXHR,textStatus)]);
                    modal.trigger('unblock');
                }
            };
            quid.core.ajaxTrigger.call(this,config);
        })
        .on('modal:route', function(event) {
            var route = $(this).attr('data-route');
            $(document).trigger('document:commonBindings',[$(this)]);
            $(document).trigger('modal:common',[$(this)]);
            
            if(quid.base.isStringNotEmpty(route))
            $(document).trigger('modal:'+route,[$(this)]);
        })
        .on('escape:blocked', function(event) {
            $(this).trigger('modal:closeIfOpen');
        })
        .on('click', function(event) {
            $(this).trigger('modal:closeIfOpen');
        });
        
        // inner
        $(this).triggerHandler('modal:getBox').on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', '.close', function(event) {
            modal.trigger('modal:closeIfOpen');
            event.stopPropagation();
        });
    });
    
    return this;
}


// modalAjax
// gère les comportements pour les éléments qui ouvre le modal et y injecte du contenu via ajax
quid.core.modalAjax = $.fn.modalAjax = function(modal)
{
    $(this).block('click').ajax('click')
    .on('ajax:beforeSend', function() {
        $(this).trigger('block');
        $(this).addClass('selected');
        modal.trigger('modal:open',[$(this).data('modal')]);
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        var $this = $(this);
        var callback = function() {
            modal.trigger('modal:route');
            $this.trigger('modal:success',[modal]);
        };
        modal.trigger('modal:html',[data,callback]);
    })
    .on('ajax:confirm', function(event) {
        return ($(document).triggerHandler('document:isLoading') === true)? false:true;
    })
    .on('modal:success', function(event,modal) {
        $(this).trigger('unblock');
    })
    .on('modal:close', function(event) {
        $(this).removeClass('selected');
    })
    .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
        modal.trigger('modal:html', [quid.core.parseError(jqXHR,textStatus)]);
        $(this).trigger('unblock');
    })
    .on('modalAjax:prepare', function(event) {
        var $this = $(this);
        modal.on('modal:close', function(event) {
            $this.trigger('modal:close');
        });
    })
    .trigger('modalAjax:prepare');
    
    return this;
}


// modalExternal
// permet de gérer l'ouverture du modal lors du clique sur un lien externe
quid.core.modalExternal = $.fn.modalExternal = function(modal,href,route)
{
    if(quid.base.isStringNotEmpty(href))
    {
        $(this).find("a:external:not(.external)").off('click').on('click', function(event) {
            event.preventDefault();
            var uri = $(this).attr('href');
            modal.trigger('modal:get',[href,{v: uri},route]);
        });
    }
    
    return this;
}


// modalMailto
// permet de gérer l'ouverture du modal lors du clique sur un lien mailto
quid.core.modalMailto = $.fn.modalMailto = function(modal,href,route)
{
    if(quid.base.isStringNotEmpty(href))
    {
        $(this).find("a[href^='mailto:']:not(.mailto)").off('click').on('click', function(event) {
            event.preventDefault();
            var email = quid.base.mailto($(this).attr('href'));
            modal.trigger('modal:get',[href,{v: email},route])
        });
    }
    
    return this;
}