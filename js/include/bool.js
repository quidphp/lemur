/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// bool
// methods for bool primitive type
const BoolPrimitive = {
    
    // is
    // retourne vrai si la valeur est une fonction
    is: function(value) 
    {
        return typeof(value) === 'boolean';
    },
    
    
    // fromInt
    // retourne un booléean à partir d'un int
    fromInt: function(value)
    {
        let r = null;
        
        if(value === true)
        r = 1;

        else if(value === false)
        r = 0;
        
        return r;
    },
    
    
    // toggle
    // permet de faire un toggle sur une valeur boolean
    toggle: function(value)
    {
        let r = null;

        if(value === true)
        r = false;

        else if(value === false)
        r = true;

        return r;
    }
}