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
    // si allowZero est true, retourne true si zero
    isPositive: function(value,allowZero)
    {
        let r = false;
        
        if(this.is(value))
        {
            value = this.cast(value);
            
            if(value > 0 || (allowZero === true && value === 0))
            r = true;
        }
        
        return r;
    },
    
    
    // isNegative
    // retourne vrai si c'est une variable numérique positive (< 0)
    // si allowZero est true, retourne true si zero
    isNegative: function(value,allowZero)
    {
        let r = false;
        
        if(this.is(value))
        {
            value = this.cast(value);
            
            if(value < 0 || (allowZero === true && value === 0))
            r = true;
        }
        
        return r;
    },
    
    // isOdd
    // vérifie que la valeur est un chiffre impair
    isOdd: function(value)
    {
        return (this.is(value) && !Integer.is(value / 2));
    },
    
    
    // isEven
    // vérifie que la valeur est un chiffre pair
    isEven: function(value)
    {
        return (this.is(value) && Integer.is(value / 2));
    },
    
    
    // isNan
    // retourne vrai si la valeur est nan
    isNan: function(value)
    {
        return isNaN(value);
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