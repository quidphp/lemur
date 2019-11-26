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

    
    // isEmpty
    // retourne vrai si c'est un objet vide
    this.isEmpty = function(value)
    {
        return $.isEmptyObject(value);
    }
    
    
    // isNotEmpty
    // retourne vrai si c'est un objet non-vide
    this.isNotEmpty = function(value)
    {
        return !$.isEmptyObject(value);
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

    
    // replace
    // retourne un nouvel objet contenant le résultat d'un merge unidimensionnel de tous les objets données en argument
    this.replace = function() {
        var r = {};
        var args = [r];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        return $.extend.apply(null,args);
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