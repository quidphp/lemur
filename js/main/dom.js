"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// dom
// script with functions for manipulating the dom
quid.main.dom = new function() {
    
    // parseHtml
    // parse une string html, retourne un objet jQuery
    // remplace les balises sensibles par des div (comme dans head et script)
    this.parseHtml = function(html)
    {
        var r = String(html);
        
        r = r.replace(/<\!DOCTYPE[^>]*>/i, '');
        r = r.replace(/<(html|head|body|title|meta|script|link)([\s\>])/gi,'<div data-tag="$1"$2');
        r = r.replace(/<\/(html|head|body|title|meta|script|link)\>/gi,'</div>');
        
        r = $.trim(r);
        r = $($.parseHTML(r));
        
        return r;
    }


    // parse
    // parse une page html
    // retourne un objet avec les différents éléments décortiqués
    this.parse = function(html)
    {
        var r = {
            doc: this.parseHtml(html),
            html: null,
            head: null,
            title: '?',
            meta: null,
            body: null
        };
        
        r.head = r.doc.find("[data-tag='head']").first();
        r.body = r.doc.find("[data-tag='body']").first();
        r.html = r.doc.removeAttr('data-tag');
        
        if(r.head.length)
        {
            r.title = r.head.find("[data-tag='title']").first().text() || null;
            r.meta = r.head.find("[data-tag='meta']");
        }
        
        if(!r.body.length)
        {
            var newBody = "<div data-tag='body'>"+r.doc.outerHtml(true)+"</div>";
            r.body = $($.parseHTML(newBody));
        }
        
        return r;
    }


    // tagName
    // retourne le nom de la tag en lowerCase
    this.tagName = $.fn.tagName = function() 
    {
        var r = null;
        var tag = $(this).prop("tagName");
        
        if(quid.base.str.is(tag))
        r = tag.toLowerCase();
        
        return r;
    };


    // outerHtml
    // retourne le outerHtml d'un ou plusieurs éléments jQuery
    // si pas de outerHtml, peut aussi retourner le html ou le texte
    this.outerHtml = $.fn.outerHtml = function(htmlOrText)
    {
        var r = '';
        $(this).each(function(index, el) {
            r += $(this).prop('outerHTML') || $(this).html() || $(this).text();
        });
        
        return r;
    }


    // clickRemove
    // sur click, fadeOut l'élément et ensuite efface le
    this.clickRemove = $.fn.clickRemove = function()
    {
        $(this).on('click', function(event) {
            $(this).fadeOut('slow',function() {
                $(this).remove();
            });
        });
        
        return this;
    }


    // wrapConsecutiveSiblings
    // permet d'enrobber toutes les prochaines balises répondant à until dans une balise html
    this.wrapConsecutiveSiblings = $.fn.wrapConsecutiveSiblings = function(until,html)
    {
        if(until && quid.base.str.isNotEmpty(html))
        {
            $(this).each(function(index, el) {
                var nextUntil = $(this).nextUntil(until);
                $(this).add(nextUntil).wrapAll(html);
            });
        }
        
        return this;
    }


    // outsideClick
    // gère les clicks hors de l'éléments
    // si parent n'est pas spécifié utilise document
    // utilise le namespace outside, ceci est unbind dans navigation
    this.outsideClick = $.fn.outsideClick = function(value,parent) 
    {
        if(quid.base.str.isNotEmpty(value))
        {
            parent = (parent instanceof jQuery && parent.length === 1)? parent:$(document);
            var $this = $(this);
            
            parent.on('click.document-mount', function(event) {
                $this.trigger(value);
            });
        }
        
        return this;
    }
}