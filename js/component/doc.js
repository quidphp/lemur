/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// doc
// root component for a document node
const Doc = Component.Doc = function(option)
{
    // document node
    Dom.checkNode(this,document);
    

    // option
    const $option = Pojo.replace({
        routeWrap: "> .route-wrap"
    },option);
    
    
    // components
    Component.History.call(this,$option);
    Component.KeyboardEscape.call(this);
    Component.Win.call(window);
    Component.WinUnload.call(window);
    
    
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
        
        // crée le document à partir d'un objet doc, passé dans dom.parse
        make: function(doc) {
            return docMake.call(this,doc);
        },
        
        // démonte la page courante, crée et monte la nouvelle page
        makeMount: function(doc,isError) {
            trigHdlr(this,'doc:unmount');
            trigHdlr(this,'doc:make',doc);
            trigHdlr(window,'win:scrollTo',0);
            
            trigHdlr(this,'doc:mount',false,isError);
            
            const html = trigHdlr(this,'doc:getHtml');
            setTimeout(function() {
                setAttr(html,'data-status','ready');
            },100);
        },
        
        // lance les évènements pour monter le document dans le bon order
        mount: function(initial,isError) {
            docMount.call(this,initial,isError);
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
        trigEvt(this,'click');
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
            let contentHtml = '';
            let contentTarget = doc.body;
            
            if(contentTarget != null)
            {
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
                contentHtml = $(contentTarget).html();
            }
            
            $(routeWrap).html(contentHtml);
        }
        
        return r;
    }
    
    
    // docMount
    const docMount = function(initial,isError)
    {
        const html = trigHdlr(this,'doc:getHtml');
        const routeWrap = trigHdlr(this,'doc:getRouteWrap');
        
        if(initial === true)
        {
            const body = trigHdlr(this,'doc:getBody');
            trigEvt(this,'doc:mountInitial',body,isError);
            trigEvt(this,'doc:mountCommon',body,isError);
        }
        
        else
        trigEvt(this,'doc:mountCommon',routeWrap,isError);
        
        trigEvt(this,'doc:mountPage',routeWrap,isError);
        
        if(isError !== true)
        {
            const group = getAttr(html,"data-group");
            if(Str.isNotEmpty(group))
            trigEvt(this,'group:'+group,routeWrap);
            
            const route = getAttr(html,"data-route");
            if(Str.isNotEmpty(route))
            trigEvt(this,'route:'+route,routeWrap);
        }
        
        trigEvt(this,'doc:mounted',routeWrap,isError);
    }
    
    
    // docUnmount
    const docUnmount = function()
    {
        const html = trigHdlr(this,'doc:getHtml');
        const body = trigHdlr(this,'doc:getBody');
        const routeWrap = trigHdlr(this,'doc:getRouteWrap');
        
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
    
    return this;
}