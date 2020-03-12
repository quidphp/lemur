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
        return (this.is(value))? !!(value.offsetWidth || value.offsetHeight):false;
    },
    
    
    // isHidden
    // retourne vrai si la node est invisible
    isHidden: function(value)
    {
        return (this.is(value))? !(this.isVisible(value)):false;
    },


    // isTag
    // retourne vrai si la tag est celle donnée en argument
    isTag: function(node,value)
    {
        return (this.is(node) && this.tag(node) === value);
    },
    
    
    // isFocused
    // retourne vrai si la node a présentement le focus
    isFocused: function(node)
    {
        return node === document.activeElement;
    },
    
    
    // isFocusable
    // retourne vrai si la node peut recevoir le focus
    isFocusable: function(node)
    {
        let r = false;
        
        if(this.is(node))
        {
            const tag = this.tag(node);
            const tags = ['input','textarea','select','a','button'];
            const dimension = this.getDimension(node);
            
            if(this.match(node,'[tabindex]') || Arr.in(tag,tags))
            {
                if(dimension.width > 0 && dimension.height > 0)
                r = true;
            }
        }
        
        return r;
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
        
        // fix pour ie11 qui retourne mauvais computed style pour width/height (box-model)
        if(Arr.in(key,['width','height']))
        {
            const dimension = this.getDimension(node);
            r = Integer.round(dimension[key])+"px";
        }
        
        else
        {
            const style = window.getComputedStyle(node,pseudo);
            r = style.getPropertyValue(key);
        }
        
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
        r = Obj.str(attr,'=',' ',true);
        
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
    getValue: function(node,trim,cast)
    {
        let r = undefined;
        this.check(node);
        
        r = node.value;
        r = Str.cast(r);
        
        if(trim === true)
        r = Str.trim(r);
        
        if(cast != null)
        r = Scalar.cast(r,cast);
        
        return r;
    },
    
    
    // getDimension
    // retourne la dimension de la node
    // il est possible de retourner la dimension si on change de façon temporaire le display
    getDimension: function(node,display)
    {
        this.check(node);
        display = (display === true)? 'block':display;
        const displayToggle = Str.isNotEmpty(display);
        let currentDisplay, currentWidth, currentHeight;
        
        if(displayToggle)
        {
            currentDisplay = node.style.display;
            currentWidth = node.style.width;
            currentHeight = node.style.height;
            node.style.display = display;
            node.style.width = 'auto';
            node.style.height = 'auto';
        }
        
        const rect = this.getBoundingRect(node);
        
        if(displayToggle)
        {
            node.style.display = currentDisplay;
            node.style.width = currentWidth;
            node.style.height = currentHeight;
        }
        
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
    // retourne aussi les dimensions
    getScroll: function(node)
    {
        let r = null;
        this.check(node);
        const tag = this.tag(node);
        
        // scrollTop n'est pas sur la tag HTML dans IE
        if(Arr.in(tag,['html','body']))
        r = Win.getScroll();
        
        else
        {
            r = {
                top: node.scrollTop,
                left: node.scrollLeft,
                width: node.scrollWidth,
                height: node.scrollHeight
            };
        }
        
        return r;
    },
    
    
    // getOffset
    // retourne tous les offsets de la node (par rapport au parent, au document et à la window)
    getOffset: function(node) 
    {
        return {
            parent: this.getOffsetParent(node),
            doc: this.getOffsetDoc(node),
            win: this.getOffsetWin(node)
        }
    },
    
    
    // getOffsetParent
    // retourne un objet avec les données pour le offset de la node (par rapport à son parent scrollable)
    getOffsetParent: function(node)
    {
        this.check(node);
        
        return {
            top: node.offsetTop,
            left: node.offsetLeft
        };
    },
    
    
    // getOffsetDoc
    // retourne un objet avec les données pour le offset de la node (par rapport au document)
    getOffsetDoc: function(node)
    {
        const rect = this.getBoundingRect(node);
        const scroll = Win.getScroll();
        
        return {
            top: rect.top + scroll.top,
            left: rect.left + scroll.left
        };
    },
    
    
    // getOffsetWin
    // retourne un objet avec les données pour le offset de la node (par rapport à la window)
    getOffsetWin: function(node)
    {
        const rect = this.getBoundingRect(node);
        
        return {
            top: rect.top,
            left: rect.left
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
        
        if(value == null)
        value = '';
        
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
        if(Scalar.is(width))
        {
            width = (width === true)? this.getDimension(node,width).width:width;
            width = (width === false)? undefined:width;
            width = (Num.is(width))? width+"px":width;
            this.setCss(node,'width',width);
        }
        
        if(Scalar.is(height))
        {
            height = (height === true)? this.getDimension(node,height).height:height;
            height = (height === false)? undefined:height;
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
    

    // getUri
    // retourne l'uri à partir d'une node
    getUri: function(node)
    {
        let r = undefined;
        const tag = this.tag(node);
        
        if(tag === 'form')
        r = this.getAttr(node,"action");
        
        else
        r = this.getAttr(node,"href") || this.getAttr(node,'data-href');
        
        return r;
    },
    

    // serialize
    // permet de serializer une ou plusieurs nodes
    // il faut spécifier la prop pour clé et celle pour value
    serialize: function(nodes,keyProp,valueProp)
    {
        let r = '';
        nodes = Nod.wrap(nodes,true);
        const query = Uri.query();
        keyProp = (Str.is(keyProp))? keyProp:'name';
        valueProp = (Str.is(valueProp))? valueProp:'value';
        const $inst = this;
        
        this.each(nodes,function() {
            const key = $inst.getProp(this,keyProp);
            const value = $inst.getProp(this,valueProp);
            query.append(key,value);
        });
        
        r = query.toString();

        return r;
    },
}