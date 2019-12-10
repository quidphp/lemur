/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// xhr
// script with some logic for ajax calls and xhr object
const Xhr = Lemur.Xhr = {
    
    // trigger
    // fonction utilisé pour lancer une requête ajax
    // retourne false ou un objet promise ajax
    trigger: function(node,option)
    {
        let r = null;
        const config = Object.assign({
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
                Evt.triggerFunc(node,'ajax:progress',percent,progressEvent);
            },
            beforeSend: function(jqXHR,settings) {
                Evt.triggerFunc(node,'ajax:before',jqXHR,settings);
            },
            success: function(data,textStatus,jqXHR) {
                Evt.triggerFunc(node,'ajax:success',data,textStatus,jqXHR);
            },
            error: function(jqXHR,textStatus,errorThrown) {
                const parsedError = this.parseError(jqXHR.responseText,textStatus);
                Evt.triggerFunc(node,'ajax:error',parsedError,jqXHR,textStatus,errorThrown);
            },
            complete: function(jqXHR,textStatus) {
                Evt.triggerFunc(node,'ajax:complete',jqXHR,textStatus);
            }
        },option);
        
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
            
            r = $.ajax(config);
        }
        
        return r;
    },


    // configFromNode
    // met à jour le tableau de config à partir de la tag
    configFromNode: function(node,config)
    {
        let r = (Pojo.is(config))? config:{};
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
                
                if(clicked != null)
                {
                    const clickedName = $(clicked).attr('name');
                    
                    if(Str.isNotEmpty(clickedName))
                    {
                        const clickedVal = Dom.value(clicked);
                        formData.append(clickedName,clickedVal);
                    }
                }
                
                r.data = formData;
            }
            
            else
            r.data = $(node).data('data');
        }
        
        return r;
    },
    
    
    // parseError
    // cette méthode gère l'affichage pour un xhr en erreur
    parseError: function(responseText,textStatus)
    {
        let r = textStatus;
        
        if(Str.isNotEmpty(responseText))
        {
            r = responseText;
            let html;
            const parse = Html.parse(responseText);
            
            if(Arr.isNotEmpty(parse))
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