/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scalar
// script with functions related to scalar values
const Scalar = new function() 
{    
    // instance
    const $inst = this;
    
    
    // is
    // retourne vrai si la valeur est scalar
    this.is = function(value) 
    {
        let r = false;
        const type = typeof value;
        
        if(type === 'boolean' || type === 'number' || type === 'string')
        r = true;
        
        return r;
    }
}

// export
Lemur.Scalar = Scalar;