/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// html
// script with functions for parsing html
const Html = new function() 
{
    // instance
    const $inst = this;
    
    
    // parse
    // parse une string html, retourne un objet avec les nodes
    // remplace les balises sensibles par des div (comme dans head et script)
    this.parse = function(html)
    {
        let r = null;
        html = Str.cast(html);
        html = html.replace(/<\!DOCTYPE[^>]*>/i, '');
        html = html.replace(/<(html|head|body|script)([\s\>])/gi,'<div data-tag="$1"$2');
        html = html.replace(/<\/(html|head|body|script)\>/gi,'</div>');
        
        html = Str.trim(html);
        const nodes = $.parseHTML(html);
        
        r = $(nodes);

        return r;
    }


    // doc
    // prend une string html
    // retourne un objet avec les différents éléments d'un document décortiqués
    this.doc = function(html)
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
        const doc = $inst.parse(html);
        
        r.html = doc;
        r.html.removeAttr('data-tag');
        r.htmlAttr = Dom.attr(r.html);
        
        r.head = doc.find("[data-tag='head']").first();
        r.body = doc.find("[data-tag='body']").first();
        
        if(r.head.length)
        {
            r.head.removeAttr('data-tag');
            r.headAttr = Dom.attr(r.head);
            r.title = r.head.find("title").first().text() || '?';
            r.titleHtml = r.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
            r.meta = r.head.find("meta");
        }
        
        if(r.body.length)
        {
            r.body.removeAttr('data-tag');
            r.bodyAttr = Dom.attr(r.body);
        }
        
        else
        {
            const html = Dom.outerHtml(doc);
            const newBody = "<div data-tag='body'>"+html+"</div>";
            newBody = $.parseHTML(newBody);
            r.body = $(newBody);
        }
        
        return r;
    }
}

// export
Lemur.Html = Html;