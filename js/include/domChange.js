/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// domChange
// script with functions for manipulating the dom
const DomChange = Lemur.DomChange = Factory(true,
{
    // setsAttr
    // remplace tous les attributs d'une balise, il faut fournir un plain object
    // possible de retirer les attributs existants
    setsAttr: function(value,node)
    {
        if(Pojo.is(value))
        {
            $(node).each(function() {
                const $this = $(this);
                
                $.each(value,function(k,v) {
                    $this.attr(k,v);
                });
            });
        }
        
        return this;
    },


    // emptyAttr
    // permet de retirer tous les attributs à une tag
    emptyAttr: function(node)
    {
        $(node).each(function(index, el) {
            const $this = $(this);
            const node = $(this)[0];
            
            $.each(node.attributes,function(index,value) 
            {
                if(value != null)
                $this.removeAttr(value.name);
            });
        });
        
        return this;
    },
    
    
    // addId
    // ajoute un id aux éléments contenus dans l'objet qui n'en ont pas
    // possible de fournir un callback pour chaque changement, par exemple pour ajuster les id des labels si c'est un input
    addId: function(base,node,callback)
    {
        if(Str.isNotEmpty(base))
        {
            $(node).not("[id]").each(function(index, el) {
                const newId = base+Integer.unique();
                $(this).prop('id',newId);
                
                if(Func.is(callback))
                callback.call(this,newId);
            });
        }
        
        return this;
    },


    // aExternalBlank
    // ajout target _blank à tous les liens externes qui n'ont pas la target
    aExternalBlank: function(node)
    {
        const anchor = Selector.scopedQuerySelectorAll(node,"a[target!='_blank']");
        
        $(anchor).filter(function() {
            return (Uri.isExternal($(this).attr("href")) && !$(this).is("[href^='mailto:']"))? true:false;
        })
        .each(function(index, el) {
            $(this).prop('target','_blank');
        });
        
        return this;
    },
    
    
    // hrefChangeHash
    // change le hash sur des balises avec attribut href
    hrefChangeHash: function(fragment,node)
    {
        if(Str.is(fragment))
        {
            $(node).each(function() {
                $(this)[0].hash = fragment;
            });
        }
        
        return this;
    },
    
    
    // wrapConsecutiveSiblings
    // permet d'enrobber toutes les prochaines balises répondant à until dans une balise html
    wrapConsecutiveSiblings: function(node,until,html)
    {
        if(until && Str.isNotEmpty(html))
        {
            $(node).each(function(index, el) {
                const nextUntil = $(this).nextUntil(until);
                $(this).add(nextUntil).wrapAll(html);
            });
        }
        
        return this;
    }
});