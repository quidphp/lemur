/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// bool
// script with functions related to booleans
const Bool = new function() 
{
    // instance
    const $inst = this;
    
    
    // is
    // retourne vrai si la valeur est une fonction
    this.is = function(value) 
    {
        return typeof(value) === 'boolean';
    }
}

// export
Lemur.Bool = Bool;