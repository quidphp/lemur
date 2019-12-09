/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// pojo
// script with a set of helper functions related to plain objects
const PojoObj =
{
    // is
    // retourne vrai si c'est un objet plain
    is: function(value)
    {
        let r = false;
        
        if(value != null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype)
        {
            if(value.toString() === '[object Object]')
            r = true;
        }
        
        return r;
    },
    
    
    // replaceRecursive
    // retourne un nouvel objet contenant le résultat d'un merge multidimensionnel de tous les objets données en argument
    replaceRecursive: function() 
    {
        let r = {};
        let args = Array.from(arguments);
        
        if(args.length > 0 && this.is(args[0]))
        {
            args = [true,r].concat(args);
            r = $.extend.apply(null,args);
        }
        
        return r;
    },
    
    
    // climb
    // permet de grimper dans un objet plain à partir d'un tableau
    climb: function(array,r) 
    {
        if(Arr.is(array) && this.is(r))
        {
            var i;
            const $inst = this;
            
            Arr.each(array,function(value) {
                if($inst.keyExists(value,r))
                r = r[value];
                
                else
                {
                    r = undefined;
                    return false;
                }
            });
        }
        
        return r;
    }
}