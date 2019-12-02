/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// domChange
// script with functions for manipulating the dom
const DomChange = new function() 
{
    // instance
    const $inst = this;
    
    
    // setsAttr
    // remplace tous les attributs d'une balise, il faut fournir un plain object
    // possible de retirer les attributs existants
    this.setsAttr = function(value,node)
    {
        if(Obj.isPlain(value))
        {
            $(node).each(function() {
                const $this = $(this);
                
                $.each(value,function(k,v) {
                    $this.attr(k,v);
                });
            });
        }
        
        return this;
    }


    // emptyAttr
    // permet de retirer tous les attributs à une tag
    this.emptyAttr = function(node)
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
    }
    
    
    // addId
    // ajoute un id aux éléments contenus dans l'objet qui n'en ont pas
    // change aussi aux labels associés si existants
    this.addId = function(base,node)
    {
        if(Str.isNotEmpty(base))
        {
            $(node).not("[id]").each(function(index, el) {
                const newId = base+Num.uniqueInt();
                const labels = Selector.labels(this);
                $(this).prop('id',newId);
                labels.prop('for',newId);
            });
        }
        
        return this;
    }


    // aExternalBlank
    // ajout target _blank à tous les liens externes qui n'ont pas la target
    this.aExternalBlank = function(node)
    {
        const filter = $(node).find("a[target!='_blank']").filter(function() {
            return (Uri.isExternal($(this).attr("href")) && !$(this).is("[href^='mailto:']"))? true:false;
        });

        filter.each(function(index, el) {
            $(this).prop('target','_blank');
        });
        
        return this;
    }
    
    
    // hrefChangeHash
    // change le hash sur des balises avec attribut href
    this.hrefChangeHash = function(fragment,node)
    {
        if(Str.is(fragment))
        {
            $(node).each(function() {
                $(this)[0].hash = fragment;
            });
        }
        
        return this;
    }
    
    
    // wrapConsecutiveSiblings
    // permet d'enrobber toutes les prochaines balises répondant à until dans une balise html
    this.wrapConsecutiveSiblings = function(node,until,html)
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
}

// export
Lemur.DomChange = DomChange;