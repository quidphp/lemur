/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// xhr
// script with some logic for ajax calls and xhr object
const Xhr = Lemur.Xhr = new function()
{
    // inst
    const $inst = this;
    
    
    // trigger
    // fonction utilisé pour lancer une requête ajax
    // retourne null ou un objet promise ajax
    this.trigger = function(config)
    {
        let r = null;
        config = prepareConfig(config);
        
        if(Str.isNotEmpty(config.url))
        r = $.ajax(config);
        
        return r;
    }

    
    // defaultConfig
    // retourne la configuration par défaut pour une requête ajax
    const defaultConfig = function()
    {
        return {
            url: undefined,
            method: undefined,
            data: undefined,
            timeout: 5000,
            processData: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            xhr: function() {
                let r = this.originalXHR;
                
                if(r == null)
                {
                    r = this.originalXHR = new XMLHttpRequest()
                    this.xhrProgress();
                }
                
                return r;
            },
            xhrProgress: function() {
                const xhr = this.xhr();
                const $this = this;
                xhr.upload.addEventListener("progress",function(event) {
                    if(event.lengthComputable === true)
                    {
                        const percent = parseInt((event.loaded / event.total * 100));
                        
                        if($this.progress != null)
                        $this.progress(percent,event);
                    }
                });
            },
            progress: null
        };
    }
    
    
    // prepareConfig
    // dernière préparation à la configuration ajax
    const prepareConfig = function(config)
    {
        config = Pojo.replace(defaultConfig(),config);
        
        if(!Str.is(config.method))
        config.method = 'get';
        config.method = config.method.toUpperCase();
        
        if(config.data instanceof FormData)
        {
            config.processData = false;
            config.contentType = false;
        }
        
        return config;
    }
    
    
    // configFromNode
    // met à jour le tableau de config à partir de la tag
    // retourne null si ajax:confirm est false
    this.configFromNode = function(node,config,events)
    {
        let r = null;
        
        if(Dom.isNode(node) && Handler.trigger(node,'ajax:confirm') !== false)
        {
            r = (Pojo.is(config))? config:{};
            const tagName = Dom.tag(node);
            
            if(r.url == null)
            r = configNodeUrl(r,node,tagName);

            if(r.method == null)
            r = configNodeMethod(r,node,tagName);
            
            if(r.data == null)
            r = configNodeData(r,node,tagName);
            
            if(events === true)
            r = this.configNodeEvents(node,r);
            
            r = prepareConfig(r);
        }
        
        return r;
    }
    
    
    // configNodeUrl
    // fait la configuration de l'url pour une node
    const configNodeUrl = function(r,node,tagName)
    {
        r.url = Handler.trigger(node,'ajax:getUrl');
        
        if(r.url == null)
        {
            if(tagName === 'form')
            r.url = Dom.getAttr(node,"action");
            
            else
            r.url = Dom.getAttr(node,"href") || Dom.getAttr(node,'data-href');
        }
        
        return r;
    }
    
    
    // configNodeMethod
    // fait la configuration de la méthode pour une node
    const configNodeMethod = function(r,node,tagName)
    {
        r.method = Handler.trigger(node,'ajax:getMethod');
        
        if(r.method == null)
        {
            if(tagName === 'form')
            r.method = Dom.getAttr(node,"method") || 'get';
            
            else
            r.method = Dom.getAttr(node,'data-method') || 'get';
        }
        
        return r;
    }
    
    
    // configNodeData
    // fait la configuration des datas pour une node
    const configNodeData = function(r,node,tagName)
    {
        r.data = Handler.trigger(node,'ajax:getData');
        
        if(r.data == null && tagName === 'form')
        {
            const formData = new FormData(node);
            const clicked = Handler.trigger(node,'form:getClickedSubmit');
            
            if(clicked != null)
            {
                const clickedName = Dom.getAttr(clicked,'name');
                
                if(Str.isNotEmpty(clickedName))
                {
                    const clickedVal = Dom.value(clicked);
                    formData.append(clickedName,clickedVal);
                }
            }
            
            r.data = formData;
        }
        
        return r;
    }
    
    
    // configNodeEvents
    // fait la configuration des événements à envoyer à la node pour la requête ajax
    this.configNodeEvents = function(node,config)
    {
        config.progress = function(percent,progressEvent) {
            Handler.trigger(node,'ajax:progress',percent,progressEvent);
        };
        
        config.beforeSend = function(jqXHR,settings) {
            Handler.trigger(node,'ajax:before',jqXHR,settings);
        };
        
        config.success = function(data,textStatus,jqXHR) {
            Handler.trigger(node,'ajax:success',data,textStatus,jqXHR);
        };
        
        config.error = function(jqXHR,textStatus,errorThrown) {
            const parsedError = $inst.parseError(jqXHR.responseText,textStatus);
            Handler.trigger(node,'ajax:error',parsedError,jqXHR,textStatus,errorThrown);
        };
        
        config.complete = function(jqXHR,textStatus) {
            Handler.trigger(node,'ajax:complete',jqXHR,textStatus);
        };
        
        return config;
    }
    
    
    // parseError
    // cette méthode gère l'affichage pour un xhr en erreur
    this.parseError = function(responseText,textStatus)
    {
        let r = textStatus;
        
        if(Str.isNotEmpty(responseText))
        {
            r = responseText;
            let html;
            const parse = Arr.valueFirst(Html.parse(responseText));

            if(parse != null)
            {
                const ajaxParse = Selector.scopedQuerySelector(parse,".ajax-parse-error");
                html = Dom.outerHtml(ajaxParse);
                
                if(Vari.isEmpty(html))
                {
                    const body = Selector.scopedQuerySelector(parse,"body,[data-tag='body']");
                    html = $(body).html();
                }
                
                if(Str.isNotEmpty(html))
                r = html;
            }
        }

        return r;
    }
}