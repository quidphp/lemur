/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// dom
// script with functions related to html and dom
const Dom = Lemur.Dom = {
    
    // selectorInput
    // retourne un selector commun à utiliser pour les inputs
    selectorInput: function(all) 
    {
        let r = 'input,select,textarea,button';
        r += (all !== true)? "[type='submit']":'';
        
        return r;
    },
    
    
    // html
    // retourne le html dans une node ou un tableau de plusieurs nodes
    html: function(value)
    {
        let r = '';
        
        if(Str.is(value))
        r = value;
        
        else if(Scalar.is(value))
        r = Str.cast(value);
        
        else
        r = Ele.outerHtml(value);
        
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
        EleChange.removeAttr(r.html,'data-tag');
        r.htmlAttr = Ele.attr(r.html);
        
        r.head = Nod.scopedQuery(r.html,"[data-tag='head']");
        r.body = Nod.scopedQuery(r.html,"[data-tag='body']");
        
        if(r.head != null)
        {
            const title = Nod.scopedQuery(r.head,"title");
            
            EleChange.removeAttr(r.head,'data-tag');
            r.headAttr = Ele.attr(r.head);
            r.title = (title != null)? Ele.getText(title):'?';
            r.titleHtml = r.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
            r.meta = Nod.scopedQueryAll(r.head,"meta");
        }
        
        if(r.body != null)
        {
            EleChange.removeAttr(r.body,'data-tag');
            r.bodyAttr = Ele.attr(r.body);
        }
        
        else
        {
            const html = Ele.outerHtml(doc);
            let newBody = "<div data-tag='body'>"+html+"</div>";
            newBody = $.parseHTML(newBody);
            r.body = Arr.valueFirst(newBody);
        }
        
        return r;
    }
}