/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// arrLike
// script with some functions related to arr-like management
const ArrLikeRead = {
    
    // is
    // retourne vrai si la variable est comme un tableau (array-like)
    // retourne faux si la valeur est un array
    is: function(value)
    {
        let r = false;
        
        if(!Arr.is(value) && !Scalar.is(value) && !Func.is(value) && !Win.is(value))
        {
            const type = Vari.type(value);
            const length = !!value && "length" in value && value.length;
            r = type === 'array' || length === 0 || typeof length === "number" && length > 0 && (length - 1) in value;
        }
        
        return r;
    }
}