/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// selector
// script with behaviours related to selecting nodes
const Selector = new function() 
{
    // instance
    const $inst = this;
    
    
    // input
    // retourne un selector commun à utiliser pour les inputs
    this.input = function() 
    {
        return "input,select,textarea,button[type='submit']";
    }
    
    
    // inputGroup
    // retourne une sélection avec tous les inputs de même type et même nom
    this.inputGroup = function(node)
    {
        let r = $();
        
        $(node).each(function(index) {
            const name = $(this).prop("name");
            const type = $(this).prop("type");
            
            if(Str.isNotEmpty(name) && Str.isNotEmpty(type))
            r = r.add($("[type='"+type+"'][name='"+name+"']"));
        });
        
        return r;
    }


    // labels
    // retourne le ou les labels liés à l'élément
    this.labels = function(node)
    {
        let r = $();
        const id = $(node).prop('id');
        d(id);
        
        if(Scalar.is(id))
        r = $(document).find("label[for='"+id+"']");
        
        return r;
    }
}

// export
Lemur.Selector = Selector;