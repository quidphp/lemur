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


    // unique
    // retourne un int jamais utilisé, utile pour générer des ids unique
    this.unique = (function(value)
    {
        var i = 0;
        return function() {
            return i++;
        };
    })();
};