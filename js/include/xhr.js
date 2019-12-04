/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// xhr
// script with some logic for ajax calls and xhr object
const Xhr = new function() 
{
    // instance
    const $inst = this;
    
    
    // trigger
    // fonction utilisé pour lancer une requête ajax
    // retourne false ou un objet promise ajax
    this.trigger = function(node,config,tag)
    {
        let r = null;

        const options = {
            url: Evt.triggerFunc(node,'ajax:getHref'),
            method: Evt.triggerFunc(node,'ajax:getMethod'),
            timeout: Evt.triggerFunc(node,'ajax:getTimeout') || 5000,
            data: Evt.triggerFunc(node,'ajax:getData'),
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
                        $this.progress(percent,event);
                    }
                });
            },
            progress: function(percent,progressEvent) {
                Evt.triggerCustom(node,'ajax:progress',percent,progressEvent);
            },
            beforeSend: function(jqXHR,settings) {
                Evt.triggerCustom(node,'ajax:beforeSend',jqXHR,settings);
            },
            success: function(data,textStatus,jqXHR) {
                Evt.triggerCustom(node,'ajax:success',data,textStatus,jqXHR);
            },
            error: function(jqXHR,textStatus,errorThrown) {
                const parsedError = $inst.parseError(jqXHR.responseText,textStatus);
                Evt.triggerCustom(node,'ajax:error',parsedError,jqXHR,textStatus,errorThrown);
            },
            complete: function(jqXHR,textStatus) {
                Evt.triggerCustom(node,'ajax:complete',jqXHR,textStatus);
            }
        };
        
        config = Obj.replace(options,config);
        
        if(tag === true)
        $inst.configFromNode(node,config);
        
        if(Str.isNotEmpty(config.url) && Evt.triggerFunc(node,'ajax:confirm') !== false)
        {
            if(config.method == null)
            config.method = 'get';
            
            config.method = config.method.toUpperCase();
            
            if(config.data instanceof FormData)
            {
                config.processData = false;
                config.contentType = false;
            }

            Evt.triggerCustom(node,'ajax:before',config);

            r = $.ajax(config);
        }
        
        return r;
    }


    // configFromNode
    // met à jour le tableau de config à partir de la tag
    this.configFromNode = function(node,config)
    {
        let r = (Obj.isPlain(config))? config:{};
        const tagName = Dom.tag(node);

        if(r.url == null)
        r.url = (tagName === 'form')? $(node).attr("action"):($(node).prop("href") || $(node).data('href'));

        if(r.method == null)
        r.method = (tagName === 'form')? $(node).attr("method"):$(node).data("method");
        
        if(r.data == null)
        {
            if(tagName === 'form')
            {
                const formData = new FormData($(node)[0]);
                const clicked = Evt.triggerFunc(node,'form:getClickedSubmit');
                
                if(clicked != null && clicked.length && Str.isNotEmpty(clicked.attr('name')))
                formData.append(clicked.attr('name'),clicked.val());
                
                r.data = formData;
            }
            
            else
            r.data = $(node).data('data');
        }
        
        return r;
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
            const parse = Html.parse(responseText);
            
            if(parse != null && parse.length)
            {
                html = Dom.outerHtml(parse.find(".ajax-parse-error").first());
                
                if(Vari.isEmpty(html))
                html = parse.find("body,[data-tag='body']").first().html();
                
                if(Str.isNotEmpty(html))
                r = html;
            }
        }

        return r;
    }
}

// export
Lemur.Xhr = Xhr;