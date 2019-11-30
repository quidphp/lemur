/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// func
// script with functions related to functions
quid.func = new function() 
{    
    // instance
    var $inst = this;
    
    
    // is
    // retourne vrai si la valeur est une fonction
    this.is = function(value) 
    {
        return typeof value === "function" && typeof value.nodeType !== "number";
    }
};