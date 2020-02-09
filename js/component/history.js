/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// history
// component managing site navigation with the HistoryAPI
Component.History = function(option)
{
    // document node
    Vari.check(this,document);
    
    
    // option
    const $option = Pojo.replace({
        anchor: "a:not([target='_blank']):not([data-navigation='0']):not([data-modal]):not([href^='mailto:'])",
        form: "form:not([data-navigation='0'])",
        responseUrl: 'QUID-URI',
        timeout: 30000
    },option);
    
    
    // variable
    let $history = (Win.hasHistoryApi())? window.history:null;
    let $initial = HistoryState.make(location.href,this.title);
    let $previous = $initial;
    
    
    // handler
    setHdlrs(this,'history:',{
        
        // retourne vrai si history api est activé
        hasApi: function() {
            return $history != null;
        },
        
        // retourne l'état initial
        getInitialState: function() {
            return $initial;
        },
        
        // retourne l'état précédent
        getPreviousState: function() {
            return $previous;
        },
        
        // fait une redirection dure vers une nouvelle uri
        redirect: function(uri) {
            location.href = uri;
        },
        
        // retourne vrai si le chargement de la navigation est présentement active
        isLoading: function() {
            let r = false;
            const ajax = getData(this,'doc-ajax');
            
            if(ajax != null && ajax.readyState < 4)
            r = true;
            
            return r;
        },
        
        // retourne vrai si l'url de l'état est la même que l'url courante
        isCurrentStateUrl: function(state) {
            const current = trigHdlr(this,'history:getCurrentState');
            return (state.url === current.url);
        },
        
        // retourne l'état courant
        getCurrentState: function() {
            return HistoryState.make(location.href,this.title);
        },
        
        // annule et détruit l'objet ajax si existant
        cancelAjax: function() {
            let r = false;
            
            if(trigHdlr(this,'history:isLoading') === true)
            {
                const ajax = getData(this,'doc-ajax');
                ajax.onreadystatechange = Func.noop();
                ajax.abort();
            }
            
            Doc.removeData(this,'doc-ajax');
            
            return r;
        },
        
        // replace l'état courant par une nouvelle uri
        // le premier argument peut être une uri ou un objet state
        // retourne null ou le nouveau state
        replaceState: function(uriState,title) {
            let r = null;
            uriState = prepareState(uriState,title);
            
            if($history != null && uriState != null)
            {
                $history.replaceState(uriState,uriState.title,uriState.url);
                r = uriState;
            }
            
            return r;
        },
        
        // ajoute un élément à l'historique
        // le premier argument peut être une uri ou un objet state
        // retourne null ou le nouveau state
        pushState: function(uriState,title) {
            let r = null;
            uriState = prepareState(uriState,title);
            
            if($history != null && uriState != null && !trigHdlr(this,'history:isCurrentStateUrl',uriState))
            {
                $history.pushState(uriState,uriState.title,uriState.url);
                r = uriState;
            }
            
            return r;
        },
        
        // permet de faire un replaceState avec un nouveau hash
        // retourne null ou le nouveau state
        replaceHash: function(value,title) {
            Str.check(value);
            value = Uri.makeHash(value,true);
            return trigHdlr(this,'history:replaceState',value,title);
        },
        
        // permet de faire un pushState avec un nouveau hash
        // retourne null ou le nouveau state, si null va faire le changement via window.location
        pushHash: function(value,title) {
            Str.check(value);
            value = Uri.makeHash(value,true);
            return trigHdlr(this,'history:pushState',value,title);
        },
        
        // gère une nouvelle entrée à l'historique à partir d'un event
        event: function(srcEvent) {
            return historyEvent.call(this,srcEvent);
        },
        
        // gère une nouvelle entrée à l'historique à partir d'une node
        // possible de fournir un event ou un string type en deuxième argument
        node: function(node,eventOrType) {
            return historyNode.call(this,node,eventOrType);
        },
        
        // gère une nouvelle entrée à l'historique à partir d'un href
        // possible de soumettre une node ou un event en deuxième argument
        href: function(href,nodeOrEvent) {
            return historyHref.call(this,href,nodeOrEvent);
        }
    });
    
    
    // setup
    // setup seulement s'il y a un historique
    aelOnce(this,'component:setup',function() {
        if($history)
        {
            $history.scrollRestoration = 'manual';
            bindDocument.call(this);
            bindWindow.call(this);
        }
    });
    
    
    // prepareState
    // utilisé par push et replaceHash
    // utilse no emptyHash (donc si finit par # retire)
    const prepareState = function(uriState,title) 
    {
        let r = null;
        
        if(Pojo.is(uriState))
        {
            title = uriState.title || title;
            uriState = uriState.url;
        }
        
        if(Str.is(uriState))
        r = HistoryState.make(uriState,title,true);
        
        return r;
    }
    
    
    // bindDocument
    // applique les bindings permanents sur le document, via delegate
    const bindDocument = function()
    {
        // anchor click
        aelDelegate(this,'click',$option.anchor,function(event) { 
            let r = true;
            trigHdlr(document,'history:event',event);
            
            if(event.defaultPrevented === true)
            r = false;
            
            return r;
        });
        
        // submit
        aelDelegate(this,'submit',$option.form,function(event) { 
            let r = true;
            trigHdlr(document,'history:event',event);
            
            if(event.defaultPrevented === true)
            r = false;
            
            return r;
        });
    }
    
    
    // bindWindow
    // applique les bindings permanents sur la window, pour le popstate
    const bindWindow = function()
    {
        ael(window,'popstate',function(event) {
            const state = event.state || trigHdlr(document,'history:getCurrentState');
            const isValid = HistoryState.isChangeValid(state,$previous,true);
            
            if(isValid === true)
            {
                if(trigHdlr(this,'windowUnload:isValid') === true)
                makeAjax.call(document,state,event);
                
                else
                trigHdlr(this,'history:pushState',$previous);
            }
            
            // hash change
            else if(Uri.isSamePathQuery(state.url,$previous.url) && (Uri.hasFragment(state.url) || Uri.hasFragment($previous.url)))
            {
                $previous = state;
                trigEvt(window,'hashChange:history',true);
            }
        });
    }
    
    
    // isValidEvent
    // retourne vrai si l'événement est valide pour l'historique
    const isValidEvent = function(srcEvent)
    {
        let r = false;
        
        if(srcEvent instanceof Event)
        {
            const type = srcEvent.type;
            const node = Evt.getTriggerTarget(srcEvent);
            
            if(node != null)
            {
                if(type === 'click')
                r = !((srcEvent.which > 1 || srcEvent.metaKey || srcEvent.ctrlKey || srcEvent.shiftKey || srcEvent.altKey));
                
                else
                r = true;
            }
        }
        
        return r;
    }
    
    
    // isValidNode
    // retourne vrai si la node est valide pour l'historique
    const isValidNode = function(node,type)
    {
        let r = false;
        const href = Ele.getUri(node);
        
        if(Str.isNotEmpty(href))
        {
            if(type === 'submit')
            r = Nod.match(node,$option.form);
            
            else
            r = Nod.match(node,$option.anchor);
        }
        
        return r;
    }
    

    // historyEvent
    // gère une nouvelle entrée à l'historique à partir d'un event
    const historyEvent = function(srcEvent)
    {
        let r = false;
        
        if(isValidEvent.call(this,srcEvent))
        {
            const node = Evt.getTriggerTarget(srcEvent);
            r = historyNode.call(this,node,srcEvent);
        }
        
        return r;
    }
    
    
    // historyNode
    // gère une nouvelle entrée à l'historique à partir d'une node
    // event type peut être un event, ou un type, par défaut utilise le type click
    const historyNode = function(node,eventOrType)
    {
        let r = false;
        let nodeOrEvent = node;
        let type = (Ele.isTag(node,'form'))? 'submit':'click';
        
        if(eventOrType instanceof Event)
        {
            nodeOrEvent = eventOrType;
            type = event.type;
        }
        
        else if(Str.isNotEmpty(eventOrType))
        type = eventOrType;
        
        if(isValidNode.call(this,node,type))
        {
            const href = Ele.getUri(node);
            r = historyHref.call(this,href,nodeOrEvent);
        }
        
        return r;
    }
    
    
    // historyHref
    // gère une nouvelle entrée à l'historique à partir d'un href avec possiblement un event
    // le deuxième argument peut être une node ou un event
    const historyHref = function(href,nodeOrEvent)
    {
        let r = false;
        let srcEvent = (nodeOrEvent instanceof Event)? nodeOrEvent:null;
        
        if(trigHdlr(this,'history:isLoading') === false)
        {
            if(Uri.isInternal(href))
            {
                const current = trigHdlr(this,'history:getCurrentState');
                const state = HistoryState.make(href);
                const isValid = HistoryState.isChangeValid(state,current);

                if(isValid === true)
                {
                    if(trigHdlr(window,'windowUnload:isValid') === true)
                    r = (makeAjax.call(this,state,nodeOrEvent))? true:false;
                    else
                    r = true;
                }
                
                // hash change
                else if(Uri.isHashChange(state.url,current.url))
                {
                    r = true;
                    trigHdlr(this,'history:pushState',state);
                    $previous = state;
                    trigEvt(window,'hashChange:history');
                }
                
                if(r === true)
                {
                    const targetsTriggered = getTargetsTriggered.call(this,nodeOrEvent);
                    setAttr(targetsTriggered,'data-triggered',1);
                    
                    if(srcEvent != null)
                    Evt.preventStop(srcEvent);
                }
            }
            
            else if(Uri.isExternal(href))
            trigHdlr(document,'history:redirect',href);
        }
        
        else if(srcEvent != null)
        Evt.preventStop(srcEvent);
        
        return r;
    }
    
    
    // getTargetsTriggered
    // retourne un tableau avec les targets triggered à partir d'une node ou un event
    const getTargetsTriggered = function(nodeOrEvent)
    {
        let r = null;
        
        if(nodeOrEvent != null)
        {
            const node = (Ele.is(nodeOrEvent))? nodeOrEvent:Evt.getTriggerTarget(nodeOrEvent);
            const tag = Ele.tag(node);
            
            if(tag != null)
            {
                if(tag === 'form')
                r = trigHdlr(node,'form:getClickedSubmits');
                
                else
                r = [node];
            }
        }
        
        return r;
    }
    
    
    // makeHistoryType
    // retourne le type d'historique, met à jour l'objet config si c'est form
    // le deuxième argument peut être une node ou un event
    const makeHistoryType = function(config,nodeOrEvent)
    {
        let r = 'push';
        
        if(nodeOrEvent != null)
        {
            if(nodeOrEvent instanceof Event && nodeOrEvent.type === 'popstate')
            r = 'popstate';
            
            else
            {
                const node = (Ele.is(nodeOrEvent))? nodeOrEvent:Evt.getTriggerTarget(nodeOrEvent);
                const tag = Ele.tag(node);
                
                if(tag === 'form')
                {
                    Xhr.configFromNode(node,config);
                    
                    if(trigHdlr(node,'form:hasFiles'))
                    config.timeout = 0;
                    
                    r = 'form';
                }
            }
        }
        
        return r;
    }
    

    // makeAjax
    // crée et retourne l'objet ajax
    const makeAjax = function(state,nodeOrEvent)
    {
        let r = null;

        if(HistoryState.is(state))
        {
            trigHdlr(this,'doc:setStatusLoading');

            const config = {
                url: state.url,
                timeout: $option.timeout,
                progress: function(percent,event,xhr) {
                    trigEvt(document,'doc:ajaxProgress',percent,event);
                },
                success: function(xhr) {
                    afterAjax.call(document,type,state,xhr,false);
                },
                error: function(xhr) {
                    afterAjax.call(document,type,state,xhr,true);
                }
            };
            
            const type = makeHistoryType(config,nodeOrEvent);
            
            r = Xhr.trigger(config);
            trigHdlr(this,'history:cancelAjax');

            if(r != null)
            setData(this,'doc-ajax',r);
        }
        
        return r;
    }
    

    // afterAjax
    // callback après le ajax
    const afterAjax = function(type,state,xhr,isError)
    {
        if(Str.isNotEmpty(type) && HistoryState.is(state) && Obj.is(xhr))
        {
            const data = xhr.responseText;
            const currentUri = (Str.isNotEmpty($option.responseUrl))? xhr.getResponseHeader($option.responseUrl):null;
            const current = trigHdlr(this,'history:getCurrentState');

            if(Str.is(data))
            {
                const doc = Dom.doc(data);
                
                if(type === 'push' || type === 'form')
                {
                    state = HistoryState.make(state.url,doc.title);
                    
                    if(state.url !== current.url)
                    {
                        if(type === 'push' || !Uri.isSamePathQuery(current.url,currentUri))
                        trigHdlr(this,'history:pushState',state);
                    }
                }
                
                if(Str.is(currentUri) && state.url !== currentUri)
                {
                    if(!Uri.isInternal(state.url,currentUri) || !Uri.isSamePathQuery(state.url,currentUri))
                    state = trigHdlr(this,'history:replaceState',currentUri,state.title);
                }	
                
                trigHdlr(this,'doc:makeMount',doc,isError);
                
                Ele.remove(doc.html);
                $previous = state;
            }
        }
    }
    
    return this;
}
