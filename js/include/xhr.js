/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// xhr
// script with some logic for ajax calls and xhr object
quid.xhr = new function() 
{
    // instance
    var $inst = this;
    
    
    // trigger
    // fonction utilisé pour lancer une requête ajax
    // retourne false ou un objet promise ajax
    this.trigger = function(node,config,tag)
    {
        var r = null;
        var triggerFunc = quid.event.triggerFunc;
        var triggerCustom = quid.event.triggerCustom;
        
        var options = {
            url: triggerFunc(node,'ajax:getHref'),
            method: triggerFunc(node,'ajax:getMethod'),
            timeout: triggerFunc(node,'ajax:getTimeout') || 5000,
            data: triggerFunc(node,'ajax:getData'),
            processData: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            xhr: function() {
                var r = this.originalXHR;
                
                if(r == null)
                {
                    r = this.originalXHR = new XMLHttpRequest()
                    this.xhrProgress();
                }
                
                return r;
            },
            xhrProgress: function() {
                var xhr = this.xhr();
                var $this = this;
                xhr.upload.addEventListener("progress", function(event) {
                    if(event.lengthComputable === true)
                    {
                        var percent = parseInt((event.loaded / event.total * 100));
                        $this.progress(percent,event);
                    }
                });
            },
            progress: function(percent,progressEvent) {
                triggerCustom(node,'ajax:progress',percent,progressEvent);
            },
            beforeSend: function(jqXHR,settings) {
                triggerCustom(node,'ajax:beforeSend',jqXHR,settings);
            },
            success: function(data,textStatus,jqXHR) {
                triggerCustom(node,'ajax:success',data,textStatus,jqXHR);
            },
            error: function(jqXHR,textStatus,errorThrown) {
                var parsedError = $inst.parseError(jqXHR.responseText,textStatus);
                triggerCustom(node,'ajax:error',parsedError,jqXHR,textStatus,errorThrown);
            },
            complete: function(jqXHR,textStatus) {
                triggerCustom(node,'ajax:complete',jqXHR,textStatus);
            }
        };
        
        config = quid.obj.replace(options,config);
        
        if(tag === true)
        $inst.configFromNode(node,config);

        if(quid.str.isNotEmpty(config.url) && triggerFunc(node,'ajax:confirm') !== false)
        {
            if(config.method == null)
            config.method = 'get';
            
            config.method = config.method.toUpperCase();
            
            if(config.data instanceof FormData)
            {
                config.processData = false;
                config.contentType = false;
            }

            triggerCustom(node,'ajax:before',config);

            r = $.ajax(config);
        }
        
        return r;
    }


    // configFromNode
    // met à jour le tableau de config à partir de la tag
    this.configFromNode = function(node,config)
    {
        var r = (quid.obj.isPlain(config))? config:{};
        var tagName = quid.node.tag(node);

        if(r.url == null)
        r.url = (tagName === 'form')? $(node).attr("action"):($(node).prop("href") || $(node).data('href'));

        if(r.method == null)
        r.method = (tagName === 'form')? $(node).attr("method"):$(node).data("method");
        
        if(r.data == null)
        {
            if(tagName === 'form')
            {
                var formData = new FormData($(node)[0]);
                var clicked = triggerFunc(node,'form:getClickedSubmit');
                
                if(clicked != null && clicked.length && quid.str.isNotEmpty(clicked.attr('name')))
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
        var r = textStatus;
        
        if(quid.str.isNotEmpty(responseText))
        {
            r = responseText;
            var html;
            var parse = quid.html.parse(responseText);
            
            if(parse != null && parse.length)
            {
                html = quid.node.outerHtml(parse.find(".ajax-parse-error").first());
                
                if(quid.vari.isEmpty(html))
                html = parse.find("body,[data-tag='body']").first().html();
                
                if(quid.str.isNotEmpty(html))
                r = html;
            }
        }

        return r;
    }
};