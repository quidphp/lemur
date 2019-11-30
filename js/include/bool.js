/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// bool
// script with functions related to booleans
quid.bool = new function() 
{
    // instance
    var $inst = this;
    
    
    // is
    // retourne vrai si la valeur est une fonction
    this.is = function(value) 
    {
        return typeof(value) === 'boolean';
    }
};