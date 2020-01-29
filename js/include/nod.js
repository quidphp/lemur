/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// nod
// object for element, text and document nodes
const NodTarget = {
    
    // is
    // retourne vrai si la valeur est un element, un textNode ou un document
    is: function(value)
    {
        return (Ele.is(value) || Doc.is(value) || this.isText(value) || this.isDoctype(value));
    },
    
    
    // isText
    // retourne vrai si c'est une texte node
    isText: function(value)
    {
        return (value != null && value.nodeType === Node.TEXT_NODE);
    },
    
    
    // isDoctype
    // retourne vrai si c'est une node doctype
    isDoctype: function(value)
    {
        return (value != null && value.nodeType === Node.DOCUMENT_TYPE_NODE);
    },
    
    
    // isTemplate
    // retourne vrai si la valeur est un élément template
    isTemplate: function(value)
    {
        return value instanceof HTMLTemplateElement;
    },
    
    
    // realNode
    // retourne la vrai node
    // utilisé pour les méthodes du sélecteur
    realNode: function(value)
    {
        let r = value;
        
        if(this.isTemplate(value))
        r = value.content;
        
        return r;
    },
    
    
    // getText
    // retourne le text contenu dans une node et ses enfants
    // ne retourne aucune balise html
    getText: function(node)
    {
        this.check(node);
        return node.textContent;
    },
    
    
    // setText
    // permet de changer contenu texte d'une balise
    setText: function(node,value)
    {
        this.check(node);
        Str.check(value,false);
        value = (value == null)? '':value;
        node.textContent = value;
        
        return;
    },
    
    
    // getProp
    // retourne une propriété d'une node
    getProp: function(node,key)
    {
        this.check(node);
        return Obj.get(key,node);
    },
    
    
    // setProp
    // permet de changer la propriété sur une node ou plusieurs node
    setProp: function(nodes,key,value)
    {
        Str.check(key);
        nodes = this.wrap(nodes,false);
        
        this.each(nodes,function() {
            Obj.setRef(key,value,this);
        });
        
        return;
    },
    
    
    // propStr
    // prend un ensemble de node et retourne une string concatené pour une même prop
    // un séparateur peut être fourni, sinon utilise -
    propStr: function(nodes,prop,separator) 
    {
        let r = '';
        nodes = Nod.wrap(nodes,true);
        Str.check(prop,true);
        separator = (Str.isNotEmpty(separator))? separator:'-';
        const $inst = this;
        
        this.each(nodes,function() {
            r += (r.length)? separator:"";
            r += $inst.getProp(this,prop);
        });
        
        return r;
    },
    
    
    // propObj
    // permet de retourner un objet à partir de plusieurs nodes
    // il faut spécifier une prop pour clé et une autre pour valeur
    propObj: function(nodes,propKey,propValue)
    {
        const r = {};
        nodes = Nod.wrap(nodes,true);
        const $inst = this;
        Str.check(propKey,true);
        Str.check(propValue,true);
        
        this.each(nodes,function() {
            const key = $inst.getProp(this,propKey);
            const value = $inst.getProp(this,propValue);
            r[key] = value;
        });
        
        return r;
    },
    
    
    // clone
    // clone une node ou un document
    clone: function(value)
    {
        this.check(value);
        return value.cloneNode(true);
    },
    
    
    // clones
    // permet de cloner un tableau de nodes ou document
    clones: function(value)
    {
        const r = [];
        const $inst = this;
        
        this.each(value,function() {
            r.push($inst.clone(this));
        });
        
        return r;
    },
    
    
    // remove
    // permet d'effacer une ou plusieurs nodes du dom
    // utilise arguments
    remove: function(value) 
    {
        const nodes = this.wrap(value,false);
        
        this.each(nodes,function() {
            this.remove();
        });
        
        return;
    }
}


// eleDocTarget
// objet pour les nodes qui contiennent du html (element + doc seulement)
const EleDocTarget = {
    
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
    
    
    // getHtml
    // retourne le html dans la node ou le document
    getHtml: function(value)
    {
        let r = '';
        const children = Nod.children(value,null,true);
        r = this.getOuterHtml(children);
        
        return r;
    },
    
    
    // getOuterHtml
    // retourne le outerHtml d'une ou plusieurs nodes
    getOuterHtml: function(nodes)
    {
        let r = '';
        
        Nod.each(nodes,function() {
            let content = '';
            
            if(this.outerHTML != null)
            content = this.outerHTML;
            
            else if(this.textContent != null)
            content = this.textContent;
            
            r += content;
        });

        return r;
    },
    
    
    // setHtml
    // permet de changer le html dans la node ou le document
    // efface tous les enfants et ajoute la ou les nouvelles nodes
    setHtml: function(node,value,clone)
    {
        this.check(node);
        node = this.realNode(node);
        const children = Nod.children(node,null,true);
        value = Dom.htmlNodes(value,clone);
        Nod.remove(children);
        
        Nod.each(value,function() {
            node.appendChild(this);
        });
        
        return;
    },
    
    
    // prepend
    // ajout une ou plusieurs nodes comme premiers enfant de la node
    prepend: function(node,value)
    {
        this.check(node);
        value = Dom.htmlNodes(value);
        node.prepend.apply(node,value);
        
        return;
    },
    
    
    // append
    // ajoute du contenu html comme dernier enfant de la node
    append: function(node,value)
    {
        this.check(node);
        value = Dom.htmlNodes(value);
        node.append.apply(node,value);
        
        return;
    },
        

    // insertBefore
    // permet d'insérer une ou plusieurs node avant une autre
    insertBefore: function(node,value)
    {
        const r = [];
        this.check(node);
        value = Dom.htmlNodes(value);
        
        this.each(value,function() {
            r.push(node.insertAdjacentElement('beforebegin',this));
        });
        
        return r;
    },


    // insertAfter
    // permet d'insérer une ou plusieurs node après une autre
    insertAfter: function(node,value)
    {
        const r = [];
        this.check(node);
        value = Dom.htmlNodes(value);
        
        this.each(value,function() {
            r.push(node.insertAdjacentElement('afterend',this));
        });
        
        return r;
    },


    // wrapAll
    // permet d'enrobber un groupe de node dans une une nouvelle balise html
    wrapAll: function(nodes,value)
    {
        let r = null;
        nodes = this.wrap(nodes,true);
        value = Dom.htmlNodes(value);
        
        if(Arr.isNotEmpty(value))
        {
            r = Arr.valueFirst(value);
            const firstNode = Arr.valueFirst(nodes);
            this.insertBefore(firstNode,value);
            this.append(r,nodes);
        }
        
        return r;
    }
}