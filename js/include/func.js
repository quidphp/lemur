/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// func
// script with functions related to functions
const FuncObj =
{    
    // is
    // retourne vrai si la valeur est une fonction
    is: function(value) 
    {
        return typeof value === "function" && typeof value.nodeType !== "number";
    },
    
    
    // noop
    // retourne une fonction vide
    noop: function() 
    {
        return function() {};
    }
}