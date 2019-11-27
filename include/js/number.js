"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// number
// script with functions related to numbers
quid.base.number = new function() {
    
    // is
    // retourne vrai si la valeur est un nombre
    this.is = function(value)
    {
        return $.isNumeric(value);
    };
};