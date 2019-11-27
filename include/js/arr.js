"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// arr
// script with a set of helper functions related to arrays
quid.base.arr = new function() {
    
    // is
    // retourne vrai si la valeur est un tableau
    this.is = function(value) 
    {
        return $.isArray(value);
    }
    
    
    // isEmpty
    // retourne vrai si la valeur est un array vide
    this.isEmpty = function(value) 
    {
        return (this.is(value) && !value.length)? true:false;
    }
    
    
    // isNotEmpty
    // retourne vrai si la valeur est un array non vide
    this.isNotEmpty = function(value) 
    {
        return (this.is(value) && value.length)? true:false;
    }
    
    
    // in
    // retourne vrai si la valeur est dans le tableau
    // retourne un boolean
    this.in = function(value,array) 
    {
        return ($.inArray(value,array) !== -1)? true:false;
    }
};