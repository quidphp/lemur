/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// dom
// script with functions for manipulating the dom
Quid.Dom = new function() 
{
    // instance
    var $inst = this;
    
    
    // setsAttr
    // remplace tous les attributs d'une balise, il faut fournir un plain object
    // possible de retirer les attributs existants
    this.setsAttr = function(value,node)
    {
        if(Quid.Obj.isPlain(value))
        {
            $(node).each(function() {
                var $this = $(this);
                
                $.each(value, function(k,v) {
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
            var $this = $(this);
            var node = $(this)[0];
            
            $.each(node.attributes, function(index,value) 
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
        if(Quid.Str.isNotEmpty(base))
        {
            $(node).not("[id]").each(function(index, el) {
                var newId = base+Quid.Number.uniqueInt();
                var labels = Quid.Selector.labels(this);
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
        var filter = $(node).find("a[target!='_blank']").filter(function() {
            return (Quid.Uri.isExternal($(this).attr("href")) && !$(this).is("[href^='mailto:']"))? true:false;
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
        if(Quid.Str.is(fragment))
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
        if(until && Quid.Str.isNotEmpty(html))
        {
            $(node).each(function(index, el) {
                var nextUntil = $(this).nextUntil(until);
                $(this).add(nextUntil).wrapAll(html);
            });
        }
        
        return this;
    }
}