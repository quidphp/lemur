"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// attr
// script with some functions related to dom attributes manipulation
quid.main.attr = new function() {
    
    // mailto
    // permet d'obtenir un email à partir d'un mailto (comme dans un href)
    this.mailto = function(value)
    {
        var r = null;
        
        if(base.str.isNotEmpty(value))
        r = value.replace(/mailto:/,'');
        
        return r;
    }
    
    
    // isAll
    // retourne vrai si toutes les entrées retournent vrai à is
    this.isAll = $.fn.isAll = function(value)
    {
        var r = false;
        
        $(this).each(function() {
            return r = $(this).is(value);
        });
        
        return r;
    }
    
    
    // get
    // retourne un objet contenant tous les attributs d'une balise
    this.get = $.fn.getAttributes = function(start)
    {
        var r = {};
        
        if($(this).length === 1)
        {   
            $.each(this[0].attributes, function() {
                if(start == null || quid.base.str.isStart(start,this.name))
                r[this.name] = this.value;
            });
        }
        
        return r;
    }


    // getData
    // retourne un objet contenant tous les data-attributs d'une balise
    this.getData = $.fn.getDataAttributes = function()
    {
        return $(this).getAttributes('data-');
    }


    // replace
    // remplace tous les attributs d'une balise, il faut fournir un plain object
    // possible de retirer les attributs existants
    this.replace = $.fn.replaceAttributes = function(value,remove)
    {
        if(remove === true)
        $(this).removeAttributes();
        
        if(quid.base.obj.isPlain(value))
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


    // remove
    // permet de retirer tous les attributs à une tag
    this.remove = $.fn.removeAttributes = function()
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
    this.addIds = $.fn.addIds = function(base)
    {
        $(this).not("[id]").each(function(index, el) {
            var newId = base+quid.base.number.unique();
            var labels = $(this).labels();
            $(this).prop('id',newId);
            labels.prop('for',newId);
        });
        
        return this;
    }


    // refreshIds
    // rafraîchis tous les ids contenus dans l'objet
    this.refreshIds = $.fn.refreshIds = function()
    {
        $(this).find("[id]").each(function(index, el) {
            var id = $(this).prop('id');
            var labels = $(this).labels();
            var newId = id+quid.base.number.unique();
            $(this).prop('id',newId);
            labels.prop('for',newId);
        });
        
        return this;
    }


    // removeClassStart
    // enlève les classes des éléments qui commencent par
    this.removeClassStart = $.fn.removeClassStart = function(prefix)
    {
        if(quid.base.str.isNotEmpty(prefix))
        {
            $(this).removeClass(function(index,classNames) {
                var array = [];
                $(classNames.split(" ")).each(function(index, value) {
                    if(quid.base.str.isStart(prefix,value))
                    array.push(value);
                });
                return array.join(" ");
            });
        }
        
        return this;
    }


    // hoverClass
    // permet d'ajouter et retirer une classe au mouseover/mouseout
    this.hoverClass = $.fn.hoverClass = function(className)
    {
        if(quid.base.str.isNotEmpty(className))
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
    this.aExternalBlank = $.fn.aExternalBlank = function()
    {
        $(this).find("a:external[target!='_blank']").each(function(index, el) {
            $(this).prop('target','_blank');
        });
        
        return this;
    }


    // addClassToLink
    // permet d'ajouter une classe à toutes les uris données en premier argument
    // uris doit être un tableau
    this.addClassToLink = $.fn.addClassToLink = function(uris,classname)
    {
        if(quid.base.arr.is(uris) && quid.base.str.isNotEmpty(classname))
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
    this.dataHrefReplaceChar = $.fn.dataHrefReplaceChar = function(replace,replace2) 
    {
        var r = null;
        
        if(quid.base.number.is(replace))
        replace = String(replace);
        
        if(quid.base.number.is(replace2))
        replace2 = String(replace2);
        
        if($(this).length === 1 && quid.base.str.isNotEmpty(replace))
        {
            var href = $(this).data("href");
            var char = $(this).data("char");
            
            if(quid.base.str.isNotEmpty(href) && quid.base.str.isNotEmpty(char))
            {
                r = href.replace(char,replace);
                
                if(quid.base.str.isNotEmpty(replace2))
                r = r.replace(char,replace2);
            }
        }
        
        return r;
    }


    // hrefChangeHash
    // change le hash sur des balises avec attribut href
    this.hrefChangeHash = $.fn.hrefChangeHash = function(fragment)
    {
        if(quid.base.str.is(fragment))
        {
            $(this).each(function() {
                $(this)[0].hash = fragment;
            });
        }
        
        return this;
    }
}