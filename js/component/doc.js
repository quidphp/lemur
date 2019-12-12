/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// doc
// script for a document component managing site navigation with the HistoryAPI
const Doc = Component.Doc = function(option)
{
    // une node
    Dom.checkNode(this);
    
    
    // document
    const $document = this;
    

    // variable
    let $history = null;
    let $initial = null;
    let $previous = null;
    
    
    // option
    const $option = Object.assign({
        anchor: "a:not([target='_blank']):not([data-navigation='0']):not([data-modal]):not([href^='mailto:'])",
        form: "form:not([data-navigation='0'])",
        responseUrl: 'QUID-URI',
        timeout: 10000,
        routeWrap: "> .route-wrap" // routeWrap, descendant de body
    },option);
    
    
    // components
    Component.Win.call(window);
    Component.KeyboardEscape.call(this);
    
    
    // handler
    
    // isLoading
    // retourne vrai si le chargement de la navigation est présentement active
    setHdlr(this,'doc:isLoading',function() {
        let r = false;
        const ajax = $(this).data('doc-ajax');
        
        if(ajax != null && ajax.readyState < 4)
        r = true;
        
        return r;
    });
    
    // hasHistoryApi
    // retourne vrai si history api est activé
    setHdlr(this,'doc:hasHistoryApi',function() {
        return HistoryApi.supported();
    });
    
    // isTouch
    // retourne vrai si le navigateur courant supporte le touch
    setHdlr(this,'doc:isTouch',function() {
        return ($(this).data('doc-isTouch') === true)? true:false;
    });

    // getInitialState
    // retourne l'état initial
    setHdlr(this,'doc:getInitialState',function() {
        return $initial;
    });
    
    // getPreviousState
    // retourne l'état précédent
    setHdlr(this,'doc:getPreviousState',function() {
        return $previous || $initial;
    });
    
    // getCurrentState
    // retourne l'état courant
    setHdlr(this,'doc:getCurrentState',function() {
        return HistoryApi.makeState(location.href,document.title);
    });
    
    // replaceState
    setHdlr(this,'doc:replaceState',function(uri,title) {
        let r = HistoryApi.makeState(uri,title);
        
        if($history != null && Str.isNotEmpty(uri))
        $history.replaceState(r,r.title,r.url);
        
        return r;
    });
    
    // hardRedirect
    // fait une redirection dure vers une nouvelle uri
    setHdlr(this,'doc:hardRedirect',function(uri) {
        location.href = uri;
    });
    
    // cancelAjax
    // annule et détruit l'objet ajax si existant
    setHdlr(this,'doc:cancelAjax',function() {
        let r = false;
        
        if(trigHdlr(this,'doc:isLoading') === true)
        {
            const ajax = $(this).data('doc-ajax');
            ajax.onreadystatechange = Func.noop();
            ajax.abort();
        }
        
        $(this).removeData('doc-ajax');
        
        return r;
    });
    
    // scrollTo
    // permet de scroller la page
    setHdlr(this,'doc:scrollTo',function(top) {
        const htmlBody = qsa(this,"html,body");
        $(htmlBody).stop(true,true).scrollTop(top);
    });
    
    // getWindow
    // retourne l'objet window
    setHdlr(this,'doc:getWindow',function() {
        return window;
    });
    
    // getHtml
    // retourne la node html
    setHdlr(this,'doc:getHtml',function() {
        return qs(this,'html');
    });
    
    // getBody
    // retourne la node body
    setHdlr(this,'doc:getBody',function() {
        return qs(this,'body');
    });
    
    // getRouteWrap
    // retourne la node du route wrap
    // seul le contenu dans cette node est remplacé au chargement d'une nouvelle page
    setHdlr(this,'doc:getRouteWrap',function() {
        let r = trigHdlr(this,'doc:getBody');

        if($option.routeWrap)
        r = qs(r,$option.routeWrap);
        
        return r;
    });
    
    // clickEvent
    // gère un nouvel historique déclenché par un clic
    setHdlr(this,'doc:clickEvent',function(click) {
        let r = false;
        const target = Evt.getTriggerTarget(click);
        
        if(target != null && $(target).is($option.anchor))
        {
            const type = click.type;
            const validClickEvent = !((click.which > 1 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey));
            
            if(type !== 'click' || validClickEvent === true)
            {
                const uri = $(target).prop('href');
                r = trigHdlr(this,'doc:go',uri,click);
            }
        }
        
        return r;
    });
    
    // doc:submitEvent
    // gère un nouvel historique déclenché par l'envoie d'un formulaire
    setHdlr(this,'doc:submitEvent',function(submit) {
        let r = false;
        const target = Evt.getTriggerTarget(submit);
        
        if(target != null && $(target).is($option.form))
        {
            const uri = $(target).prop('action');
            r = trigHdlr(this,'doc:go',uri,submit);
        }
        
        return r;
    });
    
    // doc:go
    // pousse ou replace une nouvelle entrée dans l'historique
    setHdlr(this,'doc:go',function(uri,sourceEvent) {
        let r = false;
        
        if(trigHdlr(this,'doc:isLoading'))
        {
            if(sourceEvent != null)
            sourceEvent.preventDefault();
        }
        
        else if(Str.is(uri) && Uri.isInternal(uri))
        {
            const current = trigHdlr(this,'doc:getCurrentState');
            const state = HistoryApi.makeState(uri);
            const isValid = HistoryApi.isStateChangeValid(state,current);
            
            if(isValid === true)
            {
                if(trigHdlr(window,'win:isUnloadValid') === true)
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
                trigEvt(window,'hashchange',sourceEvent);
            }
            
            if(r === true && sourceEvent != null)
            {
                sourceEvent.preventDefault();
                targetTriggered.call(this,sourceEvent);
            }
        }
        
        return r;
    });
    
    // unload 
    // lance les évènements pour démonter le document dans le bon order
    setHdlr(this,'doc:unload',function() {
        const html = trigHdlr(this,'doc:getHtml');
        const body = trigHdlr(this,'doc:getBody');
        const routeWrap = trigHdlr(this,'doc:getRouteWrap');
        
        trigEvt(this,'doc:unmountCommon',routeWrap);
        trigEvt(this,'doc:unmount',routeWrap);
        
        const group = $(html).attr("data-group");
        if(Str.isNotEmpty(group))
        trigEvt(this,'group:'+group+':unmount',routeWrap);
        
        const route = $(html).attr("data-route");
        if(Str.isNotEmpty(route))
        trigEvt(this,'route:'+route+':unmount',routeWrap);
                
        trigEvt(this,'doc:unmounted',routeWrap);
    });
    
    
    // custom
    
    // mountNodeCommon
    // trigger mountNode et mountCommon en même temps
    ael(this,'doc:mountNodeCommon',function(event,node) {
        trigEvt(this,'doc:mountNode',node);
        trigEvt(this,'doc:mountCommon',node);
    });
    
    // keyboardEscape
    // trigger un click
    ael(this,'keyboardEscape:catched',function() {
        trigEvt(this,'click');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        
        if(trigHdlr(this,'doc:hasHistoryApi'))
        $history = window.history;

        trigHdlr(this,'doc:cancelAjax');
        $initial = trigHdlr(this,'doc:replaceState',location.href,document.title);
        
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
        // sur le premier isTouch
        aelOnce(this,'touchstart',function() {
            $(this).data('doc-isTouch',true);
        })
        
        // popstate
        ael(window,'popstate',function(event) {
            const state = event.state || trigHdlr($document,'doc:getCurrentState');
            const previous = trigHdlr($document,'doc:getPreviousState');
            const isValid = HistoryApi.isStateChangeValid(state,previous,true);
            
            if(isValid === true)
            {
                if(trigHdlr(this,'win:isUnloadValid') === true)
                makeAjax.call($document,state,event);
                
                else
                $history.pushState($previous,$previous.title,$previous.url);
            }
            
            // hash change
            else if(Uri.isSamePathQuery(state.url,previous.url) && (Uri.hasFragment(state.url) || Uri.hasFragment(previous.url)))
            {
                $previous = state;
                trigEvt(this,'hashchange',event);
            }
        });
        
        // anchor click
        aelDelegate(this,'click',$option.anchor,function(event) { 
            let r = true;
            trigHdlr($document,'doc:clickEvent',event);
            
            if(event.defaultPrevented === true)
            r = false;
            
            return r;
        });
        
        // submit
        aelDelegate(this,'submit',$option.form,function(event) { 
            let r = true;
            trigHdlr($document,'doc:submitEvent',event);
            
            if(event.defaultPrevented === true)
            r = false;
            
            return r;
        });
    }
    

    // mountDocument
    // lance les évènements pour monter le document dans le bon order
    const mountDocument = function(initial)
    {
        const html = trigHdlr(this,'doc:getHtml');
        const routeWrap = trigHdlr(this,'doc:getRouteWrap');
        
        if(initial === true)
        {
            const body = trigHdlr(this,'doc:getBody');
            trigEvt(this,'doc:mountInitial',body);
            trigEvt(this,'doc:mountCommon',body);
        }
        
        else
        trigEvt(this,'doc:mountCommon',routeWrap);
        
        trigEvt(this,'doc:mount',routeWrap);
        
        const group = $(html).attr("data-group");
        if(Str.isNotEmpty(group))
        trigEvt(this,'group:'+group,routeWrap);
        
        const route = $(html).attr("data-route");
        if(Str.isNotEmpty(route))
        trigEvt(this,'route:'+route,routeWrap);
        
        trigEvt(this,'doc:mounted',routeWrap);
        
        setTimeout(function() {
            $(html).attr('data-status','ready');
        }, 100);
    }
    
    
    // makeHistoryType
    // retourne le type d'historique
    // met à jour l'objet config si c'est form
    const makeHistoryType = function(config,sourceEvent)
    {
        let r = 'push';
        
        if(sourceEvent)
        {
            const target = Evt.getTriggerTarget(sourceEvent);
            
            if(target != null && Dom.tag(target) === 'form')
            {
                Xhr.configFromNode(target,config);
                
                if(trigHdlr(target,'form:hasFiles'))
                config.timeout = 0;
                
                r = 'form';
            }
            
            else if(sourceEvent.type === 'popstate')
            r = 'popstate';
        }
        
        return r;
    }
    
    
    // targetTriggered
    // fonction utilisé pour marquer un lien ou form comme raison du chargement de page
    // permet d'appliquer un style à l'élément pendant le chargement
    const targetTriggered = function(sourceEvent)
    {
        const target = Evt.getTriggerTarget(sourceEvent);
        
        if(target != null)
        {
            if(sourceEvent.type === 'click')
            $(target).attr('data-triggered',1);
            
            else if(sourceEvent.type === 'submit')
            {
                const clickedSubmit = trigHdlr(target,'form:getClickedSubmits');
                
                if(clickedSubmit != null)
                $(clickedSubmit).attr('data-triggered',1);
            }
        }
    }
    
    
    // makeAjax
    // crée et retourne l'objet ajax
    const makeAjax = function(state,sourceEvent)
    {
        let r = null;

        if(HistoryApi.isState(state))
        {
            const html = trigHdlr(this,'doc:getHtml');
            $(html).attr('data-status','loading');
            
            const config = {
                url: state.url,
                timeout: $option.timeout,
                success: function(data,textStatus,jqXHR) {
                    afterAjax.call($document,type,state,jqXHR);
                },
                progress: function(percent,event) {
                    trigEvt($document,'doc:ajaxProgress',percent,event);
                },
                error: function(jqXHR,textStatus,errorThrown) {
                    if(Str.isNotEmpty(jqXHR.responseText))
                    afterAjax.call($document,type,state,jqXHR);
                    else
                    trigHdlr($document,'doc:hardRedirect',state.url);
                }
            };
            
            const type = makeHistoryType(config,sourceEvent);
            
            r = Xhr.trigger(config);
            trigHdlr(this,'doc:cancelAjax');
            
            if(r != null)
            $(this).data('doc-ajax',r);
        }
        
        return r;
    }
    

    // afterAjax
    // callback après le ajax
    const afterAjax = function(type,state,jqXHR)
    {
        if(Pojo.is(jqXHR) && HistoryApi.isState(state) && Str.isNotEmpty(type))
        {
            const data = jqXHR.responseText;
            const currentUri = jqXHR.getResponseHeader($option.responseUrl);
            const current = trigHdlr(this,'doc:getCurrentState');
            
            if(Str.is(data))
            {
                const doc = Html.doc(data);
                
                if(type === 'push' || type === 'form')
                {
                    state = HistoryApi.makeState(state.url,doc.title);
                    
                    if(state.url !== current.url)
                    {
                        if(type === 'push' || !Uri.isSamePathQuery(current.url,currentUri))
                        $history.pushState(state,state.title,state.url);
                    }
                }
                
                if(state.url !== currentUri)
                {
                    if(!Uri.isInternal(state.url,currentUri) || !Uri.isSamePathQuery(state.url,currentUri))
                    state = trigHdlr(this,'doc:replaceState',currentUri,state.title);
                }	
                
                trigHdlr(this,'doc:unload');
                makeDocument.call(this,doc);
                $(doc.html).remove();
                trigHdlr(this,'doc:scrollTo',0);
                mountDocument.call(this);
                $previous = state;
            }
        }
    }
    
    
    // makeDocument
    // crée le document à partir d'un objet doc, passé dans dom.parse
    const makeDocument = function(doc)
    {
        let r = false;
        
        if(Pojo.is(doc) && doc.body != null)
        {
            r = true;
            
            // html
            // les attributs de html sont remplacés (les attributs existants ne sont pas effacés)
            const html = trigHdlr(this,'doc:getHtml');
            DomChange.setsAttr(doc.htmlAttr,html);
            
            // head
            const head = qs(html,'head');
            const title = qs(head,'title');
            
            // title
            if(Str.isNotEmpty(doc.title))
            {
                document.title = doc.title;
                $(title).html(doc.titleHtml);
            }
            
            // meta
            const meta = qsa(head,'meta');
            $(meta).remove();
            $(head).prepend(doc.meta);
            
            // body
            // les attributs de body sont effacés et remplacés
            const body = trigHdlr(this,'doc:getBody');
            DomChange.emptyAttr(body);
            DomChange.setsAttr(doc.bodyAttr,body);
            
            // routeWrap
            // les attributs de routeWrap sont effacés et remplacés seulement si routeWrap n'est pas body
            const routeWrap = trigHdlr(this,'doc:getRouteWrap');
            let contentTarget = doc.body;
            if($option.routeWrap && !$(routeWrap).is("body"))
            {
                const routeWrapTarget = qs(contentTarget,$option.routeWrap);
                if(routeWrapTarget != null)
                {
                    contentTarget = routeWrapTarget;
                    const routeWrapAttributes = Dom.attr(contentTarget);
                    DomChange.emptyAttr(routeWrap);
                    DomChange.setsAttr(routeWrapAttributes,routeWrap);
                }
            }
            const contentHtml = $(contentTarget).html();
            $(routeWrap).html(contentHtml);
        }
        
        return r;
    }
    
    return this;
}