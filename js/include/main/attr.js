"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// attr
// script with some functions related to dom attributes manipulation

// getAttributes
// retourne un objet contenant tous les attributs d'une balise
quid.main.getAttributes = $.fn.getAttributes = function(start)
{
    var r = {};
    
    if($(this).length === 1)
    {   
        $.each(this[0].attributes, function() {
            if(start == null || quid.base.isStringStart(start,this.name))
            r[this.name] = this.value;
        });
    }
    
    return r;
}


// getDataAttributes
// retourne un objet contenant tous les data-attributs d'une balise
quid.main.getDataAttributes = $.fn.getDataAttributes = function()
{
    return $(this).getAttributes('data-');
}


// replaceAttributes
// remplace tous les attributs d'une balise, il faut fournir un plain object
// possible de retirer les attributs existants
quid.main.replaceAttributes = $.fn.replaceAttributes = function(value,remove)
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
quid.main.removeAttributes = $.fn.removeAttributes = function()
{
    $(this).each(function(index, el) {
        var $this = $(this);
        var node = $(this)[0];
        
        $.each(node.attributes, function(index,value) {
            if(value != null)
            $this.removeAttr(value.name);
        });
    });
    
    return this;
}


// addIds
// ajoute un id aux éléments contenus dans l'objet qui n'en ont pas
quid.main.addIds = $.fn.addIds = function(base)
{
    $(this).not("[id]").each(function(index, el) {
        var newId = base+quid.base.uniqueInt();
        var labels = $(this).labels();
        $(this).prop('id',newId);
        labels.prop('for',newId);
    });
    
    return this;
}


// refreshIds
// rafraîchis tous les ids contenus dans l'objet
quid.main.refreshIds = $.fn.refreshIds = function()
{
    $(this).find("[id]").each(function(index, el) {
        var id = $(this).prop('id');
        var labels = $(this).labels();
        var newId = id+quid.base.uniqueInt();
        $(this).prop('id',newId);
        labels.prop('for',newId);
    });
    
    return this;
}


// removeClassStart
// enlève les classes des éléments qui commencent par
quid.main.removeClassStart = $.fn.removeClassStart = function(prefix)
{
    if(quid.base.isStringNotEmpty(prefix))
    {
        $(this).removeClass(function(index,classNames) {
            var array = [];
            $(classNames.split(" ")).each(function(index, value) {
                if(quid.base.isStringStart(prefix,value))
                array.push(value);
            });
            return array.join(" ");
        });
    }
    
    return this;
}


// hoverClass
// permet d'ajouter et retirer une classe au mouseover/mouseout
quid.main.hoverClass = $.fn.hoverClass = function(className)
{
    if(quid.base.isStringNotEmpty(className))
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
quid.main.aExternalBlank = $.fn.aExternalBlank = function()
{
    $(this).find("a:external[target!='_blank']").each(function(index, el) {
        $(this).prop('target','_blank');
    });
    
    return this;
}


// addClassToLink
// permet d'ajouter une classe à toutes les uris données en premier argument
// uris doit être un tableau
quid.main.addClassToLink = $.fn.addClassToLink = function(uris,classname)
{
    if($.isArray(uris) && quid.base.isStringNotEmpty(classname))
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
quid.main.dataHrefReplaceChar = $.fn.dataHrefReplaceChar = function(replace,replace2) 
{
    var r = null;
    
    if($.isNumeric(replace))
    replace = String(replace);
    
    if($.isNumeric(replace2))
    replace2 = String(replace2);
    
    if($(this).length === 1 && quid.base.isStringNotEmpty(replace))
    {
        var href = $(this).data("href");
        var char = $(this).data("char");
        
        if(quid.base.isStringNotEmpty(href) && quid.base.isStringNotEmpty(char))
        {
            r = href.replace(char,replace);
            
            if(quid.base.isStringNotEmpty(replace2))
            r = r.replace(char,replace2);
        }
    }
    
    return r;
}


// hrefChangeHash
// change le hash sur des balises avec attribut href
quid.main.hrefChangeHash = $.fn.hrefChangeHash = function(fragment)
{
    if(quid.base.isString(fragment))
    {
        $(this).each(function() {
            $(this)[0].hash = fragment;
        });
    }
    
    return this;
}