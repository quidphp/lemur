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
    
    
    // htmlStr
    // prend un maximum d'input et retourne une string html
    htmlStr: function(value)
    {
        let r = '';
        
        if(Str.is(value))
        r = value;
        
        else if(Scalar.is(value))
        r = Str.cast(value);
        
        else if(Doc.is(value))
        r = Doc.getHtml(value);
        
        else if(Ele.is(value))
        r = Ele.getOuterHtml(value);
        
        else if(Ele.are(value))
        r = Ele.getOuterHtml(value);
        
        return r;
    },
    
    
    // htmlNodes
    // prend un maximum d'input et retourne un tableau de nodes
    // possible de cloner
    htmlNodes: function(value,clone)
    {
        let r = [];
        
        if(Str.is(value))
        r = this.parse(value);
        
        else if(Doc.is(value))
        {
            value = Doc.realNode(value);
            r.push((clone === true)? Doc.clone(value):value);
        }
        
        else if(Ele.are(value))
        r = (clone === true)? Ele.clones(value):value;
        
        else if(Ele.is(value))
        r.push((clone === true)? Ele.clone(value):value);
        
        return r;
    },
    
    
    // safeHtml
    // fait quelques modifications à une string html pour éviter des injections
    safeHtml: function(html)
    {
        Str.check(html);
        html = html.replace(/<\!DOCTYPE[^>]*>/i, '');
        html = html.replace(/<(html|head|body|script|noscript)([\s\>])/gi,'<div data-tag="$1"$2');
        html = html.replace(/<\/(html|head|body|script|noscript)\>/gi,'</div>');
        html = Str.trim(html);
        
        return html;
    },
    
    
    // parse
    // parse une string html, retourne un tableau avec les nodes
    // utilise l'élément template de document
    // retourne un tableau
    parse: function(html)
    {
        let r = [];
        html = this.safeHtml(html);
        const template = document.createElement('template');
        template.innerHTML = html;
        const fragment = template.content;
        r = Doc.children(fragment,null,true);
        
        return r;
    },

    
    // parseOne
    // comme parse mais retourne seulement la première node du tableau
    parseOne: function(html)
    {
        return Arr.valueFirst(this.parse(html));
    },
    
    
    // querySelector
    // comme parse one, mais cherche pour en enfant via query selector
    // retourne le html de cette node
    querySelector: function(value,html)
    {
        let r = undefined;
        Str.check(value);
        const nodes = this.parse(html);
        
        if(Arr.isNotEmpty(nodes))
        {
            const finds = Ele.mergedQsa(nodes,value);
            
            if(Arr.isNotEmpty(finds))
            {
                const find = Arr.valueFirst(finds);
                r = Ele.getHtml(find);
            }
        }
        
        return r;
    },
    
    
    // doc
    // prend une string html
    // retourne un objet avec les différents éléments d'un document décortiqués
    doc: function(html)
    {
        let r = {
            doc: this.parse(html),
            docEle: [],
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
        
        Arr.each(r.doc,function() {
            if(Ele.is(this))
            r.docEle.push(this);
        });
        
        r.html = Ele.find(r.docEle,"[data-tag='html']") || Arr.valueFirst(r.docEle);
        
        if(r.html != null)
        {
            Ele.removeAttr(r.html,'data-tag');
            r.htmlAttr = Ele.attr(r.html);
            
            r.head = Nod.scopedQuery(r.html,"[data-tag='head']");
            r.body = Nod.scopedQuery(r.html,"[data-tag='body']");
            
            if(r.head != null)
            {
                const title = Nod.scopedQuery(r.head,"title");
                
                Ele.removeAttr(r.head,'data-tag');
                r.headAttr = Ele.attr(r.head);
                r.title = (title != null)? Ele.getText(title):'?';
                r.titleHtml = r.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
                r.meta = Nod.scopedQueryAll(r.head,"meta");
            }
        }
        
        if(r.body != null)
        {
            Ele.removeAttr(r.body,'data-tag');
            r.bodyAttr = Ele.attr(r.body);
        }
        
        else
        {
            const html = Ele.getOuterHtml(r.doc);
            const newBody = "<div data-tag='body'>"+html+"</div>";
            r.body = this.parseOne(newBody);
        }

        return r;
    }
}