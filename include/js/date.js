"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// date
// script with functions related to date and time
quid.base.date = new function() {
    
    // timestamp
    // retourne le timestamp courant
    this.timestamp = function() 
    {
        return (new Date).getTime();
    }
};