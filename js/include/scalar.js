/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scalar
// script with functions related to scalar values
const ScalarPrimitive = {    
    
    // is
    // retourne vrai si la valeur est scalar
    is: function(value) 
    {
        let r = false;
        const type = typeof value;
        
        if(type === 'boolean' || type === 'number' || type === 'string')
        r = true;
        
        return r;
    },
    
    
    // isNotBool
    // retourne vrai si scalar mais pas bool
    isNotBool: function(value)
    {
        return (this.is(value) && !Bool.is(value))? true:false;
    },
    
    
    // cast
    // permet de cast une valeur selon un type donné en deuxième argument
    cast: function(r,type)
    {
        if(r != null && type != null)
        {
            if(Arr.in(type,[true,'json']))
            r = Json.decode(r);
            
            if(type === 'int')
            r = Integer.cast(r);
            
            else if(type === 'bool')
            r = Bool.fromScalar(r);
        }
        
        return r;
    }
}