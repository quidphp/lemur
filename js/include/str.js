/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// str
// script with a set of helper functions related to strings
const Str = new function() 
{    
    // instance
    const $inst = this;
    
    
    // is
    // retourne vrai si la valeur est une string
    this.is = function(value) 
    {
        return typeof(value) === 'string';
    }

    
    // isEmpty
    // retourne vrai si la valeur est une string vide
    this.isEmpty = function(value) 
    {
        return ($inst.is(value) && !value.length)? true:false;
    }
    
    
    // isNotEmpty
    // retourne vrai si la valeur est une string non vide
    this.isNotEmpty = function(value) 
    {
        return ($inst.is(value) && value.length)? true:false;
    }


    // isStart
    // retourne vrai si la string commence par needle
    this.isStart = function(needle,value)
    {
        return ($inst.is(needle) && $inst.is(value))? (value.slice(0,needle.length) == needle):false;
    }


    // isEnd
    // retourne vrai si la string finit par needle
    this.isEnd = function(needle,value)
    {
        return ($inst.is(needle) && $inst.is(value))? (value.slice(-needle.length) == needle):false;
    }


    // lowerFirst
    // met la première lettre de la string lowercase
    this.lowerFirst = function(value)
    {
        return ($inst.isNotEmpty(value))? value.charAt(0).toLowerCase() + value.slice(1):null;
    }
    
    
    // upperFirst
    // met la première lettre de la string uppercase
    this.upperFirst = function(value)
    {
        return ($inst.isNotEmpty(value))? value.charAt(0).toUpperCase() + value.slice(1):null;
    }


    // trim
    // trim une string
    this.trim = function(value)
    {
        return $.trim(value);
    }
    
    
    // cast
    // retourne une valeur string
    // si la valeur est null retourne ''
    this.cast = function(value)
    {
        return (value == null)? '':String(value);
    }
    
    
    // quote
    // permet d'enrobber une string dans des quotes
    // possible de spécifier double ou non
    this.quote = function(value,double)
    {
        let r = null;
        const quote = (double === true)? '"':"'";
        
        if($inst.is(value))
        r = quote+value+quote;
        
        return r;
    }
    
    
    // explode
    // explode une chaîne
    // retourne un tableau dans tous les cas
    this.explode = function(delimiter,value)
    {
        return ($inst.is(delimiter) && $inst.is(value))? value.split(delimiter):[];
    }
    
    
    // explodeIndex
    // split une string et retourne l'index demandé en premier argument
    this.explodeIndex = function(index,delimiter,value)
    {
        let r = null;
        const x = $inst.explode(delimiter,value);
        
        if(Num.isInt(index) && $inst.isNotEmpty(x[index]))
        r = x[index];
        
        return r;
    }
    
    
    // each
    // permet de faire un each sur chaque lettre de la string
    this.each = function(value,callback) 
    {
        let r = null;
        
        if($inst.is(value))
        {
            const arr = $inst.explode('',value);
            r = Arr.each(arr,callback);
        }
        
        return r;
    }
}

// export
Lemur.Str = Str;