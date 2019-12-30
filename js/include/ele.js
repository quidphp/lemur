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
    },
    
    
    // setAttr
    // change un attribut sur une ou plusieurs nodes
    // si undefined, efface l'attribut
    setAttr: function(nodes,key,value)
    {
        nodes = this.wrap(nodes,false);
        Str.check(key,true);
        
        if(Obj.is(value))
        value = Json.encode(value);
        
        this.each(nodes,function() {
            if(value === undefined)
            this.removeAttribute(key);
            else
            this.setAttribute(key,value);
        });
        
        return;
    },
    
    
    // removeAttr
    // enlève un attribut sur une ou plusieurs nodes
    removeAttr: function(nodes,key)
    {
        return this.setAttr(nodes,key,undefined);
    },
    
    
    // setsAttr
    // remplace tous les attributs d'une ou plusieurs nodes, il faut fournir un plain object
    // possible de retirer les attributs existants
    setsAttr: function(nodes,value)
    {
        Pojo.check(value);
        const $inst = this;
        
        this.each(nodes,function() {
            const $this = this;
            
            Pojo.each(value,function(v,k) {
                $inst.setAttr($this,k,v);
            });
        });
        
        return;
    },


    // emptyAttr
    // permet de retirer tous les attributs à une ou plusieurs nodes
    emptyAttr: function(nodes)
    {
        const $inst = this;
        this.each(nodes,function() {
            const $this = this;
            
            ArrLike.each(this.attributes,function(value) {
                if(value != null)
                $inst.removeAttr($this,value.name);
            });
        });
        
        return;
    },
    
    
    // addId
    // ajoute un id aux éléments contenus dans l'objet qui n'en ont pas
    addId: function(nodes,value)
    {
        Str.check(value);
        const $inst = this;
        
        this.each(nodes,function() {
            if(!$inst.match(this,"[id]"))
            {
                const newId = value+Integer.unique();
                $inst.setProp(this,'id',newId);
            }
        });
        
        return;
    },
    

    // setCss
    // permet de changer une valeur inline du css
    setCss: function(node,key,value)
    {
        this.check(node);
        Str.check(key);
        key = Str.toCamelCase('-',key);
        
        node.style[key] = value;
        
        return;
    },
    
    
    // setValue
    // permet de changer la valeur d'une node
    // si la valeur est un objet, encode en json
    setValue: function(node,value)
    {
        this.check(node);
        
        if(Obj.is(value))
        value = Json.encode(value);
        
        value = Str.cast(value);
        node.value = value;
        
        return;
    },
    
    
    // toggleClass
    // permet d'ajouter ou enlever une classe sur une ou plusieurs nodes
    toggleClass: function(nodes,value,bool)
    {
        nodes = this.wrap(nodes,false);
        Str.check(value,true);
        
        this.each(nodes,function() {
            this.classList.toggle(value,bool);
        });
        
        return;
    },
    
    
    // setDimension
    // permet de changer la largeur et hauteur de la node
    setDimension: function(node,width,height)
    {
        if(Scalar.isNotBool(width))
        {
            width = (Num.is(width))? width+"px":width;
            this.setCss(node,'width',width);
        }
        
        if(Scalar.isNotBool(height))
        {
            height = (Num.is(height))? height+"px":height;
            this.setCss(node,'height',height);
        }
        
        return;
    },
    
    
    // setScroll
    // permet de changer les valeurs du scroll
    setScroll: function(node,top,left)
    {
        this.check(node);
        
        if(Num.is(top))
        node.scrollTop = (top > 0)? top:0;
        
        if(Num.is(left))
        node.scrollLeft = (left > 0)? left:0;
        
        return;
    },
    

    // animate
    // permet de créer une animation sur une ou plusieurs nodes
    // retourne une promise qui sera appelé une fois après que toutes les nodes aient finis l'animation
    animate: function(nodes,param,speed) 
    {
        let r = null;
        nodes = this.wrap(nodes,true);
        this.animateStop(nodes);
        Pojo.check(param);
        Num.check(speed);
        
        return $(nodes).animate(param,speed).promise();
    },
    
    
    // animateStop
    // permet d'arrêter toutes les animations sur une ou plusiuers nodes
    animateStop: function(nodes) 
    {
        nodes = this.wrap(nodes,true);
        $(nodes).stop(true,true);
        
        return;
    }
}