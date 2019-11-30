/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// node
// script with behaviours related to html nodes
Quid.Node = new function() 
{
    // instance
    var $inst = this;
    
    
    // isLike
    // retourne vrai si la valeur est une node, node list ou un objet jQuery
    // accepte aussi un tableau contenant seulement des nodes
    this.isLike = function(value) 
    {
        var r = false;
        
        if(value != null)
        {
            if(value === document || value instanceof HTMLElement || value instanceof NodeList)
            r = true;
            
            else if(value instanceof jQuery && value.length)
            r = true;
            
            else if(Array.isArray(value) && value.length)
            {
                for (var i = 0; i < value.length; i++) 
                {
                    r = $inst.isLike(value[i]);
                    
                    if(r === false)
                    break;
                }
            }
        }
        
        return r;
    }
    
    
    // isWindow
    // retourne vrai si la valeur est une node window
    this.isWindow = function(value) 
    {
        return value != null && value === value.window;
    }
    
    
    // isTag
    // retourne vrai si  la tag est celle donnée en argument
    this.isTag = function(value,node)
    {
        return ($inst.tag(node) === value);
    }
    
    
    // isAll
    // retourne vrai si toutes les nodes retournent vrai à is
    this.isAll = function(value,node)
    {
        var r = false;
        
        $(node).each(function() {
            return r = $(this).is(value);
        });
        
        return r;
    }
    
    
    // tag
    // retourne le nom de la tag en lowerCase
    this.tag = function(node) 
    {
        var r = null;
        var tag = $(node).prop("tagName");
        
        if(Quid.Str.is(tag))
        r = tag.toLowerCase();
        
        return r;
    };


    // outerHtml
    // retourne le outerHtml d'une ou plusieurs nodes
    // si pas de outerHtml, peut aussi retourner le html ou le texte
    this.outerHtml = function(node)
    {
        var r = '';
        
        $(node).each(function(index, el) {
            r += $(this).prop('outerHTML') || $(this).html() || $(this).text();
        });
        
        return r;
    }


    // heightWithPadding
    // retourne la hauteur avec le padding top et bottom
    this.heightWithPadding = function(node)
    {
        return $(node).height() + parseInt($(node).css("padding-top")) + parseInt($(node).css("padding-bottom"));
    }
    
    
    // attr
    // retourne un objet contenant tous les attributs d'une balise
    this.attr = function(node,start)
    {
        var r = null;
        node = $(node).first();
        
        if(node.length === 1)
        {   
            r = {};
            
            $.each(node[0].attributes, function() {
                if(start == null || Quid.Str.isStart(start,this.name))
                r[this.name] = this.value;
            });
        }
        
        return r;
    }


    // getAttrStr
    // retourne les attributs d'une node sous forme de string
    this.getAttrStr = function(node,start)
    {
        var r = null;
        var attr = $inst.attr(node,start);
        
        if(attr != null)
        r = Quid.Obj.str(attr,'=',true);
        
        return r;
    }
    
    
    // getDataAttr
    // retourne un objet contenant tous les data-attributs d'une balise
    this.getDataAttr = function(node)
    {
        return $inst.attr(node,'data-');
    }
    
    
    // value
    // retourne la valeur pour une node, surtout pour les formulaires
    // la valeur retourné peut être trim
    this.value = function(node,trim)
    {
        var r = null;

        r = $(node).val();
        
        if(r != null)
        {
            r = Quid.Str.cast(r);
            
            if(trim === true)
            r = Quid.Str.trim(r);
        }
        
        return r;
    }
    
    
    // valueSeparator
    // prend un ensemble de input et crée un set avec les valeurs
    // un séparateur peut être fourni, sinon utilise -
    this.valueSeparator = function(node,separator,trim) 
    {
        var r = '';
        separator = (Quid.Str.isNotEmpty(separator))? separator:'-';
        
        if(Quid.Str.isNotEmpty(separator))
        {
            $(node).each(function(index) {
                r += (r.length)? separator:"";
                r += $inst.value(this,trim);
            });
        }
        
        return r;
    }
    
    
    // dataHrefReplaceChar
    // permet de changer le caractère de remplacement sur une balise avec attribut data-href
    this.dataHrefReplaceChar = function(node,replace,replace2) 
    {
        var r = null;
        node = $(node).first();
        
        if(Quid.Number.is(replace))
        replace = Quid.Str.cast(replace);
        
        if(Quid.Number.is(replace2))
        replace2 = Quid.Str.cast(replace2);
        
        if($(node).length === 1 && Quid.Str.isNotEmpty(replace))
        {
            var href = $(node).data("href");
            var char = $(node).data("char");
            
            if(Quid.Str.isNotEmpty(href) && Quid.Str.isNotEmpty(char))
            {
                r = href.replace(char,replace);
                
                if(Quid.Str.isNotEmpty(replace2))
                r = r.replace(char,replace2);
            }
        }
        
        return r;
    }

}