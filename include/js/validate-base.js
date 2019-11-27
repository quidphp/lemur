"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validate
// script with behaviours related to basic validation
quid.base.validate = new function() {
    var base = quid.base;
    
    // isNumericDash
    // retourne vrai si la valeur contient seulement des caractères numérique ou -
    this.isNumericDash = function(value)
    {
        var r = false;
        var regex = new RegExp("^[0-9\-]+$");
        
        if(base.str.is(value) && regex.test(value))
        r = true;
        
        return r;
    }
};