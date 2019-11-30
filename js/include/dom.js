/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// dom
// script with functions for manipulating the dom
quid.dom = new function() 
{
    // instance
    var $inst = this;
    
    
    // replaceAttr
    // remplace tous les attributs d'une balise, il faut fournir un plain object
    // possible de retirer les attributs existants
    this.replaceAttr = function(value,node,remove)
    {
        if(remove === true)
        $inst.removeAttr(node);
        
        if(quid.obj.isPlain(value))
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


    // removeAttr
    // permet de retirer tous les attributs à une tag
    this.removeAttr = function(node)
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
        if(quid.str.isNotEmpty(base))
        {
            $(node).not("[id]").each(function(index, el) {
                var newId = base+quid.number.uniqueInt();
                var labels = quid.selector.labels(this);
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
            return (quid.uri.isExternal($(this).attr("href")) && !$(this).is("[href^='mailto:']"))? true:false;
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
        if(quid.str.is(fragment))
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
        if(until && quid.str.isNotEmpty(html))
        {
            $(node).each(function(index, el) {
                var nextUntil = $(this).nextUntil(until);
                $(this).add(nextUntil).wrapAll(html);
            });
        }
        
        return this;
    }
}