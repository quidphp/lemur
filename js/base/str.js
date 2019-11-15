"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// str
// script with a set of helper functions related to strings
quid.base.str = new function() {
    var base = quid.base;
    
    // is
    // retourne vrai si la valeur est une string
    this.is = function(value) 
    {
        return ($.type(value) === 'string')? true:false;
    };


    // isNotEmpty
    // retourne vrai si la valeur est une string non vide
    this.isNotEmpty = function(value) 
    {
        return (this.is(value) && value)? true:false;
    };


    // isStart
    // retourne vrai si la string commence par needle
    this.isStart = function(needle,value)
    {
        return (this.is(needle) && this.is(value))? (value.slice(0,needle.length) == needle):false;
    };


    // isEnd
    // retourne vrai si la string finit par needle
    this.isEnd = function(needle,value)
    {
        return (this.is(needle) && this.is(value))? (value.slice(-needle.length) == needle):false;
    };


    // upperFirst
    // met la première lettre de la string uppercase
    this.upperFirst = function(value)
    {
        return (this.isNotEmpty(value))? value.charAt(0).toUpperCase() + value.slice(1):null;
    }


    // lowerFirst
    // met la première lettre de la string lowercase
    this.lowerFirst = function(value)
    {
        return (this.isNotEmpty(value))? value.charAt(0).toLowerCase() + value.slice(1):null;
    }


    // explodeIndex
    // split une string et retourne l'index demandé en premier argument
    this.explodeIndex = function(index,delimiter,value)
    {
        var r = null;
        
        if(base.number.is(index) && this.isNotEmpty(value) && this.isNotEmpty(delimiter))
        {
            value = value.split(delimiter);
            
            if(this.isNotEmpty(value[index]))
            r = value[index];
        }
        
        return r;
    }
};