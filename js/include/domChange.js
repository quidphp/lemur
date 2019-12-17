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
    setAttr: function(nodes,key,value)
    {
        Str.check(key,true);
        return $(nodes).attr(key,value);
    },
    
    
    // setsAttr
    // remplace tous les attributs d'une ou plusieurs nodes, il faut fournir un plain object
    // possible de retirer les attributs existants
    setsAttr: function(value,nodes)
    {
        Pojo.check(value);
        
        Dom.each(nodes,function() {
            const $this = this;
            
            Pojo.each(value,function(v,k) {
                $($this).attr(k,v);
            });
        });
        
        return this;
    },


    // emptyAttr
    // permet de retirer tous les attributs à une ou plusieurs nodes
    emptyAttr: function(nodes)
    {
        Dom.each(nodes,function() {
            const $this = this;
            
            ArrLike.each(this.attributes,function(value) {
                if(value != null)
                $($this).removeAttr(value.name);
            });
        });
        
        return this;
    },
    
    
    // addId
    // ajoute un id aux éléments contenus dans l'objet qui n'en ont pas
    // possible de fournir un callback pour chaque changement, par exemple pour ajuster les id des labels si c'est un input
    addId: function(base,nodes,callback)
    {
        Str.check(base);
        
        Dom.each(nodes,function() {
            if(!$(this).is("[id]"))
            {
                const newId = base+Integer.unique();
                $(this).prop('id',newId);
                
                if(Func.is(callback))
                callback.call(this,newId);
            }
        });
        
        return this;
    }
}