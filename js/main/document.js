"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// document
// script for a document component managing site navigation with the HistoryAPI
quid.main.document = new function() {
    
    // bind
    // classe qui gère la navigation du document via history api
    this.bind = $.fn.document = function(option) 
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
        // ceci est binder de façon permanente
        function applyBindings()
        {
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
        
        
        // documentBindings
        // applique les bindings au document mounted dans le bon ordre
        function documentBindings()
        {
            $(this).trigger('document:commonBindings',[$(this)]);
            $(this).trigger('document:mount');
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
                        
                        if(state.url !== current.url && !quid.base.uri.isSamePathQuery(current.url,currentUri))
                        $history.pushState(state,state.title,state.url);
                    }
                    
                    if(state.url !== currentUri)
                    {
                        if(quid.base.uri.isInternal(state.url,currentUri) === false || quid.base.uri.isSamePathQuery(state.url,currentUri) === false)
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
        // crée le document à partir d'un objet doc, passé dans dom.parse
        function makeDocument(doc)
        {
            var r = false;

            if(quid.base.obj.isPlain(doc) && doc.body && doc.body.length)
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

            $(this).find("html,body").stop(true,true).scrollTop(0);
            
            documentBindings.call(this);
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
        
        
        // mount
        // sur le mount d'une nouvelle page
        .on('document:mount', function(event) {
            var route = $(this).find("html").attr("data-route");
            $(this).trigger('document:statusReady');
            
            if(quid.base.str.isNotEmpty(route))
            $(this).trigger('route:'+route);
        })
        
        
        // unmount
        // sur unmount de la page efface tous les événements qui ont le namespace document-mount
        .on('document:unmount', function(event) {
            $(this).off('.document-mount');
            $(window).off('.document-mount');
            $("html").off('.document-mount');
            $("body").off('.document-mount');
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
            return $(this).find($settings.background).first();
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
        
        documentBindings.call(this);    
        
        return this;
    }
}