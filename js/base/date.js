"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// date
// script with functions related to date and time

// timestamp
// retourne le timestamp courant
quid.base.timestamp = function() 
{
    return (new Date).getTime();
}


// uniqueInt
// retourne un int jamais utilisé, utile pour générer des ids unique
quid.base.uniqueInt = (function(value)
{
    var i = 0;
    return function() {
        return i++;
    };
})();