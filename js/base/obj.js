"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// obj
// script with a set of helper functions related to objects
quid.base.obj = new function() {
    var base = quid.base;
    
    // is
    // retourne vrai si c'est un objet
    this.is = function(value)
    {
        return typeof(value) === 'object';
    }


    // isPlain
    // retourne vrai si c'est un objet plain
    this.isPlain = function(value)
    {
        return $.isPlainObject(value);
    }


    // hasProperty
    // retourne vrai si l'objet a la propriété
    this.hasProperty = function(prop,value)
    {
        return (base.str.is(prop) && this.is(value))? value.hasOwnProperty(prop):false
    }


    // climb
    // permet de grimper dans un objet à partir d'un tableau
    this.climb = function(array,r) 
    {
        if(base.arr.is(array) && this.is(r))
        {
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                
                if(this.hasProperty(value,r))
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
};