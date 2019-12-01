/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// document
// script for a document component managing site navigation with the HistoryAPI
const Document = function(option)
{
    // letiable
    const $location = window.location;
    let $history = null;
    let $initial = null;
    let $previous = null;
    
    
    // option
    const $option = Object.assign({
        anchor: "a:not([target='_blank']):not([data-navigation='0']):not([data-modal]):not([href^='mailto:'])",
        form: "form:not([data-navigation='0'])",
        timeout: 10000,
        routeWrap: "> .route-wrap", // target, descendant de body
        background: "> .background" // background, descendant de body
    },option);
    
    
    // func
    
    // isLoading
    // retourne vrai si le chargement de la navigation est présentement active
    setFunc(this,'document:isLoading', function() {
        return ($(this).data('document:active') === true)? true:false;
    });
    
    
    // hasAjax
    // retourne vrai s'il y a présentement un objet ajax en train de s'effectuer
    setFunc(this,'document:hasAjax', function() {
        let r = false;
        const ajax = $(this).data('document:ajax');
        
        if(ajax != null && ajax.readyState < 4)
        r = true;
        
        return r;
    });
    
    
    // hasHistoryApi
    // retourne vrai si history api est activé
    setFunc(this,'document:hasHistoryApi', function() {
        return hasHistoryApi();
    });
    
    
    // getInitialState
    // retourne l'état initial
    setFunc(this,'document:getInitialState', function() {
        return $initial;
    });
    
    
    // getPreviousState
    // retourne l'état précédent
    setFunc(this,'document:getPreviousState', function() {
        return $previous || $initial;
    });
    
    
    // getCurrentState
    // retourne l'état courant
    setFunc(this,'document:getCurrentState', function() {
        return makeHistoryState($location.href,document.title);
    });
    
    
    // replaceState
    setFunc(this,'document:replaceState', function(uri,title) {
        let r = makeHistoryState(uri,title);
        
        if(hasHistoryApi() && Str.isNotEmpty(uri))
        $history.replaceState(r,r.title,r.url);
        
        return r;
    });
    
    
    // hardRedirect
    // fait une redirection dure vers une nouvelle uri
    setFunc(this,'document:hardRedirect', function(uri) {
        $location.href = uri;
    });
    
    
    // cancelAjax
    // annule et détruit l'objet ajax si existant
    setFunc(this,'document:cancelAjax', function() {
        let r = false;
        
        if(triggerFunc(this,'document:hasAjax') === true)
        {
            const ajax = $(this).data('document:ajax');
            ajax.onreadystatechange = $.noop;
            ajax.abort();
        }
        
        $(this).removeData('document:ajax');
        
        return r;
    });
    
    
    // getHtml
    // retourne la node html
    setFunc(this,'document:getHtml', function() {
        return $(this).find("html").first();
    })
    
    
    // getBody
    // retourne la node body
    setFunc(this,'document:getBody', function() {
        return $(this).find("body").first();
    })
    
    
    // getRouteWrap
    // retourne la node du route wrap
    // seul le contenu dans cette node est remplacé au chargement d'une nouvelle page
    setFunc(this,'document:getRouteWrap', function() {
        let r = triggerFunc(this,'document:getBody');

        if($option.routeWrap)
        r = r.find($option.routeWrap).first();
        
        return r;
    });
    
    
    // isBackgroundActive
    // retourne vrai si le background existe et est présentement actif
    setFunc(this,'document:isBackgroundActive', function() {
        let r = false;
        const background = triggerFunc(this,'document:getBackground');
        
        if(background.length && background.attr('data-from') != null)
        r = true;
        
        return r;
    });
    
    
    // getBackground
    // retourne la node du background
    setFunc(this,'document:getBackground', function() {
        return triggerFunc(this,'document:getBody').find($option.background).first();
    });
    
    
    // setBackground
    // permet d'ajouter une attribut data au background
    setFunc(this,'document:setBackground', function(value,replace) {
        let r = false;
        
        if(Str.isNotEmpty(value))
        {
            const background = triggerFunc(this,'document:getBackground');
            
            if(replace === true || background.attr('data-from') == null)
            {
                r = true;
                background.attr('data-from',value);
            }
        }
        
        return r;
    });
    
    
    // unsetBackground
    // enlève les attributs du background
    setFunc(this,'document:unsetBackground', function(value) {
        let r = false;
        if(triggerFunc(this,'document:isBackgroundActive'))
        {
            const background = triggerFunc(this,'document:getBackground');
            
            if(value == null || value === background.attr('data-from'))
            {
                r = true;
                background.removeAttr('data-from');
            }
        }
        
        return r;
    });
    
    
    // clickEvent
    // gère un nouvel historique déclenché par un clic
    setFunc(this,'document:clickEvent', function(click) {
        let r = false;
        
        if(click.target && !(click.which > 1 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey))
        {
            const target = $(click.currentTarget);
            
            if(target.is($option.anchor))
            {
                const uri = target.prop('href');
                r = triggerFunc(this,'document:go',uri,click);
            }
        }
        
        return r;
    });
    
    
    // document:submitEvent
    // gère un nouvel historique déclenché par l'envoie d'un formulaire
    setFunc(this,'document:submitEvent', function(submit) {
        let r = false;
        const target = $(submit.target);
        
        if(target.is($option.form))
        {
            const uri = target.prop('action');
            r = triggerFunc(this,'document:go',uri,submit);
        }
        
        return r;
    })
    
    
    // document:go
    // pousse ou replace une nouvelle entrée dans l'historique
    setFunc(this,'document:go', function(uri,sourceEvent) {
        let r = false;
        
        if(triggerFunc(this,'document:hasAjax'))
        r = true;
        
        else
        {
            if(uri instanceof jQuery && uri.is($option.anchor))
            uri = uri.prop("href");
            
            if(Str.is(uri))
            {
                const current = triggerFunc(this,'document:getCurrentState');
                const state = makeHistoryState(uri);
                const isValid = isStateChangeValid(state,current);
                
                if(isValid === true)
                {
                    if(isUnloadValid() === true)
                    r = (makeAjax.call(this,state,sourceEvent))? true:false;
                    else
                    r = true;
                }
                
                // hash change
                else if(Uri.isHashChange(state.url,current.url))
                {
                    
                    r = true;
                    $history.pushState(state,state.title,state.url);
                    $previous = state;
                    triggerEvent(window,'hashchange',[sourceEvent]);
                }
            }
        }
        
        if(r === true && sourceEvent != null)
        {
            sourceEvent.preventDefault();
            const target = $(sourceEvent.currentTarget);
            
            if(target)
            {
                if(sourceEvent.type === 'click')
                target.attr('data-triggered',1);
                
                else if(sourceEvent.type === 'submit')
                {
                    const clickedSubmit = triggerFunc(target,'form:getClickedSubmits');
                    
                    if(clickedSubmit != null)
                    clickedSubmit.attr('data-triggered',1);
                }
            }
        }
        
        return r;
    });
    
    
    // custom
    
    // outsideClick
    // permet de lancer tous les évenements liés aux outside clicks
    ael(this,'document:outsideClick', function(event) {
        triggerCustom(this,'click.document-mount');
    });
    
    
    // mountNodeCommon
    // trigger mountNode et mountCommon en même temps
    ael(this,'document:mountNodeCommon', function(event,node) {
        triggerCustom(this,'document:mountNode',node);
        triggerCustom(this,'document:mountCommon',node);
    });
    

    // setup
    aelOnce(this,'component:setup',function() {
        
        if(hasHistoryApi())
        $history = window.history;

        triggerFunc(this,'document:cancelAjax');
        $initial = triggerFunc(this,'document:replaceState',$location.href,document.title);
        
        if($history)
        {
            $history.scrollRestoration = 'manual';
            bindDocument.call(this);
        }
        
        mountDocument.call(this,true); 
    });
    
    
    // bindDocument
    // applique les bindings sur les clicks et popstate
    // ceci est binder de façon permanente
    const bindDocument = function()
    {
        const $this = $(this);
        
        // sur le premier isTouch
        aelOnce(this,'touchstart', function(event) {
            $(this).data('isTouch',true);
        })
        
        // docClick, ferme le background
        ael(this,'click', function(event) {
            triggerCustom(this,'document:unsetBackground');
        });
        
        // popstate
        ael(window,'popstate',function(event) {
            const state = event.state || triggerFunc($this,'document:getCurrentState');
            const previous = triggerFunc($this,'document:getPreviousState');
            const isValid = isStateChangeValid(state,previous,true);
            
            if(isValid === true)
            {
                if(isUnloadValid() === true)
                makeAjax.call($this,state,event);
                
                else
                $history.pushState($previous,$previous.title,$previous.url);
            }
            
            // hash change
            else if(Uri.isSamePathQuery(state.url,previous.url) && (Uri.hasFragment(state.url) || Uri.hasFragment(previous.url)))
            {
                $previous = state;
                triggerCustom(this,'hashchange',event);
            }
        });
        
        
        // anchor click
        $(this).on('click', $option.anchor, function(event) { 
            let r = true;
            const href = $(this).attr('href');
            
            if(Uri.isInternal(href))
            {
                triggerFunc($this,'document:clickEvent',event);
                
                if(event.isDefaultPrevented())
                r = false;
            }
            
            return r;
        })
        
        // submit
        .on('submit', $option.form, function(event) { 
            let r = true;
            triggerFunc($this,'document:submitEvent',event);
            
            if(event.isDefaultPrevented())
            r = false;
            
            return r;
        });
    }
    
    
    // hasHistoryApi
    // retourne vrai si le navigateur courant supporte history API
    const hasHistoryApi = function()
    {
        let r = false;
        
        if(window.history && window.history.pushState && window.history.replaceState)
        {
            if(!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))
            r = true;
        }
        
        return r;
    }

    
    // isHistoryState
    // retourne vrai si la valeur est un objet compatible pour un état d'historique
    const isHistoryState = function(state)
    {
        let r = false;
        
        if(Obj.isPlain(state) && Str.is(state.url) && Num.is(state.timestamp))
        r = true;
        
        return r;
    }
    
    
    // makeHistoryState
    // retourne un objet état d'historique (avec url, title et timestamp)
    const makeHistoryState = function(uri,title) 
    {
        let r = null;
        
        if(Str.is(uri))
        {
            r = {
                url: uri,
                title: title || null,
                timestamp: Datetime.timestamp()
            };
        }
        
        return r;
    }
    
    
    // mountDocument
    // lance les évènements pour monter le document dans le bon order
    const mountDocument = function(initial)
    {
        const $this = $(this);
        const html = triggerFunc(this,'document:getHtml');
        let routeWrap = triggerFunc(this,'document:getRouteWrap');
        
        if(initial === true)
        {
            const body = triggerFunc(this,'document:getBody');
            triggerCustom(this,'document:mountInitial',body);
            triggerCustom(this,'document:mountCommon',body);
        }
        
        
        else
        triggerCustom(this,'document:mountCommon',routeWrap);
        
        /*
        triggerCustom(this,'document:mount',routeWrap);
        
        const group = html.attr("data-group");
        if(Str.isNotEmpty(group))
        triggerCustom(this,'group:'+group,routeWrap);
        
        let route = html.attr("data-route");
        if(Str.isNotEmpty(route))
        triggerCustom(this,'route:'+route,routeWrap);
        */
        
        triggerCustom(this,'document:mounted',routeWrap);
        
        setTimeout(function() {
            html.attr('data-status','ready');
        }, 100);
    }
    
    
    // unmountDocument
    // lance les évènements pour démonter le document dans le bon order
    const unmountDocument = function()
    {
        const html = triggerFunc(this,'document:getHtml');
        const body = triggerFunc(this,'document:getBody');
        let routeWrap = triggerFunc(this,'document:getRouteWrap');
        
        triggerCustom(this,'document:unmount',routeWrap);
        
        const group = html.attr("data-group");
        if(Str.isNotEmpty(group))
        triggerCustom(this,'group:'+group+':unmount',routeWrap);
        
        let route = html.attr("data-route");
        if(Str.isNotEmpty(route))
        triggerCustom(this,'route:'+route+':unmount',routeWrap);
        
        $(this).off('.document-mount');
        $(window).off('.document-mount');
        html.off('.document-mount');
        body.off('.document-mount');
        triggerCustom(this,'document:unsetBackground');
        
        triggerCustom(this,'document:unmounted',routeWrap);
    }
    
    
    // isStateChangeValid
    // retourne vrai si le changement de state est valide
    const isStateChangeValid = function(state,previous,pathQuery)
    {
        let r = false;
        
        if(isHistoryState(state) && isHistoryState(previous))
        {
            const isInternal = Uri.isInternal(state.url,previous.url);
            const hasExtension = Uri.hasExtension(state.url);
            const isHashChange = Uri.isHashChange(state.url,previous.url);
            const isSameWithHash = Uri.isSameWithHash(state.url,previous.url);
            
            if(isInternal === true && hasExtension === false && isHashChange === false && isSameWithHash === false)
            {
                if(!pathQuery || Uri.isSamePathQuery(state.url,previous.url) === false)
                r = true;
            }
        }
        
        return r;
    }
    
    
    // isUnloadValid
    // retourne vrai si unload est vide ou confirmé
    const isUnloadValid = function()
    {
        let r = false;
        const unload = triggerFunc(window,'beforeunload');
        
        if(!Str.isNotEmpty(unload) || confirm(unload))
        r = true;
        
        return r;
    }
    
    
    // makeHistoryType
    // retourne le type d'historique
    // met à jour l'objet config si c'est form
    const makeHistoryType = function(config,sourceEvent)
    {
        let r = 'push';
        
        if(sourceEvent)
        {
            const target = $(sourceEvent.currentTarget);
            
            if(target && Dom.tag(target) === 'form')
            {
                Xhr.configFromNode(target,config);
                
                if(triggerFunc(target,'form:hasFiles'))
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
    const makeAjax = function(state,sourceEvent)
    {
        let r = null;

        if(isHistoryState(state))
        {
            const $this = $(this);
            const html = triggerFunc(this,'document:getHtml');
            triggerFunc(this,'document:cancelAjax');
            beforeAjax.call(this);
            
            const config = {
                url: state.url,
                timeout: $option.timeout,
                success: function(data,textStatus,jqXHR) {
                    afterAjax.call($this,type,state,jqXHR);
                },
                progress: function(percent,event) {
                    triggerCustom($this,'document:ajaxProgress',percent,event);
                },
                error: function(jqXHR,textStatus,errorThrown) {
                    if(Str.isNotEmpty(jqXHR.responseText))
                    afterAjax.call($this,type,state,jqXHR);
                    else
                    triggerFunc($this,'document:hardRedirect',state.url);
                }
            };
            
            const type = makeHistoryType(config,sourceEvent);
            r = Xhr.trigger(this,config);
            
            if(r != null)
            $(this).data('document:ajax',r);
        }
        
        return r;
    }
    

    // beforeAjax
    // callback avant le ajax
    const beforeAjax = function()
    {
        $(this).data('document:active',true);
        
        // loading
        triggerFunc(this,'document:getHtml').attr('data-status','loading');
        
        // beforeUnload
        $(window).off('beforeunload');
    }
    
    
    // afterAjax
    // callback après le ajax
    const afterAjax = function(type,state,jqXHR)
    {
        if(Obj.isPlain(jqXHR) && isHistoryState(state) && Str.isNotEmpty(type))
        {
            const data = jqXHR.responseText;
            const currentUri = jqXHR.getResponseHeader('QUID-URI');
            const current = triggerFunc(this,'document:getCurrentState');
            
            if(Str.is(data))
            {
                const doc = Html.doc(data);
                $(this).removeData('document:active');
                
                if(type === 'push' || type === 'form')
                {
                    state = makeHistoryState(state.url,doc.title);
                    
                    if(state.url !== current.url)
                    {
                        if(type === 'push' || !Uri.isSamePathQuery(current.url,currentUri))
                        $history.pushState(state,state.title,state.url);
                    }
                }
                
                if(state.url !== currentUri)
                {
                    if(!Uri.isInternal(state.url,currentUri) || !Uri.isSamePathQuery(state.url,currentUri))
                    state = triggerFunc(this,'document:replaceState',currentUri,state.title);
                }	
                    
                unmountDocument.call(this);
                makeDocument.call(this,doc);
                doc.html.remove();
                $previous = state;
            }
        }
    }
    
    
    // makeDocument
    // crée le document à partir d'un objet doc, passé dans dom.parse
    const makeDocument = function(doc)
    {
        let r = false;
        
        if(Obj.isPlain(doc) && doc.body && doc.body.length)
        {
            r = true;
            
            // html
            // les attributs de html sont remplacés (les attributs existants ne sont pas effacés)
            const html = triggerFunc(this,'document:getHtml');
            DomChange.setsAttr(doc.htmlAttr,html);
            
            // head
            const head = html.find("head").first();
            
            // title
            const title = head.find("meta");
            if(Str.isNotEmpty(doc.title))
            {
                document.title = doc.title;
                title.html(doc.titleHtml);
            }
            
            // meta
            const meta = head.find("meta");
            meta.remove();
            head.prepend(doc.meta);
            
            // body
            // les attributs de body sont effacés et remplacés
            const body = triggerFunc(this,'document:getBody');
            DomChange.emptyAttr(body);
            DomChange.setsAttr(doc.bodyAttr,body);
            
            // routeWrap
            // les attributs de routeWrap sont effacés et remplacés seulement si routeWrap n'est pas body
            const routeWrap = triggerFunc(this,'document:getRouteWrap');
            let contentTarget = doc.body;
            if($option.routeWrap && !routeWrap.is("body"))
            {
                let routeWrapTarget = contentTarget.find($option.routeWrap);
                if(routeWrapTarget.length)
                {
                    contentTarget = routeWrapTarget;
                    let routeWrapAttributes = Dom.attr(contentTarget);
                    DomChange.emptyAttr(routeWrap);
                    DomChange.setsAttr(routeWrapAttributes,routeWrap);
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
    const afterMakeDocument = function()
    {
        const state = triggerFunc(this,'document:getCurrentState');

        $(this).find("html,body").stop(true,true).scrollTop(0);
        
        mountDocument.call(this);
    }
    
    
    return this;
}

// export
Component.Document = Document;