/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// html
// script with functions for parsing html
const Html = Lemur.Html = {
    
    // get
    // retourne le html dans une node ou un tableau de plusieurs nodes
    get: function(value)
    {
        let r = '';
        
        if(Str.is(value))
        r = value;
        
        else if(Scalar.is(value))
        r = Str.cast(value);
        
        else
        r = Dom.outerHtml(value);
        
        return r;
    },
    
    
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
            r = Arr.valueFirst(r);
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
        
        r.html = doc;
        DomChange.removeAttr(r.html,'data-tag');
        r.htmlAttr = Dom.attr(r.html);
        
        r.head = Selector.scopedQuery(r.html,"[data-tag='head']");
        r.body = Selector.scopedQuery(r.html,"[data-tag='body']");
        
        if(r.head != null)
        {
            const title = Selector.scopedQuery(r.head,"title");
            
            DomChange.removeAttr(r.head,'data-tag');
            r.headAttr = Dom.attr(r.head);
            r.title = (title != null)? Dom.getText(title):'?';
            r.titleHtml = r.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
            r.meta = Selector.scopedQueryAll(r.head,"meta");
        }
        
        if(r.body != null)
        {
            DomChange.removeAttr(r.body,'data-tag');
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