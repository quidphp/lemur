/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// doc
// root component for a document node
Component.Doc = function(option)
{
    // document node
    Vari.check(this,document);
    

    // option
    const $option = Pojo.replace({
        mountTimeout: 0,
        routeWrap: "> .route-wrap",
        scrollTop: true
    },option);
    
    
    // components
    Component.History.call(this,$option);
    Component.KeyboardEscape.call(this);
    Component.Window.call(window);
    Component.WindowUnload.call(window);
    
    
    // handler
    setHdlrs(this,'doc:',{
        
        // retourne la node html
        getHtml: function() {
            return qs(this,'html');
        },
        
        // retourne la node body
        getBody: function() {
            return qs(this,'body');
        },
        
        // retourne un tableau avec les nodes html et body
        getHtmlBody: function() {
            return [trigHdlr(this,'doc:getHtml'),trigHdlr(this,'doc:getBody')]
        },
        
        // retourne la node du route wrap
        // seul le contenu dans cette node est remplacé au chargement d'une nouvelle page
        getRouteWrap: function() {
            let r = trigHdlr(this,'doc:getBody');

            if($option.routeWrap)
            r = qs(r,$option.routeWrap);
            
            return r;
        },
        
        // met le statut de la balise html à loading
        setStatusLoading: function() {
            const html = trigHdlr(this,'doc:getHtml');
            setAttr(html,'data-status','loading');
        },
        
        // désactive le scrollTop lors du prochain chargement de page seulement
        skipNextScrollTop: function() {
            $option.scrollTop = null;
        },
        
        // crée le document à partir d'un objet doc, passé dans dom.parse
        make: function(doc) {
            return docMake.call(this,doc);
        },
        
        // démonte la page courante, crée et monte la nouvelle page
        makeMount: function(doc,isError) {
            trigHdlr(this,'doc:unmount');
            trigHdlr(this,'doc:make',doc);

            if($option.scrollTop === true)
            trigHdlr(window,'window:scrollTo',0);
            
            if($option.scrollTop == null)
            $option.scrollTop = true;
            
            trigHdlr(this,'doc:mount',false,isError);
        },
        
        // lance les évènements pour monter le document dans le bon order
        mount: function(initial,isError) {
            trigEvt(this,'doc:mountImmediate',initial,isError);
            Func.timeout($option.mountTimeout,function() {
                const html = trigHdlr(this,'doc:getHtml');
                docMount.call(this,initial,isError);
                setAttr(html,'data-status','ready');
            },this);
        },

        // lance les évènements pour démonter le document dans le bon order
        unmount: function() {
            docUnmount.call(this);
        },
        
        // permet de faire les bindings common sur une node
        mountNodeCommon: function(node) {
            trigEvt(this,'doc:mountNode',node);
            trigEvt(this,'doc:mountCommon',node);
        }
    });
    
    
    // event
    
    // keyboardEscape
    // trigger un click
    ael(this,'keyboardEscape:catched',function() {
        trigBubble(this,'click');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigHdlr(this,'doc:mount',true);
    });
    
    
    // docMake
    const docMake = function(doc)
    {
        let r = false;
        
        if(Pojo.is(doc) && doc.body != null)
        {
            r = true;
            
            // html
            // les attributs de html sont remplacés (les attributs existants ne sont pas effacés)
            const html = trigHdlr(this,'doc:getHtml');
            if(Pojo.isNotEmpty(doc.htmlAttr))
            Ele.setsAttr(html,doc.htmlAttr);
            
            // head
            const head = qs(html,'head');
            const title = qs(head,'title');
            
            // title
            if(title != null && Str.isNotEmpty(doc.title))
            {
                document.title = doc.title;
                setHtml(title,doc.titleHtml);
            }
            
            // meta
            const meta = qsa(head,'meta');
            Ele.remove(meta);
            Ele.prepend(head,doc.meta);
            
            // body
            // les attributs de body sont effacés et remplacés
            const body = trigHdlr(this,'doc:getBody');
            Ele.emptyAttr(body);
            if(Pojo.isNotEmpty(doc.bodyAttr))
            Ele.setsAttr(body,doc.bodyAttr);
            
            // routeWrap
            // les attributs de routeWrap sont effacés et remplacés seulement si routeWrap n'est pas body
            const routeWrap = trigHdlr(this,'doc:getRouteWrap');
            let contentHtml = '';
            let contentTarget = doc.body;
            
            if(contentTarget != null)
            {
                if($option.routeWrap && !Nod.match(routeWrap,"body"))
                {
                    const routeWrapTarget = qs(contentTarget,$option.routeWrap);
                    if(routeWrapTarget != null)
                    {
                        contentTarget = routeWrapTarget;
                        const routeWrapAttributes = Ele.attr(contentTarget);
                        Ele.emptyAttr(routeWrap);
                        
                        if(Pojo.isNotEmpty(routeWrapAttributes))
                        Ele.setsAttr(routeWrap,routeWrapAttributes);
                    }
                }
                contentHtml = getHtml(contentTarget);
            }
            
            setHtml(routeWrap,contentHtml);
        }
        
        return r;
    }
    
    
    // docMount
    const docMount = function(initial,isError)
    {
        const html = trigHdlr(this,'doc:getHtml');
        const routeWrap = trigHdlr(this,'doc:getRouteWrap');
        const body = trigHdlr(this,'doc:getBody');
        
        if(initial === true)
        trigEvt(this,'doc:mountInitial',body,isError);
        
        if(routeWrap != null)
        {
            trigEvt(this,'doc:mountCommon',routeWrap,isError);
            trigEvt(this,'doc:mountPage',routeWrap,isError,initial);
            
            if(isError !== true)
            {
                const group = getAttr(html,"data-group");
                if(Str.isNotEmpty(group))
                trigEvt(this,'group:'+group,routeWrap);
                
                const route = getAttr(html,"data-route");
                if(Str.isNotEmpty(route))
                trigEvt(this,'route:'+route,routeWrap);
            }
            
            trigEvt(this,'doc:mountedPage',routeWrap,isError);
        }
    }
    
    
    // docUnmount
    const docUnmount = function()
    {
        const html = trigHdlr(this,'doc:getHtml');
        const body = trigHdlr(this,'doc:getBody');
        const routeWrap = trigHdlr(this,'doc:getRouteWrap');
        
        if(routeWrap != null)
        {
            trigEvt(this,'doc:unmountCommon',routeWrap);
            trigEvt(this,'doc:unmountPage',routeWrap);
            
            const group = getAttr(html,"data-group");
            if(Str.isNotEmpty(group))
            trigEvt(this,'group:'+group+':unmount',routeWrap);
            
            const route = getAttr(html,"data-route");
            if(Str.isNotEmpty(route))
            trigEvt(this,'route:'+route+':unmount',routeWrap);
                    
            trigEvt(this,'doc:unmounted',routeWrap);
        }
    }
    
    return this;
}