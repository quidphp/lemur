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
    
    
    // isStatusSuccess
    // retourne vrai si le statut est un succès
    this.isStatusSuccess = function(value)
    {
        let r = false;
        Integer.check(value);
        
        if(value >= 200 && value < 400)
        r = true;
        
        return r;
    }
    
    
    // trigger
    // fonction utilisé pour lancer une requête ajax
    // retourne null ou un objet promise ajax
    this.trigger = function(config)
    {
        let r = null;
        config = prepareConfig(config);
        
        if(Str.isNotEmpty(config.url))
        {
            const xhr = new XMLHttpRequest();
            xhr.open(config.method, config.url, true);
            xhr.timeout = config.timeout;
            xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
            
            xhr.ontimeout = function() {
                if(Func.is(config.error))
                config.error(xhr);
            };
            xhr.onreadystatechange = function() {
                if(this.readyState === XMLHttpRequest.DONE)
                {
                    const isSuccess = $inst.isStatusSuccess(this.status);
                    
                    if(isSuccess === false && Func.is(config.error))
                    config.error(xhr);
                    
                    else if(isSuccess === true && Func.is(config.success))
                    config.success(xhr);
                    
                    if(Func.is(config.complete))
                    config.complete(xhr);
                }
            };
            
            if(xhr.upload != null)
            {
                xhr.upload.addEventListener("progress",function(event) {
                    if(Func.is(config.progress) && event.lengthComputable === true)
                    {
                        const percent = parseInt((event.loaded / event.total * 100));
                        config.progress(percent,event,xhr);
                    }
                });
            }
            
            if(Func.is(config.before))
            config.before(xhr);

            xhr.send(config.data);
            r = xhr;
        }
        
        return r;
    }

    
    // configFromString
    // retounre un tableau avec la string comme url
    this.configFromString = function(value)
    {
        Str.check(value,true);
        return {
            url: value
        };
    }
    
    
    // defaultConfig
    // retourne la configuration par défaut pour une requête ajax
    const defaultConfig = function()
    {
        return {
            url: undefined,
            method: undefined,
            data: undefined,
            timeout: 5000
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
        
        if(Pojo.is(config.data))
        {
            const parse = Uri.parse(config.url);
            const query = Uri.query(config.data).toString();
            parse.search = query;
            config.url = parse.toString();
        }
        
        config.data = (config.data instanceof FormData)? config.data:null;
        
        return config;
    }
    
    
    // configFromNode
    // met à jour le tableau de config à partir de la tag
    // retourne null si ajax:confirm est false
    this.configFromNode = function(node,config,events)
    {
        let r = null;
        
        if(Ele.is(node) && Target.triggerHandler(node,'ajax:confirm') !== false)
        {
            r = (Pojo.is(config))? config:{};
            const tagName = Ele.tag(node);
            
            if(r.url == null)
            r = configNodeUrl(r,node);

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
    const configNodeUrl = function(r,node)
    {
        r.url = Target.triggerHandler(node,'ajax:getUrl');
        
        if(r.url == null)
        r.url = Ele.getUri(node);
        
        return r;
    }
    
    
    // configNodeMethod
    // fait la configuration de la méthode pour une node
    const configNodeMethod = function(r,node,tagName)
    {
        r.method = Target.triggerHandler(node,'ajax:getMethod');
        
        if(r.method == null)
        {
            if(tagName === 'form')
            r.method = Ele.getAttr(node,"method") || 'get';
            
            else
            r.method = Ele.getAttr(node,'data-method') || 'get';
        }
        
        return r;
    }
    
    
    // configNodeData
    // fait la configuration des datas pour une node
    const configNodeData = function(r,node,tagName)
    {
        r.data = Target.triggerHandler(node,'ajax:getData');
        
        if(r.data == null && tagName === 'form')
        {
            const formData = new FormData(node);
            const clicked = Target.triggerHandler(node,'form:getClickedSubmit');
            
            if(clicked != null)
            {
                const clickedName = Ele.getAttr(clicked,'name');
                
                if(Str.isNotEmpty(clickedName))
                {
                    const clickedVal = Ele.getValue(clicked);
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
        config.before = function(xhr) {
            Target.triggerHandler(node,'ajax:before',xhr);
        };
        
        config.progress = function(percent,event,xhr) {
            Target.triggerHandler(node,'ajax:progress',percent,event,xhr);
        };
        
        config.success = function(xhr) {
            Target.triggerHandler(node,'ajax:success',xhr.responseText,xhr);
        };
        
        config.error = function(xhr) {
            const parsedError = $inst.parseError(xhr.responseText);
            Target.triggerHandler(node,'ajax:error',parsedError,xhr);
        };
        
        config.complete = function(xhr) {
            Target.triggerHandler(node,'ajax:complete',xhr);
        };
        
        return config;
    }
    
    
    // parseError
    // cette méthode gère l'affichage pour un xhr en erreur
    this.parseError = function(responseText)
    {
        let r = '';
        
        if(Str.isNotEmpty(responseText))
        {
            r = responseText;
            let html;
            const parse = Dom.parseOne(responseText);

            if(parse != null)
            {
                const ajaxParse = Nod.scopedQuery(parse,".ajax-parse-error");
                html = Ele.getOuterHtml(ajaxParse);
                
                if(Vari.isEmpty(html))
                {
                    const body = Nod.scopedQuery(parse,"body,[data-tag='body']");
                    if(body != null)
                    html = Ele.getHtml(body);
                }
                
                if(Str.isNotEmpty(html))
                r = html;
            }
        }

        return r;
    }
}