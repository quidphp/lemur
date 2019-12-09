/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// integer
// methods related to integer numbers
const IntegerPrimitive = 
{   
    // is
    // retourne vrai si la valeur est un int
    is: function(value)
    {
        return (Num.is(value) && (parseInt(value) === value))? true:false;
    },
    
    
    // cast
    // retourne le nombre sous forme de int
    cast: function(value)
    {
        return (Num.is(value))? parseInt(value):null;
    },
    
    
    // fromBool
    // retourne un numéro à partir d'un boolean
    fromBool: function(value)
    {
        let r = null;

        if(value === true)
        r = 1;

        else if(value === false)
        r = 0;

        return r;
    },
    
    
    // toggle
    // toggle des valeurs primaires (1/0)
    toggle: function(value)
    {
        let r = null;

        if(value === 1)
        r = 0;

        else if(value === 0)
        r = 1;

        return r;
    },
    
    
    // unique
    // retourne un int jamais utilisé, utile pour générer des ids unique
    unique: (function(value)
    {
        let i = 0;
        return function() {
            return i++;
        };
    })()
}