"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// dom
// script with functions for manipulating the dom
(function ($, document, window) {
	
    // tagName
	// retourne le nom de la tag en lowerCase
	$.fn.tagName = function() 
	{
		return $(this).prop("tagName").toLowerCase();
	};
    
    
    // outerHtml
	// retourne le outerHtml d'un élément jQuery
	// si pas de outerHtml, peut aussi retourner le html ou le texte
	$.fn.outerHtml = function(htmlOrText)
	{
		var r = $(this).prop('outerHTML');
		
		if(htmlOrText === true && r == null)
		r = $(this).html() || $(this).text();
		
		return r;
	}
    
    
    // parseHtmlDocument
	// parse une string html, retourne un objet jQuery
	// remplace les balises sensibles par des div (comme dans head et script)
	$.parseHtmlDocument = function(html)
	{
		var r = String(html);
		
		r = r.replace(/<\!DOCTYPE[^>]*>/i, '');
		r = r.replace(/<(html|head|body|title|meta|script|link)([\s\>])/gi,'<div data-tag="$1"$2');
		r = r.replace(/<\/(html|head|body|title|meta|script|link)\>/gi,'</div>');
		
		r = $.trim(r);
		r = $($.parseHTML(r));
		
		return r;
	}
	
	
	// parseDocument
	// parse une page html
	// retourne un objet avec les différents éléments décortiqués
	$.parseDocument = function(html)
	{
		var r = {
			doc: $.parseHtmlDocument(html),
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
	
    
    // clickRemove
	// sur click, fadeOut l'élément et ensuite efface le
	$.fn.clickRemove = function()
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
	$.fn.wrapConsecutiveSiblings = function(until,html)
	{
		if(until && $.isStringNotEmpty(html))
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
    $.fn.outsideClick = function(value,parent) 
    {
        if($.isStringNotEmpty(value))
        {
            parent = (parent instanceof jQuery && parent.length === 1)? parent:$("html");
            var $this = $(this);
            
            parent.on('click.outside', function(event) {
                $this.trigger(value);
            });
        }
        
        return this;
    }
    
}(jQuery, document, window));