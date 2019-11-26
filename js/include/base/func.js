"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// func
// script with functions related to functions
quid.base.func = new function() {
    
    // is
    // retourne vrai si la valeur est une fonction
    this.is = function(value) 
    {
        return $.isFunction(value);
    }
};