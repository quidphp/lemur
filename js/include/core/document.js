"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// document
// script for a document component managing site navigation with the HistoryAPI
quid.core.document = function(option)
{
    var $settings = {
        anchor: "a:internal:not([target='_blank']):not([data-navigation='0']):not([data-modal]):not([href^='mailto:'])",
        form: "form:not([data-navigation='0'])",
        timeout: 10000,
        routeWrap: "> .route-wrap", // target, descendant de body
        background: "> .background" // background, descendant de body
    };
    
    if(option != null)
    $settings = quid.base.obj.replace($settings, option);
    
    var $location = window.location;
    var $history = (hasHistoryApi())? window.history:null;
    var $initial = null;
    var $previous = null;

    
    // applyBindings
    // applique les bindings sur les clicks et popstate
    // ceci est binder de façon permanente
    function applyBindings()
    {
        var $target = $(this);
        
        // sur le premier isTouch
        $(this).one('touchstart', function(event) {
            $(this).data('isTouch',true);
        })
        
        // anchor click
        .on('click', $settings.anchor, function(event) { 
            var r = true;
            
            $target.triggerHandler('document:clickEvent',[event]);
            
            if(event.isDefaultPrevented())
            r = false;
            
            return r;
        })
        
        // submit
        .on('submit', $settings.form, function(event) { 
            var r = true;
            $target.triggerHandler('document:submitEvent',[event]);
            
            if(event.isDefaultPrevented())
            r = false;
            
            return r;
        })
        
        // docClick, ferme le background
        .on('click', function(event) {
            $(this).trigger('document:unsetBackground');
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
            else if(quid.base.uri.isSamePathQuery(state.url,previous.url) && (quid.base.uri.hasFragment(state.url) || quid.base.uri.hasFragment(previous.url)))
            {
                $previous = state;
                $(this).trigger('hashchange',[event]);
            }
        });
    }
    
    
    // documentMount
    // lance les évènements pour monter le document dans le bon order
    function documentMount(initial)
    {
        var $this = $(this);
        var html = $(this).triggerHandler('document:getHtml');
        var routeWrap = $(this).triggerHandler('document:getRouteWrap');
        
        if(initial === true)
        {
            var body = $(this).triggerHandler('document:getBody');
            $(this).trigger('document:mountCommon',[body]);
            $(this).trigger('document:mountInitial',[body]);
        }
        
        else
        $(this).trigger('document:mountCommon',[routeWrap]);
        
        $(this).trigger('document:mount',[routeWrap]);
        
        var group = html.attr("data-group");
        if(quid.base.str.isNotEmpty(group))
        $(this).trigger('group:'+group,[routeWrap]);
        
        var route = html.attr("data-route");
        if(quid.base.str.isNotEmpty(route))
        $(this).trigger('route:'+route,[routeWrap]);
        
        $(this).trigger('document:mounted',[routeWrap]);
        
        setTimeout(function() {
            html.attr('data-status','ready');
        }, 100);
    }
    
    
    // documentUnmount
    // lance les évènements pour démonter le document dans le bon order
    function documentUnmount()
    {
        var html = $(this).triggerHandler('document:getHtml');
        var body = $(this).triggerHandler('document:getBody');
        var routeWrap = $(this).triggerHandler('document:getRouteWrap');
        
        $(this).trigger('document:unmount',[routeWrap]);
        
        var group = html.attr("data-group");
        if(quid.base.str.isNotEmpty(group))
        $(this).trigger('group:'+group+':unmount',[routeWrap]);
        
        var route = html.attr("data-route");
        if(quid.base.str.isNotEmpty(route))
        $(this).trigger('route:'+route+':unmount',[routeWrap]);
        
        $(this).off('.document-mount');
        $(window).off('.document-mount');
        html.off('.document-mount');
        body.off('.document-mount');
        $(this).trigger('document:unsetBackground');
        
        $(this).trigger('document:unmounted',[routeWrap]);
    }
    
    
    // isStateChangeValid
    // retourne vrai si le changement de state est valide
    function isStateChangeValid(state,previous,pathQuery)
    {
        var r = false;
        
        if(isHistoryState(state) && isHistoryState(previous))
        {
            var isInternal = quid.base.uri.isInternal(state.url,previous.url);
            var hasExtension = quid.base.uri.isExtension(state.url);
            var isHashChange = quid.base.uri.isHashChange(state.url,previous.url);
            var isHashSame = quid.base.uri.isHashSame(state.url,previous.url);
            
            if(isInternal === true && hasExtension === false && isHashChange === false && isHashSame === false)
            {
                if(!pathQuery || quid.base.uri.isSamePathQuery(state.url,previous.url) === false)
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
        
        if(!quid.base.str.isNotEmpty(unload) || confirm(unload))
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
                quid.main.ajax.configFromTag.call(target,config);
                
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
            var html = $(this).triggerHandler('document:getHtml');
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
                    if(quid.base.str.isNotEmpty(jqXHR.responseText))
                    afterAjax.call($this,type,state,jqXHR);
                    else
                    $this.triggerHandler('document:hardRedirect',state.url);
                }
            };
            
            var type = makeHistoryType(config,sourceEvent);
            r = quid.main.ajax.trigger.call(this,config);
            
            if(r != null)
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
        $(this).triggerHandler('document:getHtml').attr('data-status','loading');
        
        // beforeUnload
        $(window).off('beforeunload');
    }
    
    
    // afterAjax
    // callback après le ajax
    function afterAjax(type,state,jqXHR)
    {
        if(quid.base.obj.isPlain(jqXHR) && isHistoryState(state) && quid.base.str.isNotEmpty(type))
        {
            var data = jqXHR.responseText;
            var currentUri = jqXHR.getResponseHeader('QUID-URI');
            var current = $(this).triggerHandler('document:getCurrentState');
            
            if(quid.base.str.is(data))
            {
                var doc = quid.main.dom.parse(data);
                $(this).removeData('document:active');
                
                if(type === 'push' || type === 'form')
                {
                    state = makeHistoryState(state.url,doc.title);
                    
                    if(state.url !== current.url)
                    {
                        if(type === 'push' || !quid.base.uri.isSamePathQuery(current.url,currentUri))
                        $history.pushState(state,state.title,state.url);
                    }
                }
                
                if(state.url !== currentUri)
                {
                    if(!quid.base.uri.isInternal(state.url,currentUri) || !quid.base.uri.isSamePathQuery(state.url,currentUri))
                    state = $(this).triggerHandler('document:replaceState',[currentUri,state.title]);
                }	
                    
                documentUnmount.call(this);
                makeDocument.call(this,doc);
                doc.doc.remove();
                $previous = state;
            }
        }
    }
    
    
    // makeDocument
    // crée le document à partir d'un objet doc, passé dans dom.parse
    function makeDocument(doc)
    {
        var r = false;

        if(quid.base.obj.isPlain(doc) && doc.body && doc.body.length)
        {
            r = true;
            
            // html
            // les attributs de html sont remplacés (les attributs existants ne sont pas effacés)
            var html = $(this).triggerHandler('document:getHtml');
            doc.html.removeAttr('data-tag');
            var htmlAttributes = doc.html.getAttributes();
            html.replaceAttributes(htmlAttributes);
            
            // head
            var head = html.find("head").first();
            
            // title
            var title = head.find("meta");
            if(quid.base.str.isNotEmpty(doc.title))
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
            // les attributs de body sont effacés et remplacés
            var body = $(this).triggerHandler('document:getBody');
            doc.body.removeAttr('data-tag');
            var bodyAttributes = doc.body.getAttributes();
            body.replaceAttributes(bodyAttributes,true);
            
            // routeWrap
            // les attributs de routeWrap sont effacés et remplacés seulement si routeWrap n'est pas body
            var routeWrap = $(this).triggerHandler('document:getRouteWrap');
            var contentTarget = doc.body;
            if($settings.routeWrap && !routeWrap.is("body"))
            {
                var routeWrapTarget = contentTarget.find($settings.routeWrap);
                if(routeWrapTarget.length)
                {
                    contentTarget = routeWrapTarget;
                    var routeWrapAttributes = contentTarget.getAttributes();
                    routeWrap.replaceAttributes(routeWrapAttributes,true);
                }
            }
            routeWrap.html(contentTarget.html());
            
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

        $(this).find("html,body").stop(true,true).scrollTop(0);
        
        documentMount.call(this);
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
        
        if(quid.base.str.is(uri))
        {
            r = {
                url: uri,
                title: title || null,
                timestamp: quid.base.date.timestamp()
            };
        }
        
        return r;
    }


    // isHistoryState
    // retourne vrai si la valeur est un objet compatible pour un état d'historique
    function isHistoryState(state)
    {
        var r = false;
        
        if(quid.base.obj.isPlain(state) && quid.base.str.is(state.url) && quid.base.number.is(state.timestamp))
        r = true;
        
        return r;
    }
    
    
    // isLoading
    // retourne vrai si le chargement de la navigation est présentement active
    this._isLoading = function() {
        return ($(this).data('document:active') === true)? true:false;
    };
    
    
    // hasAjax
    // retourne vrai s'il y a présentement un objet ajax en train de s'effectuer
    $(this).on('document:hasAjax', function(event) {
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
        
        if(hasHistoryApi() && quid.base.str.isNotEmpty(uri))
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
            var target = $(click.currentTarget);
            
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
            
            if(quid.base.str.is(uri))
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
                else if(quid.base.uri.isHashChange(state.url,current.url))
                {
                    
                    r = true;
                    $history.pushState(state,state.title,state.url);
                    $previous = state;
                    $(window).trigger('hashchange',[sourceEvent]);
                }
            }
        }
        
        if(r === true && sourceEvent != null)
        {
            sourceEvent.preventDefault();
            var target = $(sourceEvent.currentTarget);
            
            if(target)
            {
                if(sourceEvent.type === 'click')
                target.attr('data-triggered',1);
                
                else if(sourceEvent.type === 'submit')
                {
                    var clickedSubmit = target.triggerHandler('form:getClickedSubmits');
                    
                    if(clickedSubmit != null)
                    clickedSubmit.attr('data-triggered',1);
                }
            }
        }
        
        return r;
    })
    
    
    // outsideClick
    // permet de lancer tous les évenements liés aux outside clicks
    .on('document:outsideClick', function(event) {
        $(this).trigger('click.document-mount');
    })
    
    
    // initialMount
    // seulement au chargement initial de la page
    .on('document:mountInitial', function(event,body) {
        
    })
    
    
    // mount
    // callback au début du montage d'une nouvelle page
    .on('document:mount', function(event,routeWrap) {
        
    })
    
    
    // mounted
    // callback après avoir monté la nouvelle page
    .on('document:mounted', function(event,routeWrap) {
        
    })
    
    
    // unmount
    // callback au début du démontage d'une page
    .on('document:unmount', function(event,routeWrap) {
        
    })
    
    
    // unmounted
    // callback après avoir démonté la page
    .on('document:unmounted', function(event,routeWrap) {
        
    })
    
    
    // mountCommon
    // permet d'appliquer des bindings courants sur un parent
    // par exemple pour binder des customs events sur des balises
    .on('document:mountCommon', function(event,node) {
        
    })
    
    
    // mountNodeCommon
    // trigger mountNode et mountCommon en même temps
    .on('document:mountNodeCommon', function(event,node) {
        $(this).trigger('document:mountNode',[node]);
        $(this).trigger('document:mountCommon',[node]);
    })
    
    
    // getHtml
    // retourne la node html
    .on('document:getHtml', function(event) {
        return $(this).find("html").first();
    })
    
    
    // getBody
    // retourne la node body
    .on('document:getBody', function(event) {
        return $(this).find("body").first();
    })
    
    
    // getRouteWrap
    // retourne la node du route wrap
    // seul le contenu dans cette node est remplacé au chargement d'une nouvelle page
    .on('document:getRouteWrap', function(event) {
        var r = $(this).triggerHandler('document:getBody');

        if($settings.routeWrap)
        r = r.find($settings.routeWrap).first();
        
        return r;
    })
    
    
    // isBackgroundActive
    // retourne vrai si le background existe et est présentement actif
    .on('document:isBackgroundActive', function(event) {
        var r = false;
        var background = $(this).triggerHandler('document:getBackground');
        
        if(background.length && background.attr('data-from') != null)
        r = true;
        
        return r;
    })
    
    
    // getBackground
    // retourne la node du background
    .on('document:getBackground', function(event) {
        return $(this).triggerHandler('document:getBody').find($settings.background).first();
    })
    
    
    // setBackground
    // permet d'ajouter une attribut data au background
    .on('document:setBackground', function(event,value,replace) {
        if(quid.base.str.isNotEmpty(value))
        {
            var background = $(this).triggerHandler('document:getBackground');
            
            if(replace === true || background.attr('data-from') == null)
            background.attr('data-from',value);
        }
    })
    
    
    // unsetBackground
    // enlève les attributs du background
    .on('document:unsetBackground', function(event,value) {
        if($(this).triggerHandler('document:isBackgroundActive'))
        {
            var background = $(this).triggerHandler('document:getBackground');
            
            if(value == null || value === background.attr('data-from'))
            background.removeAttr('data-from');
        }
    });
    
    
    $(this).triggerHandler('document:cancelAjax');
    $initial = $(this).triggerHandler('document:replaceState',[$location.href,document.title]);
    
    if($history)
    {
        $history.scrollRestoration = 'manual';
        applyBindings.call(this);
    }
    
    documentMount.call(this,true);    
    
    return this;
}