/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// num
// script with functions related to numbers
const NumPrimitive =  {
    
    // is
    // retourne vrai si la valeur est un nombre
    is: function(value)
    {
        let r = false;
        const type = Vari.type(value);
        
        if(type === "number" || type === "string")
        r = !isNaN(value - parseFloat(value));
        
        return r;
    },
    
    
    // isEmpty
    // retourne vrai si c'est une variable numérique vide
    isEmpty: function(value)
    {
        return (this.is(value))? Vari.isEmpty(this.cast(value)):false;
    },
    
    
    // isNotEmpty
    // retourne vrai si c'est une variable numérique non-vide
    isNotEmpty: function(value)
    {
        return (this.is(value))? Vari.isNotEmpty(this.cast(value)):false;
    },
    
    
    // isPositive
    // retourne vrai si c'est une variable numérique positive (> 0)
    isPositive: function(value)
    {
        return (this.is(value) && this.cast(value) > 0)? true:false;
    },
    
    
    // isNegative
    // retourne vrai si c'est une variable numérique positive (< 0)
    isNegative: function(value)
    {
        return (this.is(value) && this.cast(value) < 0)? true:false;
    },
    
    
    // cast
    // retourne la variable sous forme de nombre
    cast: function(value)
    {
        return (this.is(value))? parseFloat(value):null;
    },
    
    
    // str
    // retourne le nombre sous forme de string
    str: function(value)
    {
        return (this.is(value))? Number(value).toString():null;
    }
}