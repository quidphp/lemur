"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// str
// script with a set of helper functions related to strings

// isScalar
// retourne vrai si la valeur est scalar
quid.base.isScalar = function(value) 
{
    return (/boolean|number|string/).test(typeof value);
}


// isString
// retourne vrai si la valeur est une string
quid.base.isString = function(value) 
{
    return ($.type(value) === 'string')? true:false;
};


// isStringNotEmpty
// retourne vrai si la valeur est une string non vide
quid.base.isStringNotEmpty = function(value) 
{
    return (quid.base.isString(value) && value)? true:false;
};


// isStringStart
// retourne vrai si la string commence par needle
quid.base.isStringStart = function(needle,value)
{
    return (quid.base.isString(needle) && quid.base.isString(value))? (value.slice(0,needle.length) == needle):false;
};


// isStringEnd
// retourne vrai si la string finit par needle
quid.base.isStringEnd = function(needle,value)
{
    return (quid.base.isString(needle) && quid.base.isString(value))? (value.slice(-needle.length) == needle):false;
};


// ucfirst
// met la première lettre de la string uppercase
quid.base.ucfirst = function(value)
{
    return (quid.base.isStringNotEmpty(value))? value.charAt(0).toUpperCase() + value.slice(1):null;
}


// lcfirst
// met la première lettre de la string lowercase
quid.base.lcfirst = function(value)
{
    return (quid.base.isStringNotEmpty(value))? value.charAt(0).toLowerCase() + value.slice(1):null;
}


// strFirst
// split une string et retourne le premier élément du split
quid.base.strFirst = function(value,delimiter)
{
    var r = null;
    
    if(quid.base.isStringNotEmpty(value) && quid.base.isStringNotEmpty(delimiter))
    {
        value = value.split(delimiter);
        if(quid.base.isStringNotEmpty(value[0]))
        r = value[0];
    }
    
    return r;
}