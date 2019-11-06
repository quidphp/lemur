"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// arr
// script with a set of helper functions related to arrays

// isArray
// retourne vrai si la valeur est un tableau
quid.base.isArray = function(value) 
{
    return $.isArray(value);
}