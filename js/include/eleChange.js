/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// eleChange
// script with functions for manipulating element nodes
const EleChange = Lemur.EleChange = new function()
{
    // inst
    const $inst = this;
    
    
    // setAttr
    // change un attribut sur une ou plusieurs nodes
    // si undefined, efface l'attribut
    this.setAttr = function(nodes,key,value)
    {
        nodes = Nod.wrap(nodes,false);
        Str.check(key,true);
        
        if(Obj.is(value))
        value = Json.encode(value);
        
        Ele.each(nodes,function() {
            if(value === undefined)
            this.removeAttribute(key);
            else
            this.setAttribute(key,value);
        });
        
        return;
    }
    
    
    // removeAttr
    // enlève un attribut sur une ou plusieurs nodes
    this.removeAttr = function(nodes,key)
    {
        return this.setAttr(nodes,key,undefined);
    }
    
    
    // setsAttr
    // remplace tous les attributs d'une ou plusieurs nodes, il faut fournir un plain object
    // possible de retirer les attributs existants
    this.setsAttr = function(nodes,value)
    {
        Pojo.check(value);
        
        Ele.each(nodes,function() {
            const $this = this;
            
            Pojo.each(value,function(v,k) {
                $inst.setAttr($this,k,v);
            });
        });
        
        return;
    }


    // emptyAttr
    // permet de retirer tous les attributs à une ou plusieurs nodes
    this.emptyAttr = function(nodes)
    {
        Ele.each(nodes,function() {
            const $this = this;
            
            ArrLike.each(this.attributes,function(value) {
                if(value != null)
                $inst.removeAttr($this,value.name);
            });
        });
        
        return;
    }
    
    
    // addId
    // ajoute un id aux éléments contenus dans l'objet qui n'en ont pas
    this.addId = function(nodes,value)
    {
        Str.check(value);
        
        Ele.each(nodes,function() {
            if(!Nod.match(this,"[id]"))
            {
                const newId = value+Integer.unique();
                $inst.setProp(this,'id',newId);
            }
        });
        
        return;
    }
    

    // setProp
    // permet de changer la propriété sur une node
    this.setProp = function(node,key,value)
    {
        Ele.check(node);
        Str.check(key);
        Obj.setRef(key,value,node);
        
        return;
    }
    
    
    // setCss
    // permet de changer une valeur inline du css
    this.setCss = function(node,key,value)
    {
        Ele.check(node);
        Str.check(key);
        key = Str.toCamelCase('-',key);
        
        node.style[key] = value;
        
        return;
    },
    
    
    // setValue
    // permet de changer la valeur d'une node
    // si la valeur est un objet, encode en json
    this.setValue = function(node,value)
    {
        Ele.check(node);
        
        if(Obj.is(value))
        value = Json.encode(value);
        
        value = Str.cast(value);
        node.value = value;
        
        return;
    }
    
    
    // toggleClass
    // permet d'ajouter ou enlever une classe sur une ou plusieurs nodes
    this.toggleClass = function(nodes,value,bool)
    {
        nodes = Nod.wrap(nodes,false);
        Str.check(value,true);
        
        Ele.each(nodes,function() {
            this.classList.toggle(value,bool);
        });
        
        return;
    }
    
    
    // setHtml
    // permet de changer le html dans une balise
    this.setHtml = function(node,value)
    {
        Ele.check(node);
        value = Dom.html(value);
        node.innerHTML = value;
        
        return;
    }
    
    
    // setText
    // permet de changer contenu texte d'une balise
    this.setText = function(node,value)
    {
        Ele.check(node);
        Str.check(value,false);
        value = (value == null)? '':value;
        node.textContent = value;
        
        return;
    }
    
    
    // setDimension
    // permet de changer la largeur et hauteur de la node
    this.setDimension = function(node,width,height)
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
    }
    
    
    // setScroll
    // permet de changer les valeurs du scroll
    this.setScroll = function(node,top,left)
    {
        Ele.check(node);
        
        if(Num.is(top))
        node.scrollTop = (top > 0)? top:0;
        
        if(Num.is(left))
        node.scrollLeft = (left > 0)? left:0;
        
        return;
    }
    
    
    // prepend
    // ajoute du contenu html comme premier enfant de la node
    this.prepend = function(node,value)
    {
        Ele.check(node);
        value = Dom.html(value);
        $(node).prepend(value);
        
        return;
    }
    
    
    // append
    // ajoute du contenu html comme dernier enfant de la node
    this.append = function(node,value)
    {
        Ele.check(node);
        value = Dom.html(value);
        $(node).append(value);
        
        return;
    }
    
    
    // insertBefore
    // permet d'insérer une node avant une autre
    this.insertBefore = function(node,value)
    {
        Ele.check(node);
        value = Dom.html(value);
        
        return $(value).insertBefore(node).get(0);
    }
    
    
    // insertAfter
    // permet d'insérer une node après une autre
    this.insertAfter = function(node,value)
    {
        Ele.check(node);
        value = Dom.html(value);
        
        return $(value).insertAfter(node).get(0);
    }
    
    
    // wrap
    // permet d'enrobber une node dans une une nouvelle balise html
    this.wrap = function(node,value)
    {
        Ele.check(node);
        Str.check(value);
        $(nodes).wrap(value);
        
        return;
    }
    
    
    // wrapAll
    // permet d'enrobber un groupe de node dans une une nouvelle balise html
    this.wrapAll = function(nodes,value)
    {
        Ele.checks(nodes);
        Str.check(value);
        $(nodes).wrapAll(value);
        
        return;
    }
    
    
    // remove
    // permet d'effacer une ou plusieurs nodes du dom
    // utilise arguments
    this.remove = function(value) 
    {
        const nodes = Nod.wrap(value,false);
        
        Ele.each(nodes,function() {
            this.remove();
        });
        
        return;
    }
    
    
    // animate
    // permet de créer une animation sur une ou plusieurs nodes
    // retourne une promise qui sera appelé une fois après que toutes les nodes aient finis l'animation
    this.animate = function(nodes,param,speed) 
    {
        let r = null;
        nodes = Nod.wrap(nodes,true);
        this.animateStop(nodes);
        Pojo.check(param);
        Num.check(speed);
        
        return $(nodes).animate(param,speed).promise();
    }
    
    
    // animateStop
    // permet d'arrêter toutes les animations sur une ou plusiuers nodes
    this.animateStop = function(nodes) 
    {
        nodes = Nod.wrap(nodes,true);
        $(nodes).stop(true,true);
        
        return;
    }
}