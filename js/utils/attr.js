"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// attr
// script with some functions related to dom attributes manipulation
(function ($, document, window) {
	
    // getAttributes
    // retourne un objet contenant tous les attributs d'une balise
    $.fn.getAttributes = function(start)
    {
        var r = {};
        
        if($(this).length === 1)
        {   
            $.each(this[0].attributes, function() {
                if(start == null || $.isStringStart(start,this.name))
                r[this.name] = this.value;
            });
        }
        
        return r;
    }
    
    
    // getDataAttributes
    // retourne un objet contenant tous les data-attributs d'une balise
    $.fn.getDataAttributes = function()
    {
        return $(this).getAttributes('data-');
    }
    
    
    // replaceAttributes
    // remplace tous les attributs d'une balise, il faut fournir un plain object
    // possible de retirer les attributs existants
    $.fn.replaceAttributes = function(value,remove)
    {
        if(remove === true)
        $(this).removeAttributes();
        
        if($.isPlainObject(value))
        {
            var $this = $(this);
            
            $(this).each(function(index, el) {
                $.each(value, function(k,v) {
                    $this.attr(k,v);
                });
            });
        }
        
        return this;
    }
    
    
    // removeAttributes
    // permet de retirer tous les attributs à une tag
    $.fn.removeAttributes = function()
    {
        $(this).each(function(index, el) {
            var $this = $(this);
            
            $.each(this.attributes, function(index,value) {
                $(this).removeAttr(value.name);
            });
        });
        
        return this;
    }
    
    
    // uniqueInt
	// retourne un int jamais utilisé, utile pour générer des ids unique
	$.uniqueInt = (function(value)
	{
		var i = 0;
		return function() {
			return i++;
		};
	})();
    
    
    // addIds
	// ajoute un id aux éléments contenus dans l'objet qui n'en ont pas
	$.fn.addIds = function(base)
	{
		$(this).not("[id]").each(function(index, el) {
			var newId = base+$.uniqueInt();
			var labels = $(this).labels();
			$(this).prop('id',newId);
			labels.prop('for',newId);
		});
		
		return this;
	}
	
	
	// refreshIds
	// rafraîchis tous les ids contenus dans l'objet
	$.fn.refreshIds = function()
	{
		$(this).find("[id]").each(function(index, el) {
			var id = $(this).prop('id');
			var labels = $(this).labels();
			var newId = id+$.uniqueInt();
			$(this).prop('id',newId);
			labels.prop('for',newId);
		});
		
		return this;
	}
    
    
    // removeClassStart
	// enlève les classes des éléments qui commencent par
	$.fn.removeClassStart = function(prefix)
	{
		if($.isStringNotEmpty(prefix))
		{
			$(this).removeClass(function(index,classNames) {
				var array = [];
				$(classNames.split(" ")).each(function(index, value) {
					if($.isStringStart(prefix,value))
					array.push(value);
				});
				return array.join(" ");
			});
		}
		
		return this;
	}
    
    
    // hoverClass
	// permet d'ajouter et retirer une classe au mouseover/mouseout
	$.fn.hoverClass = function(className)
	{
		if($.isStringNotEmpty(className))
		{
			$(this).on('mouseenter', function(event) {
				$(this).addClass(className);
			})
			.on('mouseleave', function(event) {
				$(this).removeClass(className);
			});
		}
		
		return this;
	}
	
	
	// aExternalBlank
	// ajout target _blank à tous les liens externes qui n'ont pas la target
	$.fn.aExternalBlank = function()
	{
		$(this).find("a:external[target!='_blank']").each(function(index, el) {
			$(this).prop('target','_blank');
		});
		
		return this;
	}
	
	
	// addClassToLink
	// permet d'ajouter une classe à toutes les uris données en premier argument
	// uris doit être un tableau
	$.fn.addClassToLink = function(uris,classname)
	{
		if($.isArray(uris) && $.isStringNotEmpty(classname))
		{
			var $this = $(this);
			$(uris).each(function(index, uri) {
				$this.find("a[href='"+uri+"']").addClass(classname);
			});
		}
		
		return this;
	}
    
    
    // dataHrefReplaceChar
	// permet de changer le caractère de remplacement sur une balise avec attribut data-href
	$.fn.dataHrefReplaceChar = function(replace,replace2) 
	{
		var r = null;
		
		if($.isNumeric(replace))
		replace = String(replace);
		
		if($.isNumeric(replace2))
		replace2 = String(replace2);
		
		if($(this).length === 1 && $.isStringNotEmpty(replace))
		{
			var href = $(this).data("href");
			var char = $(this).data("char");
			
			if($.isStringNotEmpty(href) && $.isStringNotEmpty(char))
			{
				r = href.replace(char,replace);
				
				if($.isStringNotEmpty(replace2))
				r = r.replace(char,replace2);
			}
		}
		
		return r;
	}
	
	
	// hrefChangeHash
	// change le hash sur des balises avec attribut href
	$.fn.hrefChangeHash = function(fragment)
	{
		if($.isString(fragment))
		{
			$(this).each(function() {
				$(this)[0].hash = fragment;
			});
		}
		
		return this;
	}
    
}(jQuery, document, window));