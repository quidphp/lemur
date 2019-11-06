"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// obj
// script with a set of helper functions related to objects

// isObject
// retourne vrai si c'est un objet
quid.base.isObject = function(value)
{
    return typeof(value) === 'object';
}


// isPlain
// retourne vrai si c'est un objet plain
quid.base.isPlainObject = function(value)
{
    return $.isPlainObject(value);
}


// objectHasProperty
// retourne vrai si l'objet a la propriété
quid.base.objectHasProperty = function(prop,value)
{
    return (quid.base.isString(prop) && quid.base.isObject(value))? value.hasOwnProperty(prop):false
}


// objClimb
// permet de grimper dans un objet à partir d'un tableau
quid.base.objClimb = function(array,r) 
{
    if(quid.base.isArray(array) && quid.base.isObject(r))
    {
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            
            if(quid.base.objectHasProperty(value,r))
            r = r[value];
            
            else
            {
                r = null;
                break;
            }
        }
    }
    
    return r;
}