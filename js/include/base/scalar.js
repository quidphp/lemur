"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scalar
// script with functions related to scalar values
quid.base.scalar = new function() {
    
    // is
    // retourne vrai si la valeur est scalar
    this.is = function(value) 
    {
        return (/boolean|number|string/).test(typeof value);
    }
};