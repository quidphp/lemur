/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// domChange
// script with functions for manipulating the dom
const DomChange = Lemur.DomChange = {
    
    // setAttr
    // change un attribut sur une ou plusieurs nodes
    // si undefined, efface l'attribut
    setAttr: function(nodes,key,value)
    {
        Str.check(key,true);
        
        if(value === undefined)
        $(nodes).removeAttr(key);
        else
        $(nodes).attr(key,value);
        
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
        
        Dom.each(nodes,function() {
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
        
        Dom.each(nodes,function() {
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
        
        Dom.each(nodes,function() {
            if(!Selector.match(this,"[id]"))
            {
                const newId = value+Integer.unique();
                $inst.setProp(this,'id',newId);
            }
        });
        
        return;
    },
    
    
    // setProp
    // permet de changer la propriété sur une node
    setProp: function(node,key,value)
    {
        Dom.checkNode(node);
        Str.check(key);
        Obj.setRef(key,value,node);
        
        return;
    },
    
    
    // setValue
    // permet de changer la valeur d'une node
    // si la valeur est un objet, encode en json
    setValue: function(node,value)
    {
        Dom.checkNode(node);
        
        if(Obj.is(value))
        value = Json.encode(value);
        
        $(node).val(value);
        
        return;
    },
    
    
    // toggleClass
    // permet d'ajouter ou enlever une classe sur une ou plusieurs nodes
    toggleClass: function(nodes,value,bool)
    {
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false);
        Str.check(value,true);
        
        Dom.each(nodes,function() {
            this.classList.toggle(value,bool);
        });
        
        return;
    },
    
    
    // setHtml
    // permet de changer le html dans une balise
    setHtml: function(node,value)
    {
        Dom.checkNode(node);
        value = Html.get(value);
        $(node).html(value);
        
        return;
    },
    
    
    // setText
    // permet de changer contenu texte d'une balise
    setText: function(node,value)
    {
        Dom.checkNode(node);
        Str.check(value,false);
        value = (value == null)? '':value;
        $(node).text(value);
        
        return;
    },
    
    
    // setWidth
    // permet de changer la largeur de la node
    setWidth: function(node,value)
    {
        Dom.checkNode(node);
        Scalar.check(value);
        $(node).width(value);
        
        return;
    },
    
    
    // setHeight
    // permet de changer la hauteur de la node
    setHeight: function(node,value)
    {
        Dom.checkNode(node);
        Scalar.check(value);
        $(node).height(value);
        
        return;
    },
    
    
    // setScroll
    // permet de changer les valeurs du scroll
    setScroll: function(node,top,left)
    {
        Dom.checkNode(node);

        if(Num.is(top))
        $(node).scrollTop((top > 0)? top:0);
        
        if(Num.is(left))
        $(node).scrollLeft((left > 0)? left:0);
        
        return;
    },
    
    
    // prepend
    // ajoute du contenu html comme premier enfant de la node
    prepend: function(node,value)
    {
        Dom.checkNode(node);
        value = Html.get(value);
        $(node).prepend(value);
        
        return;
    },
    
    
    // append
    // ajoute du contenu html comme dernier enfant de la node
    append: function(node,value)
    {
        Dom.checkNode(node);
        value = Html.get(value);
        $(node).append(value);
        
        return;
    },
    
    
    // insertBefore
    // permet d'insérer une node avant une autre
    insertBefore: function(node,value)
    {
        Dom.checkNode(node);
        value = Html.get(value);
        
        return $(value).insertBefore(node).get(0);
    },
    
    
    // insertAfter
    // permet d'insérer une node après une autre
    insertAfter: function(node,value)
    {
        Dom.checkNode(node);
        value = Html.get(value);
        
        return $(value).insertAfter(node).get(0);
    },
    
    
    // wrap
    // permet d'enrobber une node dans une une nouvelle balise html
    wrap: function(node,value)
    {
        Dom.checkNode(node);
        Str.check(value);
        $(nodes).wrap(value);
        
        return;
    },
    
    
    // wrapAll
    // permet d'enrobber un groupe de node dans une une nouvelle balise html
    wrapAll: function(nodes,value)
    {
        Dom.checkNodes(nodes);
        Str.check(value);
        $(nodes).wrapAll(value);
        
        return;
    },
    
    
    // remove
    // permet d'effacer une ou plusieurs nodes du dom
    remove: function(nodes) 
    {
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false);
        
        Dom.each(nodes,function() {
            this.remove();
        });
        
        return;
    },
    
    
    // animate
    // permet de créer une animation sur une ou plusieurs nodes
    // retourne une promise qui sera appelé une fois après que toutes les nodes aient finis l'animation
    animate: function(nodes,param,speed) 
    {
        let r = null;
        nodes = Dom.nodeWrap(nodes);
        this.animateStop(nodes);
        Pojo.check(param);
        Num.check(speed);
        
        return $(nodes).animate(param,speed).promise();
    },
    
    
    // animateStop
    // permet d'arrêter toutes les animations sur une ou plusiuers nodes
    animateStop: function(nodes) 
    {
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes);
        $(nodes).stop(true,true);
        
        return;
    }
}