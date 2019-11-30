/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// arr
// script with a set of helper functions related to arrays
quid.arr = new function() 
{    
    // instance
    var $inst = this;
    
    
    // is
    // retourne vrai si la valeur est un tableau
    this.is = function(value) 
    {
        return Array.isArray(value);
    }
    
    
    // isLike
    // retourne vrai si la variable est comme un tableau
    this.isLike = function(value)
    {
        var r = false;
        
        if(!quid.scalar.is(value))
        {
            var length = !!value && "length" in value && value.length;
            var type = quid.vari.type(value);

            if(!(quid.func.is(value) || quid.node.isWindow(value)))
            r = type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in value;
        }
        
        return r;
    }
    
    
    // isEmpty
    // retourne vrai si la valeur est un array vide
    this.isEmpty = function(value) 
    {
        return ($inst.is(value) && !value.length)? true:false;
    }
    
    
    // isNotEmpty
    // retourne vrai si la valeur est un array non vide
    this.isNotEmpty = function(value) 
    {
        return ($inst.is(value) && value.length)? true:false;
    }
    
    
    // in
    // retourne vrai si la valeur est dans le tableau
    // retourne un boolean
    this.in = function(value,array) 
    {
        return ($.inArray(value,array) !== -1)? true:false;
    }
    
    
    // slice
    // fait un slice sur un tableau avec un start et un end
    this.slice = function(start,end,array)
    {
        start = quid.number.isInt(start)? start:0;
        end = quid.number.isInt(end)? end:undefined;
        return Array.prototype.slice.call(array,start,end);
    };
    
    
    // sliceStart
    // fait un slice à partir du début d'un tableau
    this.sliceStart = function(start,array)
    {
        return $inst.slice(start,true,array);
    }
};