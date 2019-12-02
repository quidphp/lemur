/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// dom
// script with behaviours related to dom nodes
const Dom = new function() 
{
    // instance
    const $inst = this;
    
    
    // isNode
    // retourne vrai si la valeur est une node, node list ou un objet jQuery
    // accepte aussi un tableau contenant seulement des nodes
    this.isNode = function(value) 
    {
        let r = false;
        
        if(value != null)
        {
            if(value === document || value instanceof HTMLElement || value instanceof NodeList)
            r = true;
            
            else if(value instanceof jQuery && value.length)
            r = true;
            
            else if(Array.isArray(value) && value.length)
            {
                var i;
                
                for (i = 0; i < value.length; i++) 
                {
                    r = $inst.isNode(value[i]);
                    
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
    
    
    // matchAll
    // retourne vrai si toutes les nodes retournent vrai à is
    this.matchAll = function(value,node)
    {
        let r = false;
        
        $(node).each(function() {
            return r = $(this).is(value);
        });
        
        return r;
    }
    
    
    // tag
    // retourne le nom de la tag en lowerCase
    this.tag = function(node) 
    {
        let r = null;
        const tag = $(node).prop("tagName");
        
        if(Str.is(tag))
        r = tag.toLowerCase();
        
        return r;
    };


    // outerHtml
    // retourne le outerHtml d'une ou plusieurs nodes
    // si pas de outerHtml, peut aussi retourner le html ou le texte
    this.outerHtml = function(node)
    {
        let r = '';
        
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
        let r = null;
        node = $(node).first();
        
        if(node.length === 1)
        {   
            r = {};
            
            $.each(node[0].attributes,function() {
                if(start == null || Str.isStart(start,this.name))
                r[this.name] = this.value;
            });
        }
        
        return r;
    }


    // getAttrStr
    // retourne les attributs d'une node sous forme de string
    this.getAttrStr = function(node,start)
    {
        let r = null;
        const attr = $inst.attr(node,start);
        
        if(attr != null)
        r = Obj.str(attr,'=',true);
        
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
        let r = null;

        r = $(node).val();
        
        if(r != null)
        {
            r = Str.cast(r);
            
            if(trim === true)
            r = Str.trim(r);
        }
        
        return r;
    }
    
    
    // valueSeparator
    // prend un ensemble de input et crée un set avec les valeurs
    // un séparateur peut être fourni, sinon utilise -
    this.valueSeparator = function(node,separator,trim) 
    {
        let r = '';
        separator = (Str.isNotEmpty(separator))? separator:'-';
        
        if(Str.isNotEmpty(separator))
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
        let r = null;
        node = $(node).first();
        
        if(Num.is(replace))
        replace = Str.cast(replace);
        
        if(Num.is(replace2))
        replace2 = Str.cast(replace2);
        
        if($(node).length === 1 && Str.isNotEmpty(replace))
        {
            const href = $(node).data("href");
            const char = $(node).data("char");
            
            if(Str.isNotEmpty(href) && Str.isNotEmpty(char))
            {
                r = href.replace(char,replace);
                
                if(Str.isNotEmpty(replace2))
                r = r.replace(char,replace2);
            }
        }
        
        return r;
    }
}

// export
Lemur.Dom = Dom;