/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// html
// script with functions for parsing html
quid.html = new function() 
{
    // instance
    var $inst = this;
    
    
    // parse
    // parse une string html, retourne un objet avec les nodes
    // remplace les balises sensibles par des div (comme dans head et script)
    this.parse = function(html)
    {
        var r = null;
        html = quid.str.cast(html);
        html = html.replace(/<\!DOCTYPE[^>]*>/i, '');
        html = html.replace(/<(html|head|body|script)([\s\>])/gi,'<div data-tag="$1"$2');
        html = html.replace(/<\/(html|head|body|script)\>/gi,'</div>');
        
        html = quid.str.trim(html);
        var nodes = $.parseHTML(html);
        
        r = $(nodes);

        return r;
    }


    // doc
    // prend une string html
    // retourne un objet avec les différents éléments d'un document décortiqués
    this.doc = function(html)
    {
        var r = {
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
        var doc = $inst.parse(html);
        
        r.html = doc;
        r.html.removeAttr('data-tag');
        r.htmlAttr = quid.node.getAttr(r.html);
        
        r.head = doc.find("[data-tag='head']").first();
        r.body = doc.find("[data-tag='body']").first();
        
        if(r.head.length)
        {
            r.head.removeAttr('data-tag');
            r.headAttr = quid.node.getAttr(r.head);
            r.title = r.head.find("title").first().text() || '?';
            r.titleHtml = r.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
            r.meta = r.head.find("meta");
        }
        
        if(r.body.length)
        {
            r.body.removeAttr('data-tag');
            r.bodyAttr = quid.node.getAttr(r.body);
        }
        
        else
        {
            var html = quid.node.outerHtml(doc);
            var newBody = "<div data-tag='body'>"+html+"</div>";
            newBody = $.parseHTML(newBody);
            r.body = $(newBody);
        }
        
        return r;
    }
}