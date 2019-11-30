/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scalar
// script with functions related to scalar values
quid.scalar = new function() 
{    
    // instance
    var $inst = this;
    
    
    // is
    // retourne vrai si la valeur est scalar
    this.is = function(value) 
    {
        var r = false;
        var type = typeof value;
        
        if(type === 'boolean' || type === 'number' || type === 'string')
        r = true;
        
        return r;
    }
};