/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// pojo
// script with a set of helper functions related to plain objects
const PojoObj = {
    
    // is
    // retourne vrai si c'est un objet plain
    is: function(value)
    {
        return (value != null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype && value.toString() === '[object Object]');
    },
    
    
    // replaceRecursive
    // retourne un nouvel objet contenant le résultat d'un merge multidimensionnel de tous les plain objets données en argument
    replaceRecursive: function() 
    {
        let r = null;
        let args = Array.from(arguments);
        
        if(args.length > 0 && this.is(args[0]))
        {
            const $inst = this;
            r = this.copy(args[0]);
            
            Arr.each(Arr.sliceStart(1,args),function(value) {
                if($inst.is(value))
                {
                    $inst.each(value,function(value2,key2) {
                        if($inst.is(r[key2]) && $inst.keyExists(key2,r))
                        r[key2] = $inst.replaceRecursive(r[key2],value2);
                        
                        else
                        r[key2] = value2;
                    });
                }
            });
        }

        return r;
    }
}