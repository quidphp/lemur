/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// integer
// methods related to integer numbers
const IntegerPrimitive = {
    
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
        return (Scalar.isNotBool(value) && value !== '')? parseInt(value):null;
    },
    
    
    // round
    // arrondi le nombre sous forme de int
    round: function(value)
    {
        return (Scalar.isNotBool(value))? Math.round(parseFloat(value)):null;
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
    
    
    // range
    // retourne un tableau range
    range: function(min,max,inc)
    {
        let r = null;
        min = (min == null)? 1:min;
        inc = (inc == null)? 1:inc;
        
        if(Integer.isPositive(min,true) && Integer.isPositive(max,true) && Integer.isPositive(inc))
        {
            const length = Math.floor((max - min) / inc) + 1;
            const arr = Array(length).fill(min);
            
            r = arr.map(function(x,y) {
                return x + y * inc;
            });
        }
        
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