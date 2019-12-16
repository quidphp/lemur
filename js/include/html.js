/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// html
// script with functions for parsing html
const Html = Lemur.Html = {
    
    // parse
    // parse une string html, retourne un objet avec les nodes
    // remplace les balises sensibles par des div (comme dans head et script)
    parse: function(html)
    {
        let r = null;
        
        if(Str.isNotEmpty(html))
        {
            html = html.replace(/<\!DOCTYPE[^>]*>/i, '');
            html = html.replace(/<(html|head|body|script)([\s\>])/gi,'<div data-tag="$1"$2');
            html = html.replace(/<\/(html|head|body|script)\>/gi,'</div>');
            
            html = Str.trim(html);
            r = $.parseHTML(html);
        }

        return r;
    },


    // doc
    // prend une string html
    // retourne un objet avec les différents éléments d'un document décortiqués
    doc: function(html)
    {
        let r = {
            html: null,
            htmlAttr: null,
            head: null,
            headAttr: null,
            title: '?',
            titleHtml: '?',
            meta: null,
            body: null,
            bodyAttr: null
        };
        const doc = this.parse(html);
        
        r.html = Arr.valueFirst(doc);
        $(r.html).removeAttr('data-tag');
        r.htmlAttr = Dom.attr(r.html);
        
        r.head = Selector.scopedQuery(r.html,"[data-tag='head']");
        r.body = Selector.scopedQuery(r.html,"[data-tag='body']");
        
        if(r.head != null)
        {
            const title = Selector.scopedQuery(r.head,"title");
            
            $(r.head).removeAttr('data-tag');
            r.headAttr = Dom.attr(r.head);
            r.title = (title != null)? $(title).text():'?';
            r.titleHtml = r.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
            r.meta = Selector.scopedQueryAll(r.head,"meta");
        }
        
        if(r.body != null)
        {
            $(r.body).removeAttr('data-tag');
            r.bodyAttr = Dom.attr(r.body);
        }
        
        else
        {
            const html = Dom.outerHtml(doc);
            let newBody = "<div data-tag='body'>"+html+"</div>";
            newBody = $.parseHTML(newBody);
            r.body = Arr.valueFirst(newBody);
        }
        
        return r;
    }
}