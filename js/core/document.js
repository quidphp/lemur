"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// document
// script for a document component managing site navigation with the HistoryAPI

// document
// classe qui gère la navigation du document via history api
quid.core.document = $.fn.document = function(option) 
{
    var $settings = {
        anchor: "a:internal:not([target='_blank']):not([data-navigation='0']):not([data-modal]):not([href^='mailto:'])",
        form: "form:not([data-navigation='0'])",
        background: "body > .background",
        timeout: 10000
    };
    
    if(option && typeof(option) == 'object')
    $settings = $.extend($settings, option);
    
    var $target = $(this);
    var $location = window.location;
    var $history = (hasHistoryApi())? window.history:null;
    var $initial = null;
    var $previous = null;

    
    // applyBindings
    // applique les bindings sur les clicks et popstate
    function applyBindings()
    {
        // sur le premier isTouch
        $(this).one('touchstart', function(event) {
            $(this).data('isTouch',true);
        });
        
        // click
        $(this).on('click', $settings.anchor, function(event) { 
            var r = true;
            $target.triggerHandler('document:clickEvent',[event]);
            r = (event.isDefaultPrevented())? false:true;
            
            return r;
        });
        
        // submit
        $(this).on('submit', $settings.form, function(event) { 
            var r = true;
            $target.triggerHandler('document:submitEvent',[event]);
            r = (event.isDefaultPrevented())? false:true;
            
            return r;
        });
        
        // popstate
        $(window).on('popstate',function(event) {
            var state = event.originalEvent.state || $target.triggerHandler('document:getCurrentState');
            var previous = $target.triggerHandler('document:getPreviousState');
            var isValid = isStateChangeValid(state,previous,true);
            
            if(isValid === true)
            {
                if(isUnloadValid() === true)
                makeAjax.call($target,state,event);
                
                else
                $history.pushState($previous,$previous.title,$previous.url);
            }
            
            // hash change
            else if(quid.base.isSamePathQuery(state.url,previous.url) && (quid.base.isUriHash(state.url) || quid.base.isUriHash(previous.url)))
            {
                $previous = state;
                $(this).trigger('hashchange',[event]);
            }
        });
    }
    
    
    // isStateChangeValid
    // retourne vrai si le changement de state est valide
    function isStateChangeValid(state,previous,pathQuery)
    {
        var r = false;
        
        if(isHistoryState(state) && isHistoryState(previous))
        {
            var isInternal = quid.base.isUriInternal(state.url,previous.url);
            var hasExtension = quid.base.isUriExtension(state.url);
            var isHashChange = quid.base.isHashChange(state.url,previous.url);
            var isHashSame = quid.base.isHashSame(state.url,previous.url);
            
            if(isInternal === true && hasExtension === false && isHashChange === false && isHashSame === false)
            {
                if(!pathQuery || quid.base.isSamePathQuery(state.url,previous.url) === false)
                r = true;
            }
        }
        
        return r;
    }
    
    
    // isUnloadValid
    // retourne vrai si unload est vide ou confirmé
    function isUnloadValid()
    {
        var r = false;
        var unload = $(window).triggerHandler('beforeunload');
        
        if(!quid.base.isStringNotEmpty(unload) || confirm(unload))
        r = true;
        
        return r;
    }
    
    
    // makeHistoryType
    // retourne le type d'historique
    // met à jour l'objet config si c'est form
    function makeHistoryType(config,sourceEvent)
    {
        var r = 'push';
        
        if(sourceEvent)
        {
            var target = $(sourceEvent.currentTarget);
            
            if(target && target.tagName() === 'form')
            {
                quid.core.ajaxConfigFromTag.call(target,config);
                
                if(target.triggerHandler('form:hasFiles'))
                config.timeout = 0;
                
                r = 'form';
            }
            
            else if(sourceEvent.type === 'popstate')
            r = 'popstate';
        }
        
        return r;
    }
    
    
    // makeAjax
    // crée et retourne l'objet ajax
    function makeAjax(state,sourceEvent)
    {
        var r = null;

        if(isHistoryState(state))
        {
            var $this = $(this);
            $(this).triggerHandler('document:cancelAjax');
            beforeAjax.call(this);
            
            var config = {
                url: state.url,
                timeout: $settings.timeout,
                success: function(data,textStatus,jqXHR) {
                    afterAjax.call($this,type,state,jqXHR);
                },
                progress: function(percent,event) {
                    $this.trigger('document:ajaxProgress',[percent,event]);
                },
                error: function(jqXHR,textStatus,errorThrown) {
                    if(quid.base.isStringNotEmpty(jqXHR.responseText))
                    afterAjax.call($this,type,state,jqXHR);
                    else
                    $this.triggerHandler('document:hardRedirect',state.url);
                }
            };
            
            var type = makeHistoryType(config,sourceEvent);
            r = quid.core.ajaxTrigger.call(this,config);
            
            if(r !== null)
            $(this).data('document:ajax',r);
        }
        
        return r;
    }
    

    // beforeAjax
    // callback avant le ajax
    function beforeAjax()
    {
        $(this).data('document:active',true);
        
        // loading
        $(this).trigger('document:statusLoading');
        
        // beforeUnload
        $(window).off('beforeunload');
    }
    
    
    // afterAjax
    // callback après le ajax
    function afterAjax(type,state,jqXHR)
    {
        if($.isPlainObject(jqXHR) && isHistoryState(state) && quid.base.isStringNotEmpty(type))
        {
            var data = jqXHR.responseText;
            var currentUri = jqXHR.getResponseHeader('QUID-URI');
            var current = $(this).triggerHandler('document:getCurrentState');
            
            if(quid.base.isString(data))
            {
                var doc = quid.core.parseDocument(data);
                $(this).removeData('document:active');
                
                if(type === 'push')
                {
                    state = makeHistoryState(state.url,doc.title);
                    
                    if(state.url !== current.url && current.url !== currentUri)
                    $history.pushState(state,state.title,state.url);
                }
                    
                if(state.url !== currentUri)
                {
                    if(quid.base.isUriInternal(state.url,currentUri) === false || quid.base.isSamePathQuery(state.url,currentUri) === false)
                    state = $(this).triggerHandler('document:replaceState',[currentUri,state.title]);
                }	
                    
                $(this).trigger('document:unmount');
                makeDocument.call(this,doc);
                doc.doc.remove();
                $previous = state;
            }
        }
    }
    
    
    // makeDocument
    // crée le document à partir d'un objet doc, passé dans parseDocument
    function makeDocument(doc)
    {
        var r = false;

        if($.isPlainObject(doc) && doc.body && doc.body.length)
        {
            r = true;
            
            // html
            var html = $("html");
            doc.html.removeAttr('data-tag');
            var htmlAttributes = doc.html.getAttributes();
            html.replaceAttributes(htmlAttributes,true);
            
            // head
            var head = html.find("head");
            
            // title
            var title = head.find("meta");
            if(quid.base.isStringNotEmpty(doc.title))
            {
                document.title = doc.title;
                title.html(document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; '));
            }
            
            // meta
            var meta = head.find("meta");
            meta.remove();
            if(doc.meta instanceof jQuery)
            {
                doc.meta.removeAttr('data-tag');
                doc.meta.each(function(index, el) {
                    var after = (head.find("meta").length)? head.find("meta").last():head.find("title");
                    
                    var attributes = $(this).getAttributes();
                    $("<meta>").insertAfter(after);
                    
                    var element = head.find("meta").last();
                    element.replaceAttributes(attributes);
                });
            }
            
            // body
            var body = html.find("body");
            doc.body.removeAttr('data-tag');
            var bodyAttributes = doc.body.getAttributes();
            body.replaceAttributes(bodyAttributes,true);
            body.html(doc.body.html());
            
            // after
            afterMakeDocument.call(this);
        }
        
        return r;
    }
    
    
    // afterMakeDocument
    // callback après le chargement du nouveau document
    function afterMakeDocument()
    {
        var state = $(this).triggerHandler('document:getCurrentState');

        // scrollTop
        $(this).find("html,body").stop(true,true).scrollTop(0);
        
        // trigger
        $(this).trigger('document:mount');
    }
    
    
    // hasHistoryApi
    // retourne vrai si le navigateur courant supporte history API
    function hasHistoryApi()
    {
        var r = false;
        
        if(window.history && window.history.pushState && window.history.replaceState)
        {
            if(!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))
            r = true;
        }
        
        return r;
    }


    // makeHistoryState
    // retourne un objet état d'historique (avec url, title et timestamp)
    function makeHistoryState(uri,title) 
    {
        var r = null;
        
        if(quid.base.isString(uri))
        {
            r = {
                url: uri,
                title: title || null,
                timestamp: quid.base.timestamp()
            };
        }
        
        return r;
    }


    // isHistoryState
    // retourne vrai si la valeur est un objet compatible pour un état d'historique
    function isHistoryState(state)
    {
        var r = false;
        
        if($.isPlainObject(state) && quid.base.isString(state.url) && $.isNumeric(state.timestamp))
        r = true;
        
        return r;
    }
    
    
    // isLoading
    // retourne vrai si le chargement de la navigation est présentement active
    $(this).on('document:isLoading', function(event) {
        return ($(this).data('document:active') === true)? true:false;
    })
    
    
    // hasAjax
    // retourne vrai s'il y a présentement un objet ajax en train de s'effectuer
    .on('document:hasAjax', function(event) {
        var r = false;
        var ajax = $(this).data('document:ajax');
        
        if(ajax != null && ajax.readyState < 4)
        r = true;
        
        return r;
    })
    
    
    // hasHistoryApi
    // retourne vrai si history api est activé
    .on('document:hasHistoryApi', function(event) {
        return hasHistoryApi();
    })
    
    
    // getInitialState
    // retourne l'état initial
    .on('document:getInitialState', function(event) {
        return $initial;
    })
    
    
    // getPreviousState
    // retourne l'état précédent
    .on('document:getPreviousState', function(event) {
        return $previous || $initial;
    })
    
    
    // getCurrentState
    // retourne l'état courant
    .on('document:getCurrentState', function(event) {
        return makeHistoryState($location.href,document.title);
    })
    
    
    // replaceState
    .on('document:replaceState', function(event,uri,title) {
        var r = makeHistoryState(uri,title);
        
        if(hasHistoryApi() && quid.base.isStringNotEmpty(uri))
        $history.replaceState(r,r.title,r.url);
        
        return r;
    })
    
    
    // hardRedirect
    // fait une redirection dure vers une nouvelle uri
    .on('document:hardRedirect', function(event,uri) {
        $location.href = uri;
    })
    
    
    // cancelAjax
    // annule et détruit l'objet ajax si existant
    .on('document:cancelAjax', function(event) {
        var r = false;
        
        if($(this).triggerHandler('document:hasAjax') === true)
        {
            var ajax = $(this).data('document:ajax');
            ajax.onreadystatechange = $.noop;
            ajax.abort();
        }
        
        $(this).removeData('document:ajax');
        
        return r;
    })
    
    
    // clickEvent
    // gère un nouvel historique déclenché par un clic
    .on('document:clickEvent', function(event,click) {
        var r = false;
        
        if(click.target && !(click.which > 1 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey))
        {
            var target = $(click.target);

            if(target.tagName() !== 'a')
            target = target.closest("a");
            
            if(target.is($settings.anchor))
            {
                var uri = target.prop('href');
                r = $(this).triggerHandler('document:go',[uri,click]);
            }
        }
        
        return r;
    })
    
    
    // document:submitEvent
    // gère un nouvel historique déclenché par l'envoie d'un formulaire
    .on('document:submitEvent', function(event,submit) {
        var r = false;
        var target = $(submit.target);
        
        if(target.is($settings.form))
        {
            var uri = target.prop('action');
            r = $(this).triggerHandler('document:go',[uri,submit]);
        }
        
        return r;
    })
    
    
    // document:go
    // pousse ou replace une nouvelle entrée dans l'historique
    .on('document:go', function(event,uri,sourceEvent) {
        var r = false;
        
        if($(this).triggerHandler('document:hasAjax'))
        r = true;
        
        else
        {
            if(uri instanceof jQuery && uri.is($settings.anchor))
            uri = uri.prop("href");
            
            if(quid.base.isString(uri))
            {
                var current = $(this).triggerHandler('document:getCurrentState');
                var state = makeHistoryState(uri);
                var isValid = isStateChangeValid(state,current);
                
                if(isValid === true)
                {
                    if(isUnloadValid() === true)
                    r = (makeAjax.call(this,state,sourceEvent))? true:false;
                    else
                    r = true;
                }
                
                // hash change
                else if(quid.base.isHashChange(state.url,current.url))
                {
                    r = true;
                    $history.pushState(state,state.title,state.url);
                    $previous = state;
                    $(window).trigger('hashchange',[sourceEvent]);
                }
            }
        }
        
        if(r === true && sourceEvent != null)
        sourceEvent.preventDefault();
        
        return r;
    })
    
    
    // outsideClick
    // permet de lancer tous les évenements liés aux outside clicks
    .on('document:outsideClick', function(event) {
        $(this).trigger('click.outside');
    })
    
    
    // mount
    // sur le mount d'une nouvelle page
    .on('document:mount', function(event) {
        var route = $(this).find("html").attr("data-route");
        $(this).trigger('document:statusReady');
        
        $(this).trigger('document:commonBindings',[$(this)]);
        
        if(quid.base.isStringNotEmpty(route))
        $(this).trigger('route:'+route);
    })
    
    
    // unmount
    // sur unmount de la page
    .on('document:unmount', function(event) {
        $(this).off('.outside');
    })
    
    
    // commonBindings
    // permet d'appliquer des bindings courants sur un parent
    // par exemple pour binder des customs events sur des balises
    .on('document:commonBindings', function(event,parent) {
        parent.find("form").form();
    })
    
    
    // statusLoading
    // place la balise html en état de loading
    .on('document:statusLoading', function(event) {
        $("html").attr('data-status','loading');
    })
    
    
    // statusReady
    // place la balise html en état ready
    .on('document:statusReady', function(event) {
        $("html").attr('data-status','ready');
    })
    
    
    // isBackgroundActive
    // retourne la node du background
    .on('document:isBackgroundActive', function(event) {
        return ($(this).triggerHandler('document:getBackground').attr('data-from') != null)? true:false;
    })
    
    
    // getBackground
    // retourne la node du background
    .on('document:getBackground', function(event) {
        return $(this).find($settings.background).first();
    })
    
    
    // setBackground
    // permet d'ajouter une attribut data au background
    .on('document:setBackground', function(event,value) {
        if(quid.base.isStringNotEmpty(value))
        {
            var background = $(this).triggerHandler('document:getBackground');
            background.attr('data-from',value);
        }
    })
    
    
    // unsetBackground
    // enlève les attributs du background
    .on('document:unsetBackground', function(event,value) {
        var background = $(this).triggerHandler('document:getBackground');
        
        if(value == null || value === background.attr('data-from'))
        background.removeAttr('data-from');
    });
    
    
    $(this).triggerHandler('document:cancelAjax');
    $initial = $(this).triggerHandler('document:replaceState',[$location.href,document.title]);
    
    if($history)
    {
        $history.scrollRestoration = 'manual';
        applyBindings.call(this);
    }
    
    $(this).trigger('document:mount');
    
    return this;
}