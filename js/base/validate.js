"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validate
// script with behaviours related to basic validation

// isRegexNumericDash
// retourne vrai si la valeur contient seulement des caractères numérique ou -
quid.base.isRegexNumericDash = function(value)
{
    var r = false;
    var regex = new RegExp("^[0-9\-]+$");
    
    if(quid.base.isString(value) && regex.test(value))
    r = true;
    
    return r;
}