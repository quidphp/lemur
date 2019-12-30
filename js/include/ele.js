/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// eleTarget
// script with basic functions related to element nodes
const EleTarget = {

    // is
    // retourne vrai si la valeur est une node
    is: function(value) 
    {
        return value instanceof HTMLElement;
    },
    

    // isEmpty
    // retourne vrai si la valeur est une node et qu'elle est vide
    isEmpty: function(value)
    {
        return (this.is(value))? Str.isEmpty(this.getHtml(value)):false;
    },


    // isNotEmpty
    // retourne vrai si la valeur est une node et qu'elle n'est pas vide
    isNotEmpty: function(value)
    {
        return (this.is(value))? Str.isNotEmpty(this.getHtml(value)):false;
    },
    
    
    // isVisible
    // retourne vrai si la node est visible
    isVisible: function(value)
    {
        return (this.is(value))? !!(value.offsetWidth || value.offsetHeight || value.getClientRects().length):false;
    },
    
    
    // isHidden
    // retourne vrai si la node est invisible
    isHidden: function(value)
    {
        return (this.is(value))? !(this.isVisible(value)):false;
    },


    // isTag
    // retourne vrai si  la tag est celle donnée en argument
    isTag: function(node,value)
    {
        return (this.tag(node) === value);
    },
    
    
    // hasAttr
    // retourne vrai si la node a l'attribut
    hasAttr: function(node,value)
    {
        this.check(node);
        Str.check(value);
        
        return node.hasAttribute(value);
    },
    
    
    // hasClass
    // retourne vrai si la node a la classe
    hasClass: function(node,value)
    {
        this.check(node);
        Str.check(value);
        
        return node.classList.contains(value);
    },
    
    
    // tag
    // retourne le nom de la tag en lowerCase
    tag: function(node) 
    {
        let r = null;
        const tag = this.getProp(node,'tagName');
        
        if(Str.is(tag))
        r = tag.toLowerCase();
        
        return r;
    },

    
    // getProp
    // retourne une propriété d'une node
    getProp: function(node,key)
    {
        this.check(node);
        return Obj.get(key,node);
    },
    

    // outerHtml
    // retourne le outerHtml d'une ou plusieurs nodes
    // si pas de outerHtml, peut aussi retourner le html ou le texte
    outerHtml: function(nodes)
    {
        let r = '';
        const $inst = this;
        
        this.each(nodes,function() {
            r += $inst.getProp(this,'outerHTML') || $inst.getHtml(this);
        });

        return r;
    },

    
    // css
    // retourne un objet contenant toutes les règles css
    css: function(node,start,pseudo)
    {
        const r = {};
        this.check(node);
        const style = window.getComputedStyle(node,pseudo);

        for (var i = 0; i < style.length; i++) {
            let value = style.item(i);
            
            if(start == null || Str.isStart(start,value))
            r[value] = style.getPropertyValue(value);
        }
        
        return r;
    },
    
    
    // getCss
    // permet de retourner une valeur css
    getCss: function(node,key,cast,pseudo)
    {
        let r = undefined;
        this.check(node);
        Str.check(key);
        const style = window.getComputedStyle(node,pseudo);
        
        r = style.getPropertyValue(key);
        r = Scalar.cast(r,cast);
        
        return r;
    },
    
    
    // attr
    // retourne un objet contenant tous les attributs d'une balise
    attr: function(node,start)
    {
        const r = {};
        this.check(node);
        const attr = node.attributes;
        
        ArrLike.each(attr,function() {
            if(start == null || Str.isStart(start,this.name))
            r[this.name] = this.value;
        });
        
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
    // possible de retourner la valeur json décodé, ou forcer un int/bool
    getAttr: function(node,key,cast)
    {
        let r = undefined;
        
        if(this.hasAttr(node,key))
        {
            r = node.getAttribute(key);
            r = Scalar.cast(r,cast);
        }
        
        return r;
    },
    
    
    // dataAttr
    // retourne un objet contenant tous les data-attributs d'une balise
    dataAttr: function(node)
    {
        return this.attr(node,'data-');
    },
    
    
    // getHtml
    // retourne le html dans une node
    getHtml: function(node)
    {
        this.check(node);
        return node.innerHTML;
    },
    
    
    // getText
    // retourne le text contenu dans une node et ses enfants
    // ne retourne aucune balise html
    getText: function(node)
    {
        this.check(node);
        return node.textContent;
    },
    
    
    // getValue
    // retourne la valeur pour une node, surtout pour les formulaires
    // la valeur retourné peut être trim
    getValue: function(node,trim)
    {
        let r = undefined;
        this.check(node);
        
        r = node.value;
        r = Str.cast(r);
        
        if(trim === true)
        r = Str.trim(r);
        
        return r;
    },
    
    
    // getDimension
    // retourne la dimension de la node
    getDimension: function(node)
    {
        const rect = this.getBoundingRect(node);
        
        return {
            width: rect.width,
            height: rect.height
        }
    },
    
    
    // getBoundingRect
    // retourne l'objet bounding rect pour la node
    getBoundingRect: function(node)
    {
        this.check(node);
        return node.getBoundingClientRect();
    },
    
    
    // getScroll
    // retourne un object avec les données pour le scroll
    getScroll: function(node)
    {
        this.check(node);
        return {
            top: node.scrollTop,
            left: node.scrollLeft
        };
    },
    
    
    // getOffset
    // retourne un objet avec les données pour le offset de la node
    getOffset: function(node)
    {
        const rect = this.getBoundingRect(node);
        const scroll = Win.getScroll();
        return {
            top: rect.top + scroll.top,
            left: rect.left + scroll.left
        };
    },
    
    
    // focus
    // permet de mettre le focus sur une node
    focus: function(node)
    {
        this.check(node);
        node.focus();
        
        return;
    }
}