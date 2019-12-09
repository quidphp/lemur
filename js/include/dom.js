/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// dom
// script with behaviours related to dom nodes
const Dom = Lemur.Dom = Factory(true,
{
    // isNode
    // retourne vrai si la valeur est une node
    isNode: function(value) 
    {
        return (value === document || value instanceof HTMLElement)? true:false;
    },
    
    
    // isNodes
    // retourne vrai si la valeur est une collection de node
    // accepte jquery, nodeList ou un tableau de nodes non vide
    isNodes: function(value)
    {
        let r = false;
        const $inst = this;
        
        if(value instanceof jQuery && value.length)
        r = true;
        
        else if(value instanceof NodeList && value.length)
        r = true;
        
        else if(Arr.isNotEmpty(value))
        {
            r = Arr.each(value,function(v) {
                return $inst.isNode(v);
            });
        }
        
        return r;
    },
    
    
    // isWindow
    // retourne vrai si la valeur est une node window
    isWindow: function(value) 
    {
        return value != null && value === value.window;
    },
    
    
    // isTag
    // retourne vrai si  la tag est celle donnée en argument
    isTag: function(value,node)
    {
        return (this.tag(node) === value);
    },
    
    
    // matchAll
    // retourne vrai si toutes les nodes retournent vrai à is
    matchAll: function(value,node)
    {
        let r = false;
        
        $(node).each(function() {
            return r = $(this).is(value);
        });
        
        return r;
    },
    
    
    // tag
    // retourne le nom de la tag en lowerCase
    tag: function(node) 
    {
        let r = null;
        const tag = $(node).prop("tagName");
        
        if(Str.is(tag))
        r = tag.toLowerCase();
        
        return r;
    },

    
    // getData
    // permet de retourner une data d'une node
    getData: function(node,key)
    {
        const firstNode = $(node).get(0);
        return $(firstNode).data(key);
    },
    
    
    // getOrSetData
    // crée une data dans une node si la valeur est présenement inexistante
    // sinon retourne la data de la node
    getOrSetData: function(node,key,value)
    {
        let r = value;
        const firstNode = $(node).get(0);
        const current = $(firstNode).data(key);
        
        if(current == null)
        $(firstNode).data(key,value);
        
        else
        r = current;
        
        return r;
    },
    
    
    // outerHtml
    // retourne le outerHtml d'une ou plusieurs nodes
    // si pas de outerHtml, peut aussi retourner le html ou le texte
    outerHtml: function(node)
    {
        let r = '';
        
        $(node).each(function(index, el) {
            r += $(this).prop('outerHTML') || $(this).html() || $(this).text();
        });
        
        return r;
    },


    // heightWithPadding
    // retourne la hauteur avec le padding top et bottom
    heightWithPadding: function(node)
    {
        return $(node).height() + parseInt($(node).css("padding-top")) + parseInt($(node).css("padding-bottom"));
    },
    
    
    // attr
    // retourne un objet contenant tous les attributs d'une balise
    attr: function(node,start)
    {
        let r = null;
        node = $(node).get(0);
        
        if(node != null)
        {   
            r = {};
            
            $.each(node.attributes,function() {
                if(start == null || Str.isStart(start,this.name))
                r[this.name] = this.value;
            });
        }
        
        return r;
    },

    
    // attrStr
    // retourne les attributs d'une node sous forme de string
    attrStr: function(node,start)
    {
        let r = null;
        const attr = this.attr(node,start);
        
        if(attr != null)
        r = Obj.str(attr,'=',true);
        
        return r;
    },
    
    
    // getAttr
    // retourne un attribut
    getAttr: function(key,node)
    {
        return Pojo.get(key,this.attr(node));
    },
    
    
    // dataAttr
    // retourne un objet contenant tous les data-attributs d'une balise
    dataAttr: function(node)
    {
        return this.attr(node,'data-');
    },
    
    
    // getDataAttr
    // retourne un attribut data
    getDataAttr: function(key,node)
    {
        return (Str.isNotEmpty(key))? Pojo.get('data-'+key,this.attr(node)):null;
    },
    
    
    // value
    // retourne la valeur pour une node, surtout pour les formulaires
    // la valeur retourné peut être trim
    value: function(node,trim)
    {
        let r = undefined;

        r = $(node).val();
        
        if(r != null)
        {
            r = Str.cast(r);
            
            if(trim === true)
            r = Str.trim(r);
        }
        
        return r;
    },
    
    
    // valueSeparator
    // prend un ensemble de input et crée un set avec les valeurs
    // un séparateur peut être fourni, sinon utilise -
    valueSeparator: function(node,separator,trim) 
    {
        let r = '';
        separator = (Str.isNotEmpty(separator))? separator:'-';
        
        if(Str.isNotEmpty(separator))
        {
            $(node).each(function(index) {
                r += (r.length)? separator:"";
                r += this.value(this,trim);
            });
        }
        
        return r;
    },
    
    
    // dataHrefReplaceChar
    // permet de changer le caractère de remplacement sur une balise avec attribut data-href
    dataHrefReplaceChar: function(node,replace,replace2) 
    {
        let r = null;
        node = $(node).get(0);
        
        if(Num.is(replace))
        replace = Str.cast(replace);
        
        if(Num.is(replace2))
        replace2 = Str.cast(replace2);
        
        if(node != null && Str.isNotEmpty(replace))
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
});