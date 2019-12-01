/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// arr
// script with a set of helper functions related to arrays
const Arr = new function() 
{    
    // instance
    const $inst = this;
    
    
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
        let r = false;
        
        if(!Scalar.is(value))
        {
            const length = !!value && "length" in value && value.length;
            const type = Vari.type(value);

            if(!(Func.is(value) || Dom.isWindow(value)))
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
        start = Num.isInt(start)? start:0;
        end = Num.isInt(end)? end:undefined;
        return Array.prototype.slice.call(array,start,end);
    };
    
    
    // sliceStart
    // fait un slice à partir du début d'un tableau
    this.sliceStart = function(start,array)
    {
        return $inst.slice(start,true,array);
    }
}

// export
Lemur.Arr = Arr;