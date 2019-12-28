/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// dom
// script with behaviours related to dom nodes
const Dom = Lemur.Dom = {
    
    // isNode
    // retourne vrai si la valeur est une node
    isNode: function(value,docWindow) 
    {
        let r = value instanceof HTMLElement;
        
        if(r === false && docWindow === true && (this.isWindow(value) || this.isDocument(value)))
        r = true;
        
        return r;
    },
    
    
    // isNodeEmpty
    // retourne vrai si la valeur est une node et qu'elle est vide
    isNodeEmpty: function(value)
    {
        return (this.isNode(value))? Str.isEmpty(this.getHtml(value)):false;
    },


    // isNodeNotEmpty
    // retourne vrai si la valeur est une node et qu'elle n'est pas vide
    isNodeNotEmpty: function(value)
    {
        return (this.isNode(value))? Str.isNotEmpty(this.getHtml(value)):false;
    },
    
    
    // isNodeVisible
    // retourne vrai si la node est visible
    isNodeVisible: function(value)
    {
        return (this.isNode(value))? !!(value.offsetWidth || value.offsetHeight || value.getClientRects().length):false;
    },
    
    
    // isNodeHidden
    // retourne vrai si la node est invisible
    isNodeHidden: function(value)
    {
        return (this.isNode(value))? !(this.isNodeVisible(value)):false;
    },
    
    
    // isNodes
    // retourne vrai si la valeur est une collection de node non vide
    // accepte nodeList ou un tableau de nodes non vide
    isNodes: function(value,docWindow)
    {
        let r = false;
        const $inst = this;
        
        if(value instanceof NodeList && value.length)
        r = true;
        
        else if(Arr.isNotEmpty(value))
        {
            r = Arr.each(value,function(v) {
                return $inst.isNode(v,docWindow);
            });
        }
        
        return r;
    },
    
    
    // isDocument
    // retourne vrai si la valeur est document
    isDocument: function(value) 
    {
        return value === document;
    },
    
    
    // isWindow
    // retourne vrai si la valeur est window
    isWindow: function(value) 
    {
        return value === window;
    },
    
    
    // isTag
    // retourne vrai si  la tag est celle donnée en argument
    isTag: function(node,value)
    {
        return (this.tag(node) === value);
    },
    
    
    // hasData
    // retourne vrai si la node a les données
    hasData: function(node,value)
    {
        return this.getData(node,value) !== undefined;
    },
    
    
    // hasAttr
    // retourne vrai si la node a l'attribut
    hasAttr: function(node,value)
    {
        return this.getAttr(node,value) !== undefined;
    },
    
    
    // hasClass
    // retourne vrai si la node a la classe
    hasClass: function(node,value)
    {
        Dom.checkNode(node);
        Str.check(value);
        
        return node.classList.contains(value);
    },
    
    
    // checkNode
    // envoie une exception si la valeur n'est pas une node
    // n'envoie pas d'erreur si la valeur est window ou document
    checkNode: function(value,type,message)
    {
        let error = false;
        const isNode = this.isNode(value,true);
        
        if(!(isNode || (type === false && value == null)))
        error = true; 
        
        if(isNode === true && type && value !== type)
        error = true;
        
        if(error === true)
        throw new Error([value,type,message]);
        
        return value;
    },
    
    
    // checkNodes
    // envoie une exception si la valeur n'est pas un tableau de nodes
    // n'envoie pas d'erreur si la valeur est window ou document
    checkNodes: function(value,type,message)
    {
        if(!(this.isNodes(value,true) || (type === false && (value == null || Arr.isEmpty(value)))))
        throw new Error([value,type,message]);
        
        return value;
    },
    
    
    // nodeWrap
    // wrap une node dans un array, si ce n'est pas un array
    // transforme une node list en array
    // n'envoie pas d'erreur si la valeur est window ou document
    nodeWrap: function(value)
    {
        if(this.isNode(value,true))
        value = [value];
        
        else if(value instanceof NodeList)
        value = ArrLike.arr(value);
        
        return value;
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
        this.checkNode(node);
        return Obj.get(key,node);
    },
    
    
    // getData
    // permet de retourner une data d'une node
    // envoie une exception si plus d'une node
    getData: function(node,key)
    {
        this.checkNode(node);
        return $(node).data(key);
    },
    
    
    // flashData
    // retourne la data et efface l'entrée de la node
    flashData: function(node,key)
    {
        const r = this.getData(node,key);
        this.removeData(node,key);
        
        return r;
    },
    
    
    // setData
    // change de la data sur une ou plusieurs nodes
    // ceci n'affecte pas le dom, seulement stocké dans l'objet
    // si undefined efface la data
    setData: function(nodes,key,value)
    {
        Str.check(key,true);
        
        if(value === undefined)
        $(nodes).removeData(key);
        else
        $(nodes).data(key,value);
        
        return;
    },
    
    
    // removeData
    // enlève une donnée de la ou les nodes
    removeData: function(nodes,key)
    {
        return this.setData(nodes,key,undefined);
    },
    
    
    // getOrSetData
    // crée une data dans une node si la valeur est présenement inexistante
    // sinon retourne la data de la node
    getOrSetData: function(node,key,value)
    {
        let r = undefined;
        const current = this.getData(node,key);
        
        if(current == null && value != null)
        {
            $(node).data(key,value);
            r = value;
        }
        
        else
        r = current;
        
        return r;
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


    // attr
    // retourne un objet contenant tous les attributs d'une balise
    attr: function(node,start)
    {
        let r = null;
        node = $(node).get(0);
        
        if(node != null)
        {   
            r = {};
            
            ArrLike.each(node.attributes,function() {
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
    // possible de retourner la valeur json décodé, ou forcer un int/bool
    getAttr: function(node,key,cast)
    {
        let r = undefined;
        Str.check(key,true);
        this.checkNode(node);
        r = $(node).attr(key);
        
        if(r != null && cast != null)
        {
            if(Arr.in(cast,[true,'json']))
            r = Json.decode(r);
            
            else if(cast === 'int')
            r = Integer.cast(r);
            
            else if(cast === 'bool')
            r = Bool.fromScalar(r);
        }        
        
        return r;
    },
    
    
    // getAttrInt
    // retourne une valeur d'attribut sous forme de int
    getAttrInt: function(node,key)
    {
        return this.getAttr(node,key,'int');
    },
    
    
    // getAttrBool
    // retourne une valeur d'attribut sous forme de boolean
    getAttrBool: function(node,key)
    {
        return this.getAttr(node,key,'bool');
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
        this.checkNode(node);
        return node.innerHTML;
    },
    
    
    // getText
    // retourne le text contenu dans une node et ses enfants
    // ne retourne aucune balise html
    getText: function(node)
    {
        this.checkNode(node);
        return node.textContent;
    },
    
    
    // getValue
    // retourne la valeur pour une node, surtout pour les formulaires
    // la valeur retourné peut être trim
    getValue: function(node,trim)
    {
        let r = undefined;
        this.checkNode(node);
        
        r = node.value;
        r = Str.cast(r);
        
        if(trim === true)
        r = Str.trim(r);
        
        return r;
    },
    
    
    // getWidth
    // retourne la longueur de l'élément sans padding, border ou margin
    // possible de retourner en additionnant le padding et border
    getWidth: function(node,outer)
    {
        Dom.checkNode(node);
        return (outer === true)? $(node).outerWidth():$(node).width();
    },
    
    
    // getHeight
    // retourne la hauteur de l'élément sans padding, border ou margin
    // possible de retourner en additionnant le padding et border
    getHeight: function(node,outer)
    {
        Dom.checkNode(node);
        return (outer === true)? $(node).outerHeight():$(node).height();
    },
    
    
    // getDimension
    // retourne un tableau avec plusieurs dimensions relié à la node
    getDimension: function(node)
    {
        return {
            width: this.getWidth(node),
            outerWidth: this.getWidth(node,true),
            height: this.getHeight(node),
            outerHeight: this.getHeight(node,true)
        }
    },
    
    
    // getScroll
    // retourne un object avec les données pour le scroll
    getScroll: function(node)
    {
        Dom.checkNode(node);
        return {
            top: $(node).scrollTop(),
            left: $(node).scrollLeft()
        }
    },
    
    
    // getOffset
    // retourne un objet avec les données pour le offset de la node
    getOffset: function(node)
    {
        Dom.checkNode(node);
        return $(node).offset();
    },
    
    
    // focus
    // permet de mettre le focus sur une node
    focus: function(node)
    {
        Dom.checkNode(node);
        node.focus();
        
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
    serialize: function(nodes)
    {
        nodes = Dom.nodeWrap(nodes);
        nodes = Dom.checkNodes(nodes);
        
        return $(nodes).serialize();
    },
    
    
    // valueSeparator
    // prend un ensemble de input et crée un set avec les valeurs
    // un séparateur peut être fourni, sinon utilise -
    valueSeparator: function(nodes,separator,trim) 
    {
        let r = '';
        separator = (Str.isNotEmpty(separator))? separator:'-';
        
        if(Str.isNotEmpty(separator))
        {
            const $inst = this;
            
            this.each(nodes,function() {
                r += (r.length)? separator:"";
                r += $inst.getValue(this,trim);
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
            const href = this.getAttr(node,'data-href');
            const char = this.getAttr(node,'data-char');
            
            if(Str.isNotEmpty(href) && Str.isNotEmpty(char))
            {
                r = href.replace(char,replace);
                
                if(Str.isNotEmpty(replace2))
                r = r.replace(char,replace2);
            }
        }
        
        return r;
    },
    
    
    // each
    // permet de faire un loop sur une ou plusieurs nodes
    each: function(loop,callback)
    {
        loop = this.nodeWrap(loop);
        this.checkNodes(loop,false);
        
        return Arr.each(loop,callback);
    }
}