"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// ajax
// script with some additional logic over the jQuery ajax object


// parseError
// cette méthode gère l'affichage pour un xhr en erreur
quid.core.parseError = function(xhr,textStatus)
{
    var r = textStatus || null;
    
    if(quid.base.isStringNotEmpty(xhr.responseText))
    {
        r = xhr.responseText;
        var html;
        var parse = quid.core.parseHtmlDocument(xhr.responseText);
        
        if(parse instanceof jQuery && parse.length)
        {
            html = parse.find(".ajax-parse-error").first().html();
            
            if(quid.base.isStringNotEmpty(html))
            r = html;
            
            else
            {
                html = parse.find("[data-tag='body']").first().html();
                
                if(quid.base.isStringNotEmpty(html))
                r = html;
            }
        }
    }
    
    return r;
}


// ajax
// charge un lien ou un formulaire via ajax
// un événement est requis
quid.core.ajax = $.fn.ajax = function(type) 
{
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).on(type, function(event) {
            event.stopPropagation();
            $(this).triggerHandler('ajax:trigger',[null,true,event]);
        }).ajaxEvents();
    }
    
    return this;
}


// ajaxEvents
// lit un élément aux événements ajax
quid.core.ajaxEvents = $.fn.ajaxEvents = function()
{
    $(this).on('ajax:progress ajax:beforeSend ajax:before ajax:success ajax:error ajax:complete', function(event) {
        event.stopPropagation();
    })
    .on('ajax:trigger', function(event,config,tag,triggerEvent) {
        event.stopImmediatePropagation();
        var r = quid.core.ajaxTrigger.call(this,config,tag);

        if(r !== false && triggerEvent)
        {
            triggerEvent.stopImmediatePropagation();
            triggerEvent.preventDefault();
        }
        
        return r;
    });
    
    return this;
}


// ajaxTrigger
// fonction privé utilisé pour lancer une requête ajax
// retourne false ou un objet promise ajax
quid.core.ajaxTrigger = $.fn.ajaxTrigger = function(config,tag)
{
    var r = null;
    var $this = $(this);
    
    var options = {
        url: $(this).triggerHandler('ajax:getHref'),
        method: $(this).triggerHandler('ajax:getMethod'),
        timeout: $(this).triggerHandler('ajax:getTimeout') || 5000,
        data: $(this).triggerHandler('ajax:getData'),
        processData: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        xhr: function() {
            var r = this.originalXHR;
            
            if(r == null)
            {
                r = this.originalXHR = new XMLHttpRequest()
                this.xhrProgress();
            }
            
            return r;
        },
        xhrProgress: function() {
            var xhr = this.xhr();
            var $this = this;
            xhr.upload.addEventListener("progress", function(event) {
                if(event.lengthComputable === true)
                {
                    var percent = parseInt((event.loaded / event.total * 100));
                    $this.progress(percent,event);
                }
            });
        },
        progress: function(percent,progressEvent) {
            $this.trigger('ajax:progress',[percent,progressEvent]);
        },
        beforeSend: function(jqXHR,settings) {
            $this.trigger('ajax:beforeSend',[jqXHR,settings]);
        },
        success: function(data,textStatus,jqXHR) {
            $this.trigger('ajax:success',[data,textStatus,jqXHR]);
        },
        error: function(jqXHR,textStatus,errorThrown) {
            $this.trigger('ajax:error',[jqXHR,textStatus,errorThrown]);
        },
        complete: function(jqXHR,textStatus) {
            $this.trigger('ajax:complete',[jqXHR,textStatus]);
        }
    };
    
    config = $.extend({},options,config);
    
    if(tag === true)
    quid.core.ajaxConfigFromTag.call(this,config);
    
    if(quid.base.isStringNotEmpty(config.url) && $(this).triggerHandler('ajax:confirm') !== false)
    {
        if(config.method == null)
        config.method = 'get';
        config.method = config.method.toUpperCase();
        
        if(config.data instanceof FormData)
        {
            config.processData = false;
            config.contentType = false;
        }

        $(this).trigger('ajax:before',[config]);

        r = $.ajax(config);
    }
    
    return r;
}


// ajaxConfigFromTag
// met à jour le tableau de config à partir de la tag
quid.core.ajaxConfigFromTag = $.fn.ajaxConfigFromTag = function(r)
{
    var tagName = $(this).tagName();
    
    if(r.url == null)
    r.url = (tagName === 'form')? $(this).prop("action"):($(this).prop("href") || $(this).data('href'));
    
    if(r.method == null)
    r.method = (tagName === 'form')? $(this).prop("method"):$(this).data("method");
    
    if(r.data == null)
    {
        if(tagName === 'form')
        {
            var formData = new FormData($(this)[0]);
            var clicked = $(this).triggerHandler('form:getClickedSubmit');
            
            if(clicked.length && quid.base.isStringNotEmpty(clicked.attr('name')))
            formData.append(clicked.attr('name'),clicked.val());
            
            r.data = formData;
        }
        
        else
        r.data = $(this).data('data');
    }
    
    return r;
}


// ajaxBlock
// intègre la logique ajax, block et loading via une même méthode
quid.core.ajaxBlock = $.fn.ajaxBlock = function(type)
{
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).block(type).ajax(type)
        .on('ajax:before', function(event) {
            $(this).attr('data-status','loading');
            $(this).trigger('block');
        })
        .on('ajax:error', function(event) {
            $(this).attr("data-status",'error');
        })
        .on('ajax:success', function(event) {
            $(this).attr("data-status",'ready');
        })
        .on('ajax:complete', function(event) {
            $(this).trigger('unblock');
        });
    }
    
    return this;
}